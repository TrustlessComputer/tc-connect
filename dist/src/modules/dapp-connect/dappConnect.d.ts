import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp, IRequestPayload } from '../../interfaces/connect';
import { IDappConnect } from './types';
declare class DappConnect implements IDappConnect {
    private axios;
    private currentRequestID?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    requestAccount: (payload: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: ({ target, ...rest }: IRequestSignPayload) => Promise<IRequestSignResp>;
    private generateRequestId;
    private request;
}
export { DappConnect };
