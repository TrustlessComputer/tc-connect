import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp } from '../../interfaces/connect';
import { IDappConnect } from './types';
declare class DappConnect implements IDappConnect {
    private axios;
    private currentRequestID?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    requestAccount: () => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
    private generateRequestId;
    private request;
}
export { DappConnect };
