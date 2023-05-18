declare enum RequestMethod {
    account = "account",
    sign = "sign"
}
interface IConnectResp {
    method: RequestMethod;
    isCancel: boolean;
    errMsg?: string;
}
interface IRequestAccountResp extends IConnectResp {
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
interface IRequestSignResp extends IConnectResp {
    hash: string;
    nonce: number;
    to?: string;
    from?: string;
}
export { RequestMethod, IRequestAccountResp, IRequestSignPayload, IRequestSignResp };
