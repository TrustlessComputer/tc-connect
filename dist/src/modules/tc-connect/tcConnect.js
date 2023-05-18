"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../constants/configs");
const commons_1 = require("../../utils/commons");
const types_1 = require("./types");
class TcConnect {
    constructor(baseURL, walletURL) {
        this.walletURL = configs_1.WALLET_URL;
        this.requestAccount = async () => {
            try {
                const requestID = this.generateRequestId();
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: types_1.RequestMethod.account }),
                });
                const accont = await this.request(requestID, types_1.RequestMethod.account);
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
                    data: JSON.stringify({ method: types_1.RequestMethod.sign, ...req }),
                });
                const sign = await this.request(requestID, types_1.RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.generateRequestId = () => {
            const requestID = (0, commons_1.generateUniqueID)();
            this.currentRequestID = requestID;
            window.open(`${this.walletURL}?requestID=${requestID}`);
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
                await (0, commons_1.sleep)(2000);
                // handle get result from wallet
                let res;
                try {
                    res = await this.axios.get(`/result?id=${requestID}`);
                }
                catch (error) {
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
        this.axios = axios_1.default.create({
            baseURL: baseURL || configs_1.BASE_URL,
        });
        if (walletURL) {
            this.walletURL = walletURL;
        }
    }
}
exports.TcConnect = TcConnect;
//# sourceMappingURL=tcConnect.js.map