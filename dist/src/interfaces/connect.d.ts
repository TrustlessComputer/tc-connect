declare enum RequestMethod {
    account = "account",
    sign = "sign"
}
interface IRequestConnectResp {
    method: RequestMethod;
    isCancel?: boolean;
    errMsg?: string;
}
interface IAccount {
    tcAddress: string;
    btcAddress: string;
}
interface IRequestAccountResp extends IRequestConnectResp {
    tcAddress: string;
    btcAddress: string;
    accounts: IAccount[];
}
type Target = "_blank" | "_parent" | "_self" | "_top";
interface IRequestPayload {
    target: Target;
    redirectURL?: string;
    signMessage?: string;
}
interface IRequestSignPayload extends IRequestPayload {
    isInscribe: boolean;
    calldata: string;
    functionName?: string;
    functionType?: string;
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
export { RequestMethod, IRequestConnectResp, IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, };
type IResultConnectResp = {
    method: RequestMethod;
    site: string;
} & IRequestSignPayload;
export { IResultConnectResp };
