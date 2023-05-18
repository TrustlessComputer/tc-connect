"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../constants/configs");
const commons_1 = require("../../utils/commons");
class WalletConnect {
    constructor(baseURL) {
        this.getRequest = async (requestID) => {
            this.currentRequestID = requestID;
            return await this.listen(requestID);
        };
        this.postResultAccount = async (result) => {
            return await this.postResult(result);
        };
        this.postResultSign = async (result) => {
            return await this.postResult(result);
        };
        this.listen = async (requestID) => {
            let tcConnectRes;
            while (true) {
                // remove old listen
                if (this.currentRequestID !== requestID) {
                    break;
                }
                // sleep 2s
                await (0, commons_1.sleep)(2000);
                // handle get data from dapp
                let res;
                try {
                    res = await this.axios.get(`/data?id=${requestID}`);
                }
                catch (error) {
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
        this.postResult = async (result) => {
            try {
                if (this.currentRequestID) {
                    // post request
                    return await this.axios.post('/result', {
                        id: this.currentRequestID,
                        data: JSON.stringify(result),
                    });
                }
                else {
                    throw new Error('Invalid request id');
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.axios = axios_1.default.create({
            baseURL: baseURL || configs_1.BASE_URL,
        });
    }
}
exports.WalletConnect = WalletConnect;
//# sourceMappingURL=walletConnect.js.map