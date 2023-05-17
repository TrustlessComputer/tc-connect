declare enum RequestMethod {
    user = 0,
    sign = 1
}
interface ITcConnectReq {
    method: RequestMethod;
    data: string;
}
interface ITcConnectRes {
    data: string;
    id: string;
    message: string;
    site: string;
}
interface ITcConnect {
    request: (req: ITcConnectReq) => Promise<ITcConnectRes>;
}
declare class TcConnect implements ITcConnect {
    private axios;
    private cancelOldRequest;
    constructor(baseURL?: string);
    request: (req: ITcConnectReq) => Promise<any>;
    private sleep;
    private generateUniqueID;
}
export { TcConnect, ITcConnect, ITcConnectReq, ITcConnectRes, RequestMethod };
