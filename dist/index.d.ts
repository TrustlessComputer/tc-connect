export declare enum RequestMethod {
    user = 0,
    sign = 1
}
export interface ITcConnectReq {
    method: RequestMethod;
    data: string;
}
export interface ITcConnectRes {
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
    constructor(baseURL?: string);
    request: (req: ITcConnectReq) => Promise<any>;
    private sleep;
    private generateUniqueID;
}
export { TcConnect };
