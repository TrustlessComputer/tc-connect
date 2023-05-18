enum RequestMethod {
  account = 'account',
  sign = 'sign',
}

// Base connect resp
interface IRequestConnectResp {
  method: RequestMethod;
  isCancel: boolean;
  errMsg?: string;
}

// Request account
interface IRequestAccountResp extends IRequestConnectResp {
  tcAddress: string;
  btcAddress: number;
}

// Request sign
interface IRequestSignPayload {
  isInscribe: boolean;
  calldata: string;
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
};

// Result resp
type IResultConnectResp = RequestMethod & IRequestSignPayload;

export { IResultConnectResp };
