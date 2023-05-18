import { IRequestAccountResp, IRequestSignPayload, IRequestSignResp } from '../../interfaces/connect';
interface IDappConnect {
    requestAccount: () => Promise<IRequestAccountResp>;
    requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
}
export { IDappConnect };
