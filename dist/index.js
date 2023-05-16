"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignEventEmitter = exports.BaseEventEmitter = exports.BASE_URL = void 0;
const events_1 = require("events");
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';
exports.BASE_URL = BASE_URL;
class BaseEventEmitter extends events_1.EventEmitter {
    constructor() {
        super();
    }
    init(baseURL) {
        if (baseURL) {
            this.axiosInstance = axios_1.default.create({
                baseURL,
            });
        }
        this.listen();
    }
    get axios() {
        return this.axiosInstance || axios_1.default.create();
    }
}
exports.BaseEventEmitter = BaseEventEmitter;
const generateUniqueID = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
};
class SignEventEmitter extends BaseEventEmitter {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        const emitter = new SignEventEmitter();
        emitter.init(BASE_URL);
        this.instance = emitter;
        return emitter;
    }
    static removeInstance() {
        this.instance = undefined;
    }
    constructor() {
        super();
        this.getResultSignMessageData = async () => {
            if (this.uniqueID) {
                try {
                    const res = await this.axios.get(`/result?id=${this.uniqueID}`);
                    const data = res.data.data;
                    if (data) {
                        this.emit('resultSignMessageData', data);
                    }
                }
                catch (error) { }
            }
        };
        this.postSignMessageData = async (data) => {
            this.uniqueID = generateUniqueID();
            try {
                this.axios.post('/data', {
                    id: this.uniqueID,
                    data,
                });
            }
            catch (error) { }
        };
    }
    listen() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(this.getResultSignMessageData, 5000);
    }
    disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        super.removeAllListeners();
        SignEventEmitter.removeInstance();
    }
}
exports.SignEventEmitter = SignEventEmitter;
//# sourceMappingURL=index.js.map