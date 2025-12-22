
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const initiateTransfer = createAction({
  name: "initiate_transfer",
  displayName: "Initiate Transfer Process",
  description: "Start a new transfer process",
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
    contractId: Property.ShortText({
      displayName: "Contract Agreement ID",
      required: true,
    }),
    transferType: Property.ShortText({
      displayName: "Transfer Type",
      required: true,
      defaultValue: "HttpData-PULL",
    }),
    dataDestinationType: Property.ShortText({
      displayName: "Data Destination Type",
      required: true,
      defaultValue: "HttpData",
    }),
    privateProperties: Property.Json({
        displayName: "Private Properties",
        required: false
    })
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const body = {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "https://w3id.org/edc/v0.0.1/ns/TransferRequest",
      "protocol": propsValue.protocol,
      "counterPartyAddress": propsValue.connectorAddress,
      "contractId": propsValue.contractId,
      "transferType": propsValue.transferType,
      "dataDestination": {
        "type": propsValue.dataDestinationType
      },
      "privateProperties": propsValue.privateProperties || {}
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/transferprocesses`,
      headers,
      body,
    });

    return response.body;
  },
});

export const getTransfer = createAction({
  name: "get_transfer",
  displayName: "Get Transfer Process",
  description: "Retrieve a transfer process by ID",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
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
      url: `${authValue.baseUrl}/v3/transferprocesses/${propsValue.transferProcessId}`,
      headers,
    });

    return response.body;
  },
});

export const getTransferState = createAction({
  name: "get_transfer_state",
  displayName: "Get Transfer Process State",
  description: "Retrieve the state of a transfer process",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
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
      url: `${authValue.baseUrl}/v3/transferprocesses/${propsValue.transferProcessId}/state`,
      headers,
    });

    return response.body;
  },
});

export const terminateTransfer = createAction({
  name: "terminate_transfer",
  displayName: "Terminate Transfer Process",
  description: "Terminate a transfer process",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
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
      "@type": "https://w3id.org/edc/v0.0.1/ns/TerminateTransfer",
      "reason": propsValue.reason,
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/transferprocesses/${propsValue.transferProcessId}/terminate`,
      headers,
      body,
    });

    return response.body;
  },
});

export const suspendTransfer = createAction({
  name: "suspend_transfer",
  displayName: "Suspend Transfer Process",
  description: "Suspend a transfer process",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
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
      "@type": "https://w3id.org/edc/v0.0.1/ns/SuspendTransfer",
      "reason": propsValue.reason,
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/transferprocesses/${propsValue.transferProcessId}/suspend`,
      headers,
      body,
    });

    return response.body;
  },
});

export const resumeTransfer = createAction({
  name: "resume_transfer",
  displayName: "Resume Transfer Process",
  description: "Resume a suspended transfer process",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
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
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/transferprocesses/${propsValue.transferProcessId}/resume`,
      headers,
    });

    return response.body;
  },
});
