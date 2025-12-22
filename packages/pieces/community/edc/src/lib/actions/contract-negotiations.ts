
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const initiateNegotiation = createAction({
  name: "initiate_negotiation",
  displayName: "Initiate Contract Negotiation",
  description: "Start a new contract negotiation",
  auth: edcAuth,
  props: {
    connectorAddress: Property.ShortText({
      displayName: "Counter Party Address",
      description: "The address of the counter party connector (e.g., http://provider:8282/api/dsp)",
      required: true,
    }),
    protocol: Property.ShortText({
      displayName: "Protocol",
      required: true,
      defaultValue: "dataspace-protocol-http",
    }),
    connectorId: Property.ShortText({
      displayName: "Counter Party ID",
      required: true,
      defaultValue: "providerId",
    }),
    offerId: Property.ShortText({
      displayName: "Offer ID",
      required: true,
    }),
    assetId: Property.ShortText({
      displayName: "Asset ID",
      required: true,
    }),
    policy: Property.Json({
      displayName: "Policy",
      description: "Full policy object for the offer",
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const body = {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "https://w3id.org/edc/v0.0.1/ns/ContractRequest",
      "counterPartyAddress": propsValue.connectorAddress,
      "protocol": propsValue.protocol,
      "policy": {
          "@context": "http://www.w3.org/ns/odrl.jsonld",
          "@type": "odrl:Offer",
          "@id": propsValue.offerId,
          "assigner": propsValue.connectorId,
          "target": propsValue.assetId,
          ...(propsValue.policy as object)
      }
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/contractnegotiations`,
      headers,
      body,
    });

    return response.body;
  },
});

export const getNegotiation = createAction({
  name: "get_negotiation",
  displayName: "Get Negotiation",
  description: "Retrieve a negotiation by ID",
  auth: edcAuth,
  props: {
    negotiationId: Property.ShortText({
      displayName: "Negotiation ID",
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = {};
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${authValue.baseUrl}/v3/contractnegotiations/${propsValue.negotiationId}`,
      headers,
    });

    return response.body;
  },
});

export const getNegotiationState = createAction({
  name: "get_negotiation_state",
  displayName: "Get Negotiation State",
  description: "Retrieve the state of a negotiation",
  auth: edcAuth,
  props: {
    negotiationId: Property.ShortText({
      displayName: "Negotiation ID",
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = {};
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${authValue.baseUrl}/v3/contractnegotiations/${propsValue.negotiationId}/state`,
      headers,
    });

    return response.body;
  },
});

export const getNegotiationAgreement = createAction({
  name: "get_negotiation_agreement",
  displayName: "Get Negotiation Agreement",
  description: "Retrieve the agreement for a negotiation",
  auth: edcAuth,
  props: {
    negotiationId: Property.ShortText({
      displayName: "Negotiation ID",
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = {};
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${authValue.baseUrl}/v3/contractnegotiations/${propsValue.negotiationId}/agreement`,
      headers,
    });

    return response.body;
  },
});

export const terminateNegotiation = createAction({
  name: "terminate_negotiation",
  displayName: "Terminate Negotiation",
  description: "Terminate a negotiation",
  auth: edcAuth,
  props: {
    negotiationId: Property.ShortText({
      displayName: "Negotiation ID",
      required: true,
    }),
    reason: Property.ShortText({
      displayName: "Reason",
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const body = {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "https://w3id.org/edc/v0.0.1/ns/TerminateNegotiation",
      "reason": propsValue.reason,
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/contractnegotiations/${propsValue.negotiationId}/terminate`,
      headers,
      body,
    });

    return response.body;
  },
});
