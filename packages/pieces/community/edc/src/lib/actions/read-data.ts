
import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { edcAuth, EdcAuthType } from "../common/auth";

export const readTransferData = createAction({
  name: "read_transfer_data",
  displayName: "Read Data from Transfer",
  description: "Waits for a transfer to complete and reads the data",
  auth: edcAuth,
  props: {
    transferProcessId: Property.ShortText({
      displayName: "Transfer Process ID",
      required: true,
    }),
    timeout: Property.Number({
      displayName: "Timeout (seconds)",
      description: "Max time to wait for transfer completion",
      required: false,
      defaultValue: 300,
    }),
  },
  async run({ auth, propsValue }) {
    const authValue = auth as unknown as EdcAuthType;
    const headers: Record<string, string> = {};
    if (authValue.apiKey) {
      headers["x-api-key"] = authValue.apiKey;
    }

    const transferId = propsValue.transferProcessId;
    const timeout = propsValue.timeout || 300;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout * 1000) {
      const stateResponse = await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `${authValue.baseUrl}/v3/transferprocesses/${transferId}`,
        headers,
      });

      const transfer = stateResponse.body;
      const state = transfer.state || transfer["edc:state"]; // Handle different JSON-LD variations if needed

      if (state === "COMPLETED") {
          // Assuming dataDestination has the info to fetch data.
          // In simple HttpData Pull, it might have properties like baseUrl, authKey, etc.
          // Note: The structure of dataDestination depends on the transfer type.
          // This implementation assumes HttpData.

          const dataDestination = transfer.dataDestination || transfer["edc:dataDestination"];
          if (!dataDestination) {
              throw new Error("Transfer completed but no data destination found.");
          }

          const dataUrl = dataDestination.baseUrl || dataDestination["edc:baseUrl"];

          if (!dataUrl) {
               throw new Error("Transfer completed but no baseUrl found in data destination.");
          }

          // Fetch the actual data
          // We might need to forward some auth headers if provided in the destination properties
          const dataHeaders: Record<string, string> = {};
          if (dataDestination.authKey && dataDestination.authCode) {
              dataHeaders[dataDestination.authKey] = dataDestination.authCode;
          }
           // Handle properties map if flat
          if(dataDestination.properties){
             if(dataDestination.properties.authKey && dataDestination.properties.authCode){
                 dataHeaders[dataDestination.properties.authKey] = dataDestination.properties.authCode;
             }
          }


          const dataResponse = await httpClient.sendRequest({
              method: HttpMethod.GET,
              url: dataUrl,
              headers: dataHeaders
          });

          return dataResponse.body;

      } else if (state === "TERMINATED") {
        throw new Error(`Transfer process terminated: ${transfer.errorDetail || "Unknown reason"}`);
      }

      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error(`Timeout waiting for transfer process ${transferId} to complete.`);
  },
});
