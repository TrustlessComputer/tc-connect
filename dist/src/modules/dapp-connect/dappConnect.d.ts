import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, IRequestSignMessagePayload, IRequestSignMessageResp } from '../../interfaces/connect';
import { IDappConnect } from './types';
declare class DappConnect implements IDappConnect {
    private axios;
    private currentRequestID?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
    getResultSign: (requestID: string) => Promise<IRequestSignResp>;
    requestAccount: (payload: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: (payload: IRequestSignPayload) => Promise<IRequestSignResp>;
    requestSignMessage: (payload: IRequestSignMessagePayload) => Promise<IRequestSignMessageResp>;
    cancelRequest: () => void;
    private generateRequestId;
    private request;
}
export { DappConnect };
