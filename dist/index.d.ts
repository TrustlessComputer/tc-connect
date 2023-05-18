declare enum RequestMethod {
    account = "account",
    sign = "sign"
}
interface ITcConnectResp {
    method: RequestMethod;
    isCancel: boolean;
    errMsg?: string;
}
interface IRequestAccountResp extends ITcConnectResp {
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
interface IRequestSignResp extends ITcConnectResp {
    hash: string;
    nonce: number;
    to?: string;
    from?: string;
}
interface ITcConnect {
    requestAccount: () => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
}
declare class TcConnect implements ITcConnect {
    private axios;
    private currentRequestID?;
    constructor(baseURL?: string);
    requestAccount: () => Promise<any>;
    requestSign: (req: IRequestSignPayload) => Promise<any>;
    private generateRequestId;
    private request;
    private sleep;
    private generateUniqueID;
}
export { TcConnect, ITcConnect, ITcConnectResp, IRequestAccountResp, IRequestSignPayload, IRequestSignResp, };
