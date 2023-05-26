import { IRequestAccountResp, IRequestPayload, IRequestSignPayload, IRequestSignResp, IRequestSignMessagePayload, IRequestSignMessageResp } from '../../interfaces/connect';
interface IDappConnect {
    requestAccount: (req: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
    requestSignMessage: (req: IRequestSignMessagePayload) => Promise<IRequestSignMessageResp>;
    cancelRequest: () => void;
    getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
    getResultSign: (requestID: string) => Promise<IRequestSignResp>;
}
export { IDappConnect };
