export enum ThirdPartyAuthnProviderEnum {
    GOOGLE = 'google',
    SAML = 'saml',
    KEYCLOAK = 'keycloak',
}

export type ThirdPartyAuthnProvidersToShowMap = {
    [k in ThirdPartyAuthnProviderEnum]: boolean;
}