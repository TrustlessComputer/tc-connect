import { IRequestAccountResp, IRequestSignResp, IResultConnectResp } from '../../interfaces/connect';
import { IWalletConnect } from './types';
declare class WalletConnect implements IWalletConnect {
    private axios;
    private currentRequestID?;
    constructor(baseURL?: string);
    getRequest: (requestID: string) => Promise<IResultConnectResp>;
    postResultAccount: (result: IRequestAccountResp) => Promise<import("axios").AxiosResponse<any, any>>;
    postResultSign: (result: IRequestSignResp) => Promise<import("axios").AxiosResponse<any, any>>;
    private listen;
    private postResult;
}
export { WalletConnect };
