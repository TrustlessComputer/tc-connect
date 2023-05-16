import BaseEventEmitter from './base';
interface SignEventEvents {
    resultSignMessageData: (data: any) => void;
}
declare interface SignEventEmitter {
    on<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    off<U extends keyof SignEventEvents>(event: U, listener: SignEventEvents[U]): this;
    emit<U extends keyof SignEventEvents>(event: U, ...args: Parameters<SignEventEvents[U]>): boolean;
}
declare class SignEventEmitter extends BaseEventEmitter {
    private static instance?;
    private intervalId;
    private uniqueId;
    static getInstance(): SignEventEmitter;
    static removeInstance(): void;
    constructor();
    listen(): void;
    getResultSignMessageData: () => Promise<void>;
    disconnect(): void;
    postSignMessageData: (data: string) => Promise<void>;
}
export default SignEventEmitter;
