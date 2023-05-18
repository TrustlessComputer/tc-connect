import { IRequestAccountResp, IRequestPayload, IRequestSignPayload, IRequestSignResp } from '../../interfaces/connect';
interface IDappConnect {
    requestAccount: (req: IRequestPayload) => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
}
export { IDappConnect };
