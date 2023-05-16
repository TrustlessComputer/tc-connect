import BaseEventEmitter from './base';
import { BASE_URL } from './constants';

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

const generateUniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};

class SignEventEmitter extends BaseEventEmitter {
  private static instance?: SignEventEmitter;

  private intervalId: number | undefined;
  private uniqueId: string | undefined;

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
    if (this.uniqueId) {
      try {
        const res = await this.axios.get(`/result?id=${this.uniqueId}`);
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
    this.uniqueId = generateUniqueId();
    try {
      this.axios.post('/data', {
        id: this.uniqueId,
        data,
      });
    } catch (error) {}
  };
}

export default SignEventEmitter;
