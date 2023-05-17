declare enum RequestMethod {
    account = 0,
    sign = 1
}
interface ITcConnectReq {
    method: RequestMethod;
    data?: JSON;
}
interface ITcConnectRes {
    data: string;
}
interface ITcConnect {
    request: (req: ITcConnectReq) => Promise<ITcConnectRes>;
}
declare class TcConnect implements ITcConnect {
    private axios;
    private currentUniqueID?;
    constructor(baseURL?: string);
    request: (req: ITcConnectReq) => Promise<any>;
    private sleep;
    private generateUniqueID;
}
export { TcConnect, ITcConnect, ITcConnectReq, ITcConnectRes, RequestMethod };
