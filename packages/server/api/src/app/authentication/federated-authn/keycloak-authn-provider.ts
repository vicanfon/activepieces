import {
    assertNotEqual,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import jwksClient from 'jwks-rsa'
import { JwtSignAlgorithm, jwtUtils } from '../../helper/jwt-utils'
import { federatedAuthnService } from './federated-authn-service'
import { system } from '../../helper/system/system'
import { AppSystemProp } from '@activepieces/server-shared'

const getKeycloakIssuerUrl = () => {
    const authUrl = system.get(AppSystemProp.KEYCLOAK_AUTH_URL)
    // Heuristic: authUrl usually ends with /protocol/openid-connect/auth
    // Issuer is usually the base of that
    if (authUrl && authUrl.includes('/protocol/openid-connect/auth')) {
        return authUrl.split('/protocol/openid-connect/auth')[0]
    }
    // Fallback or explicit conf if we had one.
    // Ideally we would want KEYCLOAK_ISSUER_URL env var, but for now we will try to use a separate logic or just rely on what we have.
    // The previous plan mentioned KEYCLOAK_AUTH_URL, TOKEN_URL, USERINFO_URL.
    // We can't easily guess JWKS URI from just AUTH_URL without standard structure assumption.
    // Let's assume standard Keycloak structure: <host>/realms/<realm>
    return authUrl ? new URL(authUrl).origin + new URL(authUrl).pathname.replace('/protocol/openid-connect/auth', '') : ''
}

let client: jwksClient.JwksClient | undefined

const getKeyLoader = () => {
    if (client) {
        return client
    }
    // Prefer explicitly configured JWKS URL if available, otherwise derive from Auth URL
    const jwksUri = system.get(AppSystemProp.KEYCLOAK_JWKS_URL) ?? system.getOrThrow(AppSystemProp.KEYCLOAK_AUTH_URL).replace('/auth', '/certs')
    client = jwksClient({
        rateLimit: true,
        cache: true,
        jwksUri,
    })
    return client
}

export const keycloakAuthnProvider = (log: FastifyBaseLogger) => ({
    async getLoginUrl(params: GetLoginUrlParams): Promise<string> {
        const { clientId, platformId } = params
        const authUrl = system.getOrThrow(AppSystemProp.KEYCLOAK_AUTH_URL)
        const loginUrl = new URL(authUrl)
        loginUrl.searchParams.set('client_id', clientId)
        loginUrl.searchParams.set(
            'redirect_uri',
            await federatedAuthnService(log).getThirdPartyRedirectUrl(platformId),
        )
        loginUrl.searchParams.set('scope', 'openid email profile')
        loginUrl.searchParams.set('response_type', 'code')

        return loginUrl.href
    },

    async authenticate(
        params: AuthenticateParams,
    ): Promise<KeycloakAuthnIdToken> {
        const { clientId, clientSecret, authorizationCode, platformId } = params
        const idToken = await exchangeCodeForIdToken(
            log,
            platformId,
            clientId,
            clientSecret,
            authorizationCode,
        )
        return verifyIdToken(clientId, idToken)
    },
})

const exchangeCodeForIdToken = async (
    log: FastifyBaseLogger,
    platformId: string | undefined,
    clientId: string,
    clientSecret: string,
    code: string,
): Promise<string> => {
    const tokenUrl = system.getOrThrow(AppSystemProp.KEYCLOAK_TOKEN_URL)
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: await federatedAuthnService(log).getThirdPartyRedirectUrl(platformId),
            grant_type: 'authorization_code',
        }),
    })

    if (!response.ok) {
        log.error({ status: response.status, body: await response.text() }, 'Failed to exchange code for token')
        throw new Error('Failed to exchange code for token')
    }

    const { id_token: idToken } = await response.json()
    return idToken
}

const verifyIdToken = async (
    clientId: string,
    idToken: string,
): Promise<KeycloakAuthnIdToken> => {
    const { header } = jwtUtils.decode({ jwt: idToken })

    const keyLoader = getKeyLoader()
    const signingKey = await keyLoader.getSigningKey(header.kid)
    const publicKey = signingKey.getPublicKey()

    const issuer = getKeycloakIssuerUrl()

    const payload = await jwtUtils.decodeAndVerify<IdTokenPayloadRaw>({
        jwt: idToken,
        key: publicKey,
        issuer: [issuer], // We might need to be flexible here or strictly check
        algorithm: JwtSignAlgorithm.RS256,
        audience: clientId,
    })

    assertNotEqual(payload.email_verified, false, 'payload.email_verified', 'Email is not verified')
    return {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
    }
}

type IdTokenPayloadRaw = {
    email: string
    email_verified: boolean
    given_name: string
    family_name: string
    sub: string
    aud: string
    iss: string
}

type GetLoginUrlParams = {
    clientId: string
    platformId: string | undefined
}

type AuthenticateParams = {
    platformId: string | undefined
    clientId: string
    clientSecret: string
    authorizationCode: string
}

export type KeycloakAuthnIdToken = {
    email: string
    firstName: string
    lastName: string
}
