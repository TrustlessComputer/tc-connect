"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMethod = exports.TcConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["account"] = 0] = "account";
    RequestMethod[RequestMethod["sign"] = 1] = "sign";
})(RequestMethod || (RequestMethod = {}));
exports.RequestMethod = RequestMethod;
class TcConnect {
    constructor(baseURL) {
        this.request = async (req) => {
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
                    }
                    catch (error) {
                        continue;
                    }
                }
                return tcRes;
            }
            catch (error) {
                throw error;
            }
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