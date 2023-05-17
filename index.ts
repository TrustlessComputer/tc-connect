import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';

enum RequestMethod {
  account,
  sign,
}
interface ITcConnectReq {
  method: RequestMethod;
  data?: JSON;
}
interface ITcConnectRes {
  data: string;
}
interface ITcConnect {
  request: (req: ITcConnectReq) => Promise<ITcConnectRes>;
}

class TcConnect implements ITcConnect {
  private axios: AxiosInstance;
  private currentUniqueID?: string;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL: baseURL || BASE_URL,
    });
  }

  request = async (req: ITcConnectReq) => {
    const uniqueID = this.generateUniqueID();
    this.currentUniqueID = uniqueID;
    try {
      await this.axios.post('/data', {
        id: uniqueID,
        data: JSON.stringify({ method: req.method, ...req.data }),
      });

      let tcRes;
      while (true) {
        // remove old request
        if (this.currentUniqueID !== uniqueID) {
          break;
        }
        // sleep 2s
        await this.sleep(2000);
        // call get result from wallet
        try {
          const res = await this.axios.get(`/result?id=${uniqueID}`);
          const data = res.data.data;
          if (data && data.id && data.id === uniqueID) {
            const jsonStr = data.data; // JSON string
            const jsonData = JSON.parse(jsonStr);
            if (jsonData && jsonData.method === req.method) {
              tcRes = jsonStr;
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }
      return tcRes;
    } catch (error) {
      throw error;
    }
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

export { TcConnect, ITcConnect, ITcConnectReq, ITcConnectRes, RequestMethod };
