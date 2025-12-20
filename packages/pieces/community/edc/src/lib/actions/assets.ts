
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const createAsset = createAction({
  name: "create_asset",
  displayName: "Create Asset",
  description: "Create a new asset in the EDC",
  auth: edcAuth,
  props: {
    assetId: Property.ShortText({
      displayName: "Asset ID",
      required: true,
    }),
    assetName: Property.ShortText({
      displayName: "Asset Name",
      required: false,
    }),
    assetDescription: Property.ShortText({
      displayName: "Description",
      required: false,
    }),
    assetContentType: Property.ShortText({
      displayName: "Content Type",
      required: false,
      defaultValue: "application/json",
    }),
    assetVersion: Property.ShortText({
      displayName: "Version",
      required: false,
      defaultValue: "1.0.0",
    }),
    baseUrl: Property.ShortText({
      displayName: "Data Address Base URL",
      description: "URL where the data is located",
      required: true,
    }),
    dataAddressType: Property.ShortText({
      displayName: "Data Address Type",
      required: true,
      defaultValue: "HttpData",
    }),
    additionalProperties: Property.Json({
      displayName: "Additional Properties",
      required: false,
    }),
    privateProperties: Property.Json({
      displayName: "Private Properties",
      required: false,
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
      "@id": propsValue.assetId,
      "properties": {
        "name": propsValue.assetName,
        "description": propsValue.assetDescription,
        "contenttype": propsValue.assetContentType,
        "version": propsValue.assetVersion,
        ...(propsValue.additionalProperties as object),
      },
      "privateProperties": propsValue.privateProperties,
      "dataAddress": {
        "type": propsValue.dataAddressType,
        "baseUrl": propsValue.baseUrl
      }
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/assets`,
      headers,
      body,
    });

    return response.body;
  },
});

export const getAsset = createAction({
  name: "get_asset",
  displayName: "Get Asset by ID",
  description: "Retrieve an asset by its ID",
  auth: edcAuth,
  props: {
    assetId: Property.ShortText({
      displayName: "Asset ID",
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
      url: `${authValue.baseUrl}/v3/assets/${propsValue.assetId}`,
      headers,
    });

    return response.body;
  },
});

export const queryAssets = createAction({
  name: "query_assets",
  displayName: "Query Assets",
  description: "Query assets with filters",
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
    sortField: Property.ShortText({
      displayName: "Sort Field",
      required: false,
      defaultValue: "createdAt",
    }),
    sortOrder: Property.StaticDropdown({
      displayName: "Sort Order",
      required: false,
      defaultValue: "DESC",
      options: {
        options: [
          { label: "Ascending", value: "ASC" },
          { label: "Descending", value: "DESC" },
        ]
      }
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
      "sortOrder": propsValue.sortOrder,
      "sortField": propsValue.sortField,
      "filterExpression": propsValue.filterExpression || []
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${authValue.baseUrl}/v3/assets/request`,
      headers,
      body,
    });

    return response.body;
  },
});

export const updateAsset = createAction({
  name: "update_asset",
  displayName: "Update Asset",
  description: "Update an existing asset",
  auth: edcAuth,
  props: {
    assetId: Property.ShortText({
      displayName: "Asset ID",
      required: true,
    }),
    assetName: Property.ShortText({
      displayName: "Asset Name",
      required: false,
    }),
    assetDescription: Property.ShortText({
      displayName: "Description",
      required: false,
    }),
    assetContentType: Property.ShortText({
      displayName: "Content Type",
      required: false,
      defaultValue: "application/json",
    }),
    baseUrl: Property.ShortText({
      displayName: "Data Address Base URL",
      description: "URL where the data is located",
      required: true,
    }),
    dataAddressType: Property.ShortText({
      displayName: "Data Address Type",
      required: true,
      defaultValue: "HttpData",
    }),
     additionalProperties: Property.Json({
      displayName: "Additional Properties",
      required: false,
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
      "@id": propsValue.assetId,
      "properties": {
        "name": propsValue.assetName,
        "description": propsValue.assetDescription,
        "contenttype": propsValue.assetContentType,
        ...(propsValue.additionalProperties as object)
      },
      "dataAddress": {
        "type": propsValue.dataAddressType,
        "baseUrl": propsValue.baseUrl
      }
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.PUT,
      url: `${authValue.baseUrl}/v3/assets`,
      headers,
      body,
    });

    return response.body;
  },
});

export const deleteAsset = createAction({
  name: "delete_asset",
  displayName: "Delete Asset",
  description: "Delete an asset by ID",
  auth: edcAuth,
  props: {
    assetId: Property.ShortText({
      displayName: "Asset ID",
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
      url: `${authValue.baseUrl}/v3/assets/${propsValue.assetId}`,
      headers,
    });

    return response.body;
  },
});
