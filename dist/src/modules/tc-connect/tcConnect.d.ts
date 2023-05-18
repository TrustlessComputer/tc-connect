import { ITcConnect, IRequestSignPayload } from './types';
declare class TcConnect implements ITcConnect {
    private axios;
    private currentRequestID?;
    private walletURL;
    constructor(baseURL?: string, walletURL?: string);
    requestAccount: () => Promise<any>;
    requestSign: (req: IRequestSignPayload) => Promise<any>;
    private generateRequestId;
    private request;
}
export { TcConnect };
