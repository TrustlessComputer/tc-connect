enum RequestMethod {
  account = 'account',
  sign = 'sign',
}

// Base connect resp
interface IConnectResp {
  method: RequestMethod;
  isCancel: boolean;
  errMsg?: string;
}

// Request account
interface IRequestAccountResp extends IConnectResp {
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

interface IRequestSignResp extends IConnectResp {
  hash: string;
  nonce: number;
  to?: string;
  from?: string;
}

export { RequestMethod, IRequestAccountResp, IRequestSignPayload, IRequestSignResp };
