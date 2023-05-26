import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload, IRequestSignMessagePayload } from '../../interfaces/connect';
import { IDappConnect } from './types';
declare class DappConnect implements IDappConnect {
    private axios;
    private currentRequestID?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
    getResultSign: (requestID: string) => Promise<IRequestSignResp>;
    requestAccount: (payload: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: ({ target, ...rest }: IRequestSignPayload) => Promise<IRequestSignResp>;
    requestSignMessage: (payload: IRequestSignMessagePayload) => Promise<IRequestAccountResp>;
    cancelRequest: () => void;
    private generateRequestId;
    private request;
}
export { DappConnect };
