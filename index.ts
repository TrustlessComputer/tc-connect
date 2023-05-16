import { EventEmitter } from 'events';
import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://wadary.regtest.trustless.computer/relayer';

abstract class BaseEventEmitter extends EventEmitter {
    private axiosInstance?: AxiosInstance;

    protected constructor() {
        super();
    }

    init(baseURL: string): void {
        if (baseURL) {
            this.axiosInstance = axios.create({
                baseURL,
            });
        }
        this.listen();
    }

    get axios(): AxiosInstance {
        return this.axiosInstance || axios.create();
    }

    abstract listen(): void;
}


interface SignEventEvents {
    resultSignMessageData: (data: any) => void;
}

declare interface SignEventEmitter {
    on<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    off<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    emit<U extends keyof SignEventEvents>(
        event: U,
        ...args: Parameters<SignEventEvents[U]>
    ): boolean;
}

const generateUniqueID = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
};

class SignEventEmitter extends BaseEventEmitter {
    private static instance?: SignEventEmitter;

    private intervalId: NodeJS.Timeout | undefined;
    private uniqueID: string | undefined;

    public static getInstance(): SignEventEmitter {
        if (this.instance) {
            return this.instance;
        }

        const emitter = new SignEventEmitter();
        emitter.init(BASE_URL);

        this.instance = emitter;
        return emitter;
    }

    public static removeInstance(): void {
        this.instance = undefined;
    }

    constructor() {
        super();
    }

    listen() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(this.getResultSignMessageData, 5000);
    }

    getResultSignMessageData = async () => {
        if (this.uniqueID) {
            try {
                const res = await this.axios.get(`/result?id=${this.uniqueID}`);
                const data = res.data.data;
                if (data) {
                    this.emit('resultSignMessageData', data);
                }
            } catch (error) {}
        }
    };

    public disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        super.removeAllListeners();
        SignEventEmitter.removeInstance();
    }

    public postSignMessageData = async (data: string) => {
        this.uniqueID = generateUniqueID();
        try {
            this.axios.post('/data', {
                id: this.uniqueID,
                data,
            });
        } catch (error) {}
    };
}

export { BASE_URL, BaseEventEmitter, SignEventEmitter }