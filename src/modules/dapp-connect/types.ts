import {
  IRequestAccountResp,
  IRequestPayload,
  IRequestSignPayload,
  IRequestSignResp,
} from '../../interfaces/connect';

interface IDappConnect {
  requestAccount: (req: IRequestPayload) => Promise<IRequestAccountResp>;
  requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
  cancelRequest: () => void;

  getResultAccount: (requestID: string) => Promise<IRequestAccountResp>;
  getResultSign: (requestID: string) => Promise<IRequestSignResp>;
}

export { IDappConnect };
