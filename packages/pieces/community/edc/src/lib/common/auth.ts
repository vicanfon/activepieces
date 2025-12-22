
import { PieceAuth, Property } from "@activepieces/pieces-framework";

export type EdcAuthType = {
  baseUrl: string;
  apiKey?: string;
};

export const edcAuth = PieceAuth.CustomAuth({
  description: "EDC Authentication",
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: "Base URL",
      description: "The base URL of the EDC Management API (e.g., http://localhost:8181/api/management)",
      required: true,
    }),
    apiKey: Property.ShortText({
      displayName: "API Key",
      description: "The API Key for authentication (x-api-key header)",
      required: false,
    }),
  },
});
