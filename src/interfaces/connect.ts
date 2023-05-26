enum RequestMethod {
  account = 'account',
  sign = 'sign',
  signMessage = "sign-message",
}

// Base connect resp
interface IRequestConnectResp {
  method: RequestMethod;
  isReject?: boolean;
  errMsg?: string;
}

// Request account

interface IAccount {
  tcAddress: string;
  btcAddress: string;
}

interface IRequestAccountResp extends IRequestConnectResp {
  tcAddress: string;
  btcAddress: string;
  accounts: IAccount[];
  signature?: string
}

interface IRequestSignMessageResp extends IRequestAccountResp {
  signature: string;
}

type Target = "_blank" | "_parent" | "_self" | "_top";

interface IRequestPayload {
  target: Target
  redirectURL?: string;
  signMessage?: string;
}

interface IRequestSignMessagePayload extends IRequestPayload {
  fromAddress: string;
  signMessage: string;
}

// Request sign
interface IRequestSignPayload extends IRequestPayload {
  isInscribe: boolean;
  calldata: string;
  functionName?: string; // Approve
  functionType?: string; // approve(address,uint256)
  gasPrice?: string;
  gasLimit?: string;
  from?: string;
  to?: string;
  value?: string;
}

interface IRequestSignResp extends IRequestConnectResp {
  tcHash: string;
  btcHash: string;
  nonce: number;
  to?: string;
  from?: string;
}

export {
  RequestMethod,
  IRequestConnectResp,
  IRequestAccountResp,
  IRequestSignMessageResp,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestPayload,
  IRequestSignMessagePayload,
};

// Result resp
interface IResultConnectBase {
  method: RequestMethod,
  site: string;
}

type IResultConnectResp = IResultConnectBase & IRequestSignPayload & IRequestSignMessagePayload;

export { IResultConnectResp };
