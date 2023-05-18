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
type Target = "_blank" | "_parent" | "_self" | "_top";
interface IRequestPayload {
    target: Target;
}
interface IRequestSignPayload extends IRequestPayload {
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
export { RequestMethod, IRequestConnectResp, IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, };
type IResultConnectResp = {
    method: RequestMethod;
} & IRequestSignPayload;
export { IResultConnectResp };
