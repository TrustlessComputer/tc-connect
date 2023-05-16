import { EventEmitter } from 'events';
import { AxiosInstance } from 'axios';
declare abstract class BaseEventEmitter extends EventEmitter {
    private axiosInstance?;
    protected constructor();
    init(baseURL: string): void;
    get axios(): AxiosInstance;
    abstract listen(): void;
}
export default BaseEventEmitter;
