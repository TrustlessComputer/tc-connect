"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["account"] = "account";
    RequestMethod["sign"] = "sign";
})(RequestMethod || (RequestMethod = {}));
class TcConnect {
    constructor(baseURL) {
        this.requestAccount = async () => {
            try {
                const requestID = this.generateRequestId();
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: RequestMethod.account }),
                });
                const accont = await this.request(requestID, RequestMethod.account);
                return accont;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestSign = async (req) => {
            try {
                const requestID = this.generateRequestId();
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: RequestMethod.sign, ...req }),
                });
                const sign = await this.request(requestID, RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.generateRequestId = () => {
            const requestID = this.generateUniqueID();
            this.currentRequestID = requestID;
            return requestID;
        };
        this.request = async (requestID, method) => {
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
                    const resultData = data.data; // JSON string
                    // check equal request id and has data
                    if (resultRequestId && resultRequestId === requestID && resultData) {
                        const tcRes = JSON.parse(resultData);
                        console.log('===tcRes===', tcRes);
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
                catch (error) {
                    continue;
                }
            }
            return tcConnectRes;
        };
        this.sleep = (ms) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };
        this.generateUniqueID = () => {
            const dateString = Date.now().toString(36);
            const randomness = Math.random().toString(36).substr(2);
            return dateString + randomness;
        };
        this.axios = axios_1.default.create({
            baseURL: baseURL || BASE_URL,
        });
    }
}
exports.TcConnect = TcConnect;
//# sourceMappingURL=index.js.map