
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const createContractDefinition = createAction({
  name: "create_contract_definition",
  displayName: "Create Contract Definition",
  description: "Create a new contract definition",
  auth: edcAuth,
  props: {
    contractDefinitionId: Property.ShortText({
      displayName: "Contract Definition ID",
      required: true,
    }),
    accessPolicyId: Property.ShortText({
      displayName: "Access Policy ID",
      required: true,
    }),
    contractPolicyId: Property.ShortText({
      displayName: "Contract Policy ID",
      required: true,
    }),
    assetsSelector: Property.Json({
      displayName: "Assets Selector",
      description: "Array of asset selector criteria",
      required: false,
      defaultValue: []
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
      "@id": propsValue.contractDefinitionId,
      "accessPolicyId": propsValue.accessPolicyId,
      "contractPolicyId": propsValue.contractPolicyId,
      "assetsSelector": propsValue.assetsSelector || []
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/contractdefinitions`,
      headers,
      body,
    });

    return response.body;
  },
});

export const getContractDefinition = createAction({
  name: "get_contract_definition",
  displayName: "Get Contract Definition",
  description: "Retrieve a contract definition by ID",
  auth: edcAuth,
  props: {
    contractDefinitionId: Property.ShortText({
      displayName: "Contract Definition ID",
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
      url: `${authValue.baseUrl}/v3/contractdefinitions/${propsValue.contractDefinitionId}`,
      headers,
    });

    return response.body;
  },
});

export const queryContractDefinitions = createAction({
  name: "query_contract_definitions",
  displayName: "Query Contract Definitions",
  description: "Query contract definitions with filters",
  auth: edcAuth,
  props: {
    offset: Property.Number({
      displayName: "Offset",
      required: false,
      defaultValue: 0,
    }),
    limit: Property.Number({
      displayName: "Limit",
      required: false,
      defaultValue: 50,
    }),
     filterExpression: Property.Json({
        displayName: "Filter Expression",
        description: "Array of filter expressions",
        required: false,
        defaultValue: []
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
      "@type": "QuerySpec",
      "offset": propsValue.offset,
      "limit": propsValue.limit,
      "filterExpression": propsValue.filterExpression || []
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/contractdefinitions/request`,
      headers,
      body,
    });

    return response.body;
  },
});

export const updateContractDefinition = createAction({
  name: "update_contract_definition",
  displayName: "Update Contract Definition",
  description: "Update a contract definition",
  auth: edcAuth,
  props: {
    contractDefinitionId: Property.ShortText({
      displayName: "Contract Definition ID",
      required: true,
    }),
    accessPolicyId: Property.ShortText({
      displayName: "Access Policy ID",
      required: true,
    }),
    contractPolicyId: Property.ShortText({
      displayName: "Contract Policy ID",
      required: true,
    }),
    assetsSelector: Property.Json({
      displayName: "Assets Selector",
      description: "Array of asset selector criteria",
      required: false,
      defaultValue: []
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
      "@id": propsValue.contractDefinitionId,
      "accessPolicyId": propsValue.accessPolicyId,
      "contractPolicyId": propsValue.contractPolicyId,
      "assetsSelector": propsValue.assetsSelector || []
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.PUT,
      url: `${authValue.baseUrl}/v3/contractdefinitions`,
      headers,
      body,
    });

    return response.body;
  },
});

export const deleteContractDefinition = createAction({
  name: "delete_contract_definition",
  displayName: "Delete Contract Definition",
  description: "Delete a contract definition",
  auth: edcAuth,
  props: {
    contractDefinitionId: Property.ShortText({
      displayName: "Contract Definition ID",
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
      method: HttpMethod.DELETE,
      url: `${authValue.baseUrl}/v3/contractdefinitions/${propsValue.contractDefinitionId}`,
      headers,
    });

    return response.body;
  },
});
