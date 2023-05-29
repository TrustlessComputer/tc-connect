import axios, { AxiosInstance } from 'axios';
import {
  RequestMethod,
  IRequestAccountResp,
  IRequestSignPayload,
  IRequestSignResp,
  IRequestPayload, IRequestSignMessagePayload, IRequestSignMessageResp,
} from '../../interfaces/connect';
import { WALLET_URL, BASE_URL } from '../../constants/configs';
import { sleep, generateUniqueID } from '../../utils/commons';
import { IDappConnect } from './types';

class DappConnect implements IDappConnect {
  private axios: AxiosInstance;
  private currentRequestID?: string;
  private walletURL = WALLET_URL;

  constructor(baseURL?: string, walletURL?: string) {
    this.axios = axios.create({
      baseURL: baseURL || BASE_URL,
    });

    if (walletURL) {
      this.walletURL = walletURL;
    }
  }

  getResultAccount = async (requestID: string): Promise<IRequestAccountResp> => {
    try {
      this.currentRequestID = requestID;
      const account = await this.request(requestID, RequestMethod.account);
      return account;
    } catch (error) {
      throw error;
    }
  };

  getResultSign = async (requestID: string): Promise<IRequestSignResp> => {
    try {
      this.currentRequestID = requestID;
      const sign = await this.request(requestID, RequestMethod.sign);
      return sign;
    } catch (error) {
      throw error;
    }
  };

  requestAccount = async (payload: IRequestPayload): Promise<IRequestAccountResp> => {
    try {
      const requestID = this.generateRequestId(payload);

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({ method: RequestMethod.account, ...payload }),
      });
      await sleep(0.2);
      const account = await this.request(requestID, RequestMethod.account);
      return account;
    } catch (error) {
      throw error;
    }
  };

  requestSign = async ({ isExecuteTransaction = true, ...rest }: IRequestSignPayload): Promise<IRequestSignResp> => {
    try {
      const requestID = this.generateRequestId({ target: rest.target });

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({ method: RequestMethod.sign, ...rest, isExecuteTransaction }),
      });
      await sleep(0.2);
      const sign = await this.request(requestID, RequestMethod.sign);
      return sign;
    } catch (error) {
      throw error;
    }
  };

  requestSignMessage = async (payload: IRequestSignMessagePayload): Promise<IRequestSignMessageResp> => {
    try {
      const requestID = this.generateRequestId(payload);

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({ method: RequestMethod.signMessage, ...payload }),
      });
      await sleep(0.2);
      const resp = await this.request(requestID, RequestMethod.signMessage);
      return resp;
    } catch (error) {
      throw error;
    }
  };

  cancelRequest = () => {
    this.currentRequestID = undefined;
  };

  private generateRequestId = (payload: IRequestPayload) => {
    const requestID = generateUniqueID();
    this.currentRequestID = requestID;
    window.open(`${this.walletURL}?requestID=${requestID}`, payload.target);
    return requestID;
  };

  private request = async (requestID: string, method: RequestMethod) => {
    let tcConnectRes;
    let counter = 0;
    while (true) {
      // remove old request
      if (this.currentRequestID !== requestID) {
        break;
      }
      // sleep 3s
      await sleep(3000);

      // handle get result from wallet
      let res;
      try {
        res = await this.axios.get(`/result?id=${requestID}`);
      } catch (error) {
        counter++;
        if (counter === 40) {
          throw new Error(`Timeout.`);
        }
        continue;
      }
      if (res && res.data && res.data.data) {
        const data = res.data.data;
        const resultRequestId = data.id;
        const resultData = data.data; // JSON string
        // check equal request id and has data
        if (resultRequestId && resultRequestId === requestID && resultData) {
          const tcRes = JSON.parse(resultData);
          if (tcRes && tcRes.method === method) {
            if (tcRes.isReject) {
              throw new Error('Request rejected.');
            }
            if (tcRes.errMsg) {
              throw new Error(tcRes.errMsg);
            }
            tcConnectRes = tcRes;
            break;
          }
        }
      }
    }
    return tcConnectRes;
  };
}

export { DappConnect };
