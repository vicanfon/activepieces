
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import { edcAuth } from "./lib/common/auth";
import { createAsset, getAsset, queryAssets, updateAsset, deleteAsset } from "./lib/actions/assets";
import { createPolicy, getPolicy, queryPolicies, updatePolicy, deletePolicy } from "./lib/actions/policy-definitions";
import { createContractDefinition, getContractDefinition, queryContractDefinitions, updateContractDefinition, deleteContractDefinition } from "./lib/actions/contract-definitions";
import { initiateNegotiation, getNegotiation, getNegotiationState, getNegotiationAgreement, terminateNegotiation } from "./lib/actions/contract-negotiations";
import { initiateTransfer, getTransfer, getTransferState, terminateTransfer, suspendTransfer, resumeTransfer } from "./lib/actions/transfer-processes";
import { readTransferData } from "./lib/actions/read-data";

export const edc = createPiece({
  displayName: "EDC Connector",
  auth: edcAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "./assets/logo.png",
  authors: [],
  actions: [
    // Assets
    createAsset,
    getAsset,
    queryAssets,
    updateAsset,
    deleteAsset,
    // Policy Definitions
    createPolicy,
    getPolicy,
    queryPolicies,
    updatePolicy,
    deletePolicy,
    // Contract Definitions
    createContractDefinition,
    getContractDefinition,
    queryContractDefinitions,
    updateContractDefinition,
    deleteContractDefinition,
    // Contract Negotiation
    initiateNegotiation,
    getNegotiation,
    getNegotiationState,
    getNegotiationAgreement,
    terminateNegotiation,
    // Transfer Process
    initiateTransfer,
    getTransfer,
    getTransferState,
    terminateTransfer,
    suspendTransfer,
    resumeTransfer,
    // Smart Action
    readTransferData
  ],
  triggers: [],
});
