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
    constructor(baseURL, requestID) {
        this.getRequest = async (requestID) => {
            this.currentRequestID = requestID;
            return await this.listen(requestID);
        };
        this.cancelGetRequest = () => {
            this.currentRequestID = undefined;
        };
        this.postResultAccount = async (result) => {
            return await this.postResult(result);
        };
        this.postResultSign = async (result) => {
            return await this.postResult(result);
        };
        this.listen = async (requestID) => {
            let tcConnectRes;
            let counter = 0;
            while (true) {
                // remove old listen
                if (this.currentRequestID !== requestID) {
                    break;
                }
                // handle get data from dapp
                let res;
                try {
                    res = await this.axios.get(`/data?id=${requestID}`);
                    // sleep 2s
                    if (!res) {
                        await (0, commons_1.sleep)(3000);
                    }
                }
                catch (error) {
                    counter++;
                    if (counter === 4) {
                        throw new Error(`Can get request ${requestID}.`);
                    }
                    // sleep 2s
                    await (0, commons_1.sleep)(3000);
                    continue;
                }
                if (res && res.data && res.data.data) {
                    const data = res.data.data;
                    const resultRequestId = data.id;
                    const resultData = data.data; // JSON string
                    const site = data.site;
                    // check request id and data
                    if (resultRequestId && resultRequestId === requestID && resultData) {
                        const tcRes = JSON.parse(resultData);
                        if (tcRes && tcRes.method) {
                            tcConnectRes = {
                                ...tcRes,
                                site
                            };
                            break;
                        }
                    }
                }
            }
            return tcConnectRes;
        };
        this.postResult = async (result) => {
            console.log('SANG TEST: ', this.currentRequestID);
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
        this.currentRequestID = requestID;
    }
}
exports.WalletConnect = WalletConnect;
//# sourceMappingURL=walletConnect.js.map