"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DappConnect = void 0;
const axios_1 = __importDefault(require("axios"));
const connect_1 = require("../../interfaces/connect");
const configs_1 = require("../../constants/configs");
const commons_1 = require("../../utils/commons");
const SLEEP_TIME = 3000;
const COUNTER = 100;
const TIME_OUT = SLEEP_TIME * COUNTER;
class DappConnect {
    constructor(baseURL, walletURL) {
        this.walletURL = configs_1.WALLET_URL;
        this.getResultAccount = async (requestID) => {
            try {
                this.currentRequestID = requestID;
                const account = await this.request(requestID, connect_1.RequestMethod.account);
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.getResultSign = async (requestID) => {
            try {
                this.currentRequestID = requestID;
                const sign = await this.request(requestID, connect_1.RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestAccount = async (payload) => {
            try {
                const requestID = this.generateRequestId(payload);
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: connect_1.RequestMethod.account, ...payload }),
                });
                await (0, commons_1.sleep)(0.2);
                const account = await this.request(requestID, connect_1.RequestMethod.account);
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestSign = async ({ isExecuteTransaction = true, ...rest }) => {
            try {
                const requestID = this.generateRequestId({ target: rest.target });
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: connect_1.RequestMethod.sign, ...rest, isExecuteTransaction }),
                });
                await (0, commons_1.sleep)(0.2);
                const sign = await this.request(requestID, connect_1.RequestMethod.sign);
                return sign;
            }
            catch (error) {
                throw error;
            }
        };
        this.requestSignMessage = async (payload) => {
            try {
                const requestID = this.generateRequestId(payload);
                // post request
                await this.axios.post('/data', {
                    id: requestID,
                    data: JSON.stringify({ method: connect_1.RequestMethod.signMessage, ...payload }),
                });
                await (0, commons_1.sleep)(0.2);
                const resp = await this.request(requestID, connect_1.RequestMethod.signMessage);
                return resp;
            }
            catch (error) {
                throw error;
            }
        };
        this.cancelRequest = () => {
            this.currentRequestID = undefined;
        };
        this.generateRequestId = (payload) => {
            const requestID = (0, commons_1.generateUniqueID)();
            this.currentRequestID = requestID;
            const expired = new Date().getTime() + TIME_OUT;
            window.open(`${this.walletURL}?requestID=${requestID}&expired=${expired}`, payload.target);
            return requestID;
        };
        this.request = async (requestID, method) => {
            let tcConnectRes;
            let counter = 0;
            while (true) {
                // remove old request
                if (this.currentRequestID !== requestID) {
                    break;
                }
                // sleep 3s
                await (0, commons_1.sleep)(SLEEP_TIME);
                // handle get result from wallet
                let res;
                try {
                    res = await this.axios.get(`/result?id=${requestID}`);
                }
                catch (error) {
                    counter++;
                    // 5 mins, sleep 3s
                    if (counter === COUNTER) {
                        throw new Error(`Timeout.`);
                    }
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
                            if (tcRes.isReject) {
                                throw new Error('Request rejected.');
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
exports.DappConnect = DappConnect;
//# sourceMappingURL=dappConnect.js.map