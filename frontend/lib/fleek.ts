import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk';

const patService = new PersonalAccessTokenService({
    personalAccessToken: process.env.FLEEK_ACCESS_TOKEN!,
    projectId: process.env.FLEEK_PROJECT_ID!
})

export const fleekSdk = new FleekSdk({ accessTokenService: patService })