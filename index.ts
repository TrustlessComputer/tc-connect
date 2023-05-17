import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';

enum RequestMethod {
  user,
  sign,
}
interface ITcConnectReq {
  method: RequestMethod;
  data: string;
}
interface ITcConnectRes {
  data: string;
  id: string;
  message: string;
  site: string;
}
interface ITcConnect {
  request: (req: ITcConnectReq) => Promise<ITcConnectRes>;
}

class TcConnect implements ITcConnect {
  private axios: AxiosInstance;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL: baseURL || BASE_URL,
    });
  }

  request = async (req: ITcConnectReq) => {
    const uniqueID = this.generateUniqueID();
    try {
      await this.axios.post('/data', {
        id: uniqueID,
        data: req.data,
      });
      switch (req.method) {
        default:
          let tcRes;
          while (!tcRes) {
            try {
              const res = await this.axios.get(`/result?id=${uniqueID}`);
              const data = res.data.data;
              if (data && data.id) {
                tcRes = data;
                return tcRes;
              }
            } catch (error) {
              continue;
            }
            await this.sleep(1000); // 1s
          }
          break;
      }
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
