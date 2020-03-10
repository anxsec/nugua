export type FingerPrint = string;

export type TransferPayload = Error;

export type CapturedHandler = (err: ICapturedError) => void;

export enum ErrorLevel {
    Info,
    Warning,
    Error,
    Fatal,
}

export enum ErrorType {
    FetchError,
    RuntimeError,
}

export enum CaptureType {
    Fetch,
    Runtime,
}

export interface IErrorContext {
    user: string;
    timestamp: number;
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

export interface ICapturedError {
    context: IErrorContext;
    type: ErrorType;
    fingerPrint: FingerPrint;
    level: ErrorLevel;
    detail: IRuntimeErrorDetail | IFetchErrorDetail;
}
