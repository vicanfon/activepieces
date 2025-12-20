import { AppSystemProp } from '@activepieces/server-shared'
import { assertNotNullOrUndefined, AuthenticationResponse,
    FederatedAuthnLoginResponse,
    isNil,
    ThirdPartyAuthnProviderEnum,
    UserIdentityProvider,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import { authenticationService } from '../authentication.service'
import { system } from '../../helper/system/system'
import { domainHelper } from '../../ee/custom-domains/domain-helper'
import { keycloakAuthnProvider } from './keycloak-authn-provider'

export const federatedAuthnService = (log: FastifyBaseLogger) => ({
    async login({
        platformId,
        providerName,
    }: LoginParams): Promise<FederatedAuthnLoginResponse> {
        if (providerName === ThirdPartyAuthnProviderEnum.KEYCLOAK) {
             const { clientId } = await getKeycloakClientIdAndSecret()
             const loginUrl = await keycloakAuthnProvider(log).getLoginUrl({
                clientId,
                platformId,
             })
             return {
                loginUrl,
             }
        }
        throw new Error(`Provider ${providerName} is not supported`)
    },

    async claim({
        platformId,
        code,
        providerName,
    }: ClaimParams): Promise<AuthenticationResponse> {
        if (providerName === ThirdPartyAuthnProviderEnum.KEYCLOAK) {
            const { clientId, clientSecret } = await getKeycloakClientIdAndSecret()
            const idToken = await keycloakAuthnProvider(log).authenticate({
                clientId,
                clientSecret,
                authorizationCode: code,
                platformId,
            })

            return authenticationService(log).federatedAuthn({
                email: idToken.email,
                firstName: idToken.firstName,
                lastName: idToken.lastName,
                trackEvents: true,
                newsLetter: true,
                provider: UserIdentityProvider.KEYCLOAK,
                predefinedPlatformId: platformId ?? null,
            })
        }
        throw new Error(`Provider ${providerName} is not supported`)
    },
    async getThirdPartyRedirectUrl(
        platformId: string | undefined,
    ): Promise<string> {
        return domainHelper.getInternalUrl({
            path: '/redirect',
            platformId,
        })
    },
})

async function getKeycloakClientIdAndSecret() {
    return {
        clientId: system.getOrThrow(AppSystemProp.KEYCLOAK_CLIENT_ID),
        clientSecret: system.getOrThrow(AppSystemProp.KEYCLOAK_CLIENT_SECRET),
    }
}

type LoginParams = {
    platformId: string | undefined
    providerName: ThirdPartyAuthnProviderEnum
}

type ClaimParams = {
    platformId: string | undefined
    code: string
    providerName: ThirdPartyAuthnProviderEnum
}
