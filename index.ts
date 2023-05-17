import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';

enum RequestMethod {
  account,
  sign,
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
      return await this.request(requestID, RequestMethod.account);
    } catch (error) {
      throw new Error('Can not request.');
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
      return await this.request(requestID, RequestMethod.sign);
    } catch (error) {
      throw new Error('Can not request.');
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
      // call get result from wallet
      try {
        const res = await this.axios.get(`/result?id=${requestID}`);
        const data = res.data.data;
        const resultRequestId = data.id;
        const resultData = data.data;
        // check equal request id and has data
        if (resultRequestId && resultRequestId === requestID && resultData) {
          const tcRes = resultData;
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
      } catch (error) {
        continue;
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
