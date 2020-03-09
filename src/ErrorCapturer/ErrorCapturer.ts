export enum ErrorLevel {
    Info,
    Warning,
    Error,
    Fatal,
}

export interface IErrorContext {
    user: string;
    timestamp: number;
}

export enum ErrorType {
    FetchError,
    RuntimeError,
}

export interface IRuntimeErrorDetail {
    filename: string;
    message: string;
    lineNo: number;
    colNo: number;
}

export interface IFetchErrorDetail {
    url: string;
    method: string;
    status: number;
    statusText: string;
}

export type FingerPrint = string;

export interface ICapturedError {
    context: IErrorContext;
    type: ErrorType;
    fingerPrint: FingerPrint;
    level: ErrorLevel;
    detail: IRuntimeErrorDetail | IFetchErrorDetail;
}

export type CapturedHandler = (err: ICapturedError) => void;

export enum CaptureType {
    Fetch,
    Runtime,
}

export type TransferPayload = Error;

interface Captures {
    [type: string]: ErrorCapturer;
}

abstract class ErrorCapturer {
    private static capturers: Captures = {};

    protected static getContext(): IErrorContext {
        return {
            // TODO: impl uuid
            user: 'Anx',
            timestamp: Date.now(),
        };
    }

    protected static transfer(
        type: CaptureType,
        payload: TransferPayload,
    ): boolean {
        const targetCapturer = ErrorCapturer.capturers[type];
        if (targetCapturer) {
            targetCapturer.receiveCaptured(payload);
        }
        return false;
    }

    public readonly type: CaptureType;

    abstract readonly capturedHandler: CapturedHandler;

    public constructor(type: CaptureType) {
        this.type = type;
        ErrorCapturer.capturers[type] = this;
    }

    public abstract receiveCaptured(payload: TransferPayload): boolean;
    protected abstract generateFingerPrint(...arg: any[]): FingerPrint;
    protected abstract generateErrorLevel(...arg: any[]): ErrorLevel;
}

export default ErrorCapturer;
