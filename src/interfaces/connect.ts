enum RequestMethod {
  account = 'account',
  sign = 'sign',
}

// Base connect resp
interface IRequestConnectResp {
  method: RequestMethod;
  isCancel?: boolean;
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

type Target = "_blank" | "_parent" | "_self" | "_top";

interface IRequestPayload {
  target: Target
  redirectURL?: string;
  signMessage?: string;
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
  hash: string;
  nonce: number;
  to?: string;
  from?: string;
}

export {
  RequestMethod,
  IRequestConnectResp,
  IRequestAccountResp,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestPayload,
};

// Result resp
type IResultConnectResp = { method: RequestMethod, site: string } & IRequestSignPayload;

export { IResultConnectResp };
