import axios, { AxiosInstance } from 'axios';
import {
  RequestMethod,
  IRequestAccountResp,
  IRequestSignPayload,
  IRequestSignResp,
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

  requestAccount = async (): Promise<IRequestAccountResp> => {
    try {
      const requestID = this.generateRequestId();

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({ method: RequestMethod.account }),
      });
      const accont = await this.request(requestID, RequestMethod.account);
      return accont;
    } catch (error) {
      throw error;
    }
  };

  requestSign = async (req: IRequestSignPayload): Promise<IRequestSignResp> => {
    try {
      const requestID = this.generateRequestId();

      // post request
      await this.axios.post('/data', {
        id: requestID,
        data: JSON.stringify({ method: RequestMethod.sign, ...req }),
      });
      const sign = await this.request(requestID, RequestMethod.sign);
      return sign;
    } catch (error) {
      throw error;
    }
  };

  private generateRequestId = () => {
    const requestID = generateUniqueID();
    this.currentRequestID = requestID;
    window.open(`${this.walletURL}?requestID=${requestID}`);
    return requestID;
  };

  private request = async (requestID: string, method: RequestMethod) => {
    let tcConnectRes;
    while (true) {
      // remove old request
      if (this.currentRequestID !== requestID) {
        break;
      }
      // sleep 2s
      await sleep(2000);

      // handle get result from wallet
      let res;
      try {
        res = await this.axios.get(`/result?id=${requestID}`);
      } catch (error) {
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
            if (tcRes.isCancel) {
              throw new Error('Cancel request.');
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
