var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BaseEventEmitter from './base';
import { BASE_URL } from './constants';
const generateUniqueId = () => {
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
        this.getResultSignMessageData = () => __awaiter(this, void 0, void 0, function* () {
            if (this.uniqueId) {
                try {
                    const res = yield this.axios.get(`/result?id=${this.uniqueId}`);
                    const data = res.data.data;
                    if (data) {
                        this.emit('resultSignMessageData', data);
                    }
                }
                catch (error) { }
            }
        });
        this.postSignMessageData = (data) => __awaiter(this, void 0, void 0, function* () {
            this.uniqueId = generateUniqueId();
            try {
                this.axios.post('/data', {
                    id: this.uniqueId,
                    data,
                });
            }
            catch (error) { }
        });
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
export default SignEventEmitter;
