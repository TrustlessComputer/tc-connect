/// <reference types="node" />
import { EventEmitter } from 'events';
import { AxiosInstance } from 'axios';
declare const BASE_URL = "https://wadary.regtest.trustless.computer/relayer";
declare abstract class BaseEventEmitter extends EventEmitter {
    private axiosInstance?;
    protected constructor();
    init(baseURL: string): void;
    get axios(): AxiosInstance;
    abstract listen(): void;
}
export interface ISignMessageData {
    data: string;
    id: string;
    message: string;
    site: string;
}
interface SignEventEvents {
    resultSignMessageData: (data: ISignMessageData) => void;
}
declare interface SignEventEmitter {
    on<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    off<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    emit<U extends keyof SignEventEvents>(event: U, ...args: Parameters<SignEventEvents[U]>): boolean;
}
declare class SignEventEmitter extends BaseEventEmitter {
    private static instance?;
    private intervalId;
    private uniqueID;
    static getInstance(): SignEventEmitter;
    static removeInstance(): void;
    constructor();
    listen(): void;
    private getResultSignMessageData;
    disconnect(): void;
    postSignMessageData: (data: string) => Promise<void>;
}
export { BASE_URL, BaseEventEmitter, SignEventEmitter };
