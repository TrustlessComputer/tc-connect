import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../../constants/configs';
import {
  IRequestAccountResp,
  IRequestSignResp,
  IResultConnectResp,
} from '../../interfaces/connect';
import { sleep } from '../../utils/commons';
import { IWalletConnect } from './types';

class WalletConnect implements IWalletConnect {
  private axios: AxiosInstance;
  private currentRequestID?: string;

  constructor(baseURL?: string, requestID?: string) {

    this.axios = axios.create({
      baseURL: baseURL || BASE_URL,
    });

    this.currentRequestID = requestID;
  }

  getRequest = async (requestID: string): Promise<IResultConnectResp> => {
    this.currentRequestID = requestID;
    return await this.listen(requestID);
  };

  cancelGetRequest = () => {
    this.currentRequestID = undefined;
  };

  postResultAccount = async (result: IRequestAccountResp) => {
    return await this.postResult(result);
  };

  postResultSign = async (result: IRequestSignResp) => {
    return await this.postResult(result);
  };

  private listen = async (requestID: string) => {
    let tcConnectRes;
    while (true) {
      // remove old listen
      if (this.currentRequestID !== requestID) {
        break;
      }
      // sleep 2s
      await sleep(2000);

      // handle get data from dapp
      let res;
      try {
        res = await this.axios.get(`/data?id=${requestID}`);
      } catch (error) {
        continue;
      }
      if (res && res.data && res.data.data) {
        const data = res.data.data;
        const resultRequestId = data.id;
        const resultData = data.data; // JSON string
        // check request id and data
        if (resultRequestId && resultRequestId === requestID && resultData) {
          const tcRes = JSON.parse(resultData);
          if (tcRes && tcRes.method) {
            tcConnectRes = tcRes;
            break;
          }
        }
      }
    }
    return tcConnectRes;
  };

  private postResult = async (result: any) => {
    try {
      if (this.currentRequestID) {
        // post request
        return await this.axios.post('/result', {
          id: this.currentRequestID,
          data: JSON.stringify(result),
        });
      } else {
        throw new Error('Invalid request id');
      }
    } catch (error) {
      throw error;
    }
  };
}

export { WalletConnect };
