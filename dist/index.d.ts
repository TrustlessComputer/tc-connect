import { AxiosInstance } from 'axios';
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
declare abstract class BaseConnect {
    private axiosInstance;
    constructor(baseURL: string);
    get axios(): AxiosInstance;
}
declare class TcConnect extends BaseConnect {
    private static instance?;
    static getInstance(baseURL?: string): TcConnect;
    request: (req: ITcConnectReq) => Promise<any>;
    private sleep;
    private generateUniqueID;
}
export { TcConnect, RequestMethod, ITcConnectReq, ITcConnectRes };
