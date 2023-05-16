import { EventEmitter } from 'events';
import axios from 'axios';
class BaseEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
    init(baseURL) {
        if (baseURL) {
            this.axiosInstance = axios.create({
                baseURL,
            });
        }
        this.listen();
    }
    get axios() {
        return this.axiosInstance || axios.create();
    }
}
export default BaseEventEmitter;
