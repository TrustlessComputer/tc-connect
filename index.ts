import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';

enum RequestMethod {
  account = 'account',
  sign = 'sign',
}

interface ITcConnectResp {
  method: RequestMethod;
  isCancel: boolean;
  errMsg?: string;
}

interface IRequestAccountResp extends ITcConnectResp {
  tcAddress: string;
  btcAddress: number;
}

interface IRequestSignPayload {
  isInscribe: boolean;
  calldata: string;
  from?: string;
  to?: string;
  value?: string;
}
interface IRequestSignResp extends ITcConnectResp {
  hash: string;
  nonce: number;
  to?: string;
  from?: string;
}

interface ITcConnect {
  requestAccount: () => Promise<IRequestAccountResp>;
  requestSign: (req: IRequestSignPayload) => Promise<IRequestSignResp>;
}

class TcConnect implements ITcConnect {
  private axios: AxiosInstance;
  private currentRequestID?: string;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL: baseURL || BASE_URL,
    });
  }

  requestAccount = async () => {
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
      console.log('===error===', error);
      throw error;
    }
  };

  requestSign = async (req: IRequestSignPayload) => {
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
    const requestID = this.generateUniqueID();
    this.currentRequestID = requestID;
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
      await this.sleep(2000);

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
              console.log('===throw===', tcRes);
              throw new Error('Cancel request.');
            }
            if (tcRes.errMsg) {
              console.log('===throw===', tcRes);
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

  private sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  private generateUniqueID = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };
}

export {
  TcConnect,
  ITcConnect,
  ITcConnectResp,
  IRequestAccountResp,
  IRequestSignPayload,
  IRequestSignResp,
};
