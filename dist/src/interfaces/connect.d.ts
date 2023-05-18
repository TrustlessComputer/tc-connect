declare enum RequestMethod {
    account = "account",
    sign = "sign"
}
interface IRequestConnectResp {
    method: RequestMethod;
    isCancel: boolean;
    errMsg?: string;
}
interface IRequestAccountResp extends IRequestConnectResp {
    tcAddress: string;
    btcAddress: number;
}
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
export { RequestMethod, IRequestConnectResp, IRequestAccountResp, IRequestSignPayload, IRequestSignResp, };
type IResultConnectResp = {
    method: RequestMethod;
} & IRequestSignPayload;
export { IResultConnectResp };
