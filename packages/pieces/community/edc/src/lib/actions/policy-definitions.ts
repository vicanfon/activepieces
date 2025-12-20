
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const createPolicy = createAction({
  name: "create_policy",
  displayName: "Create Policy Definition",
  description: "Create a new policy definition",
  auth: edcAuth,
  props: {
    policyId: Property.ShortText({
      displayName: "Policy ID",
      required: true,
    }),
    policyType: Property.StaticDropdown({
        displayName: "Policy Type",
        required: true,
        defaultValue: "Set",
        options: {
            options: [
                { label: "Set", value: "Set" },
                { label: "Offer", value: "Offer" },
                { label: "Agreement", value: "Agreement" }
            ]
        }
    }),
    permissions: Property.Json({
      displayName: "Permissions",
      description: "Array of permissions",
      required: false,
      defaultValue: []
    }),
    prohibitions: Property.Json({
      displayName: "Prohibitions",
      description: "Array of prohibitions",
      required: false,
      defaultValue: []
    }),
    obligations: Property.Json({
      displayName: "Obligations",
      description: "Array of obligations",
      required: false,
      defaultValue: []
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
      "@id": propsValue.policyId,
      "policy": {
        "@context": "http://www.w3.org/ns/odrl.jsonld",
        "@type": propsValue.policyType,
        "@id": propsValue.policyId,
        "permission": propsValue.permissions || [],
        "prohibition": propsValue.prohibitions || [],
        "obligation": propsValue.obligations || []
      }
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/policydefinitions`,
      headers,
      body,
    });

    return response.body;
  },
});

export const getPolicy = createAction({
  name: "get_policy",
  displayName: "Get Policy Definition",
  description: "Retrieve a policy definition by ID",
  auth: edcAuth,
  props: {
    policyId: Property.ShortText({
      displayName: "Policy ID",
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
      url: `${authValue.baseUrl}/v3/policydefinitions/${propsValue.policyId}`,
      headers,
    });

    return response.body;
  },
});

export const queryPolicies = createAction({
  name: "query_policies",
  displayName: "Query Policy Definitions",
  description: "Query policy definitions with filters",
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
      url: `${authValue.baseUrl}/v3/policydefinitions/request`,
      headers,
      body,
    });

    return response.body;
  },
});

export const updatePolicy = createAction({
  name: "update_policy",
  displayName: "Update Policy Definition",
  description: "Update a policy definition",
  auth: edcAuth,
  props: {
    policyId: Property.ShortText({
      displayName: "Policy ID",
      required: true,
    }),
     policyType: Property.StaticDropdown({
        displayName: "Policy Type",
        required: true,
        defaultValue: "Set",
        options: {
            options: [
                { label: "Set", value: "Set" },
                { label: "Offer", value: "Offer" },
                { label: "Agreement", value: "Agreement" }
            ]
        }
    }),
    permissions: Property.Json({
      displayName: "Permissions",
      description: "Array of permissions",
      required: false,
      defaultValue: []
    }),
    prohibitions: Property.Json({
      displayName: "Prohibitions",
      description: "Array of prohibitions",
      required: false,
      defaultValue: []
    }),
    obligations: Property.Json({
      displayName: "Obligations",
      description: "Array of obligations",
      required: false,
      defaultValue: []
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
      "@id": propsValue.policyId,
      "policy": {
        "@context": "http://www.w3.org/ns/odrl.jsonld",
        "@type": propsValue.policyType,
        "@id": propsValue.policyId,
        "permission": propsValue.permissions || [],
        "prohibition": propsValue.prohibitions || [],
        "obligation": propsValue.obligations || []
      }
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.PUT,
      url: `${authValue.baseUrl}/v3/policydefinitions/${propsValue.policyId}`,
      headers,
      body,
    });

    return response.body;
  },
});

export const deletePolicy = createAction({
  name: "delete_policy",
  displayName: "Delete Policy Definition",
  description: "Delete a policy definition",
  auth: edcAuth,
  props: {
    policyId: Property.ShortText({
      displayName: "Policy ID",
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
      url: `${authValue.baseUrl}/v3/policydefinitions/${propsValue.policyId}`,
      headers,
    });

    return response.body;
  },
});
