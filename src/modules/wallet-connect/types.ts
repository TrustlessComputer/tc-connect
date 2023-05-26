import {
  IRequestAccountResp,
  IRequestSignMessageResp,
  IRequestSignResp,
  IResultConnectResp,
} from '../../interfaces/connect';

interface IWalletConnect {
  getRequest: (requestID: string) => Promise<IResultConnectResp>;
  cancelGetRequest: () => void;
  postResultAccount: (result: IRequestAccountResp) => void;
  postResultSign: (result: IRequestSignResp) => void;
  postResultSignMessage: (result: IRequestSignMessageResp) => void;
}

export { IWalletConnect };
