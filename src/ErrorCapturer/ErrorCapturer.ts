import {
    FingerPrint,
    TransferPayload,
    CapturedHandler,
    ErrorLevel,
    CaptureType,
    IErrorContext,
} from '../types/ErrorCapturer';

interface Captures {
    [type: string]: ErrorCapturer;
}

abstract class ErrorCapturer {
    private static capturers: Captures = {};

    protected static getContext(): IErrorContext {
        return {
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
