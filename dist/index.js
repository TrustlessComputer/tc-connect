"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMethod = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["user"] = 0] = "user";
    RequestMethod[RequestMethod["sign"] = 1] = "sign";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
class TcConnect {
    constructor() {
        this.axios = axios_1.default.create({
            baseURL: BASE_URL,
        });
        this.request = async (req) => {
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
                            }
                            catch (error) {
                                continue;
                            }
                            await this.sleep(1000); // 1s
                        }
                        break;
                }
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
    }
    init(baseURL) {
        this.axios = axios_1.default.create({
            baseURL,
        });
    }
}
exports.default = TcConnect;
//# sourceMappingURL=index.js.map