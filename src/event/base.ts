import { EventEmitter } from 'events';
import axios, { AxiosInstance } from 'axios';

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

export default BaseEventEmitter;
