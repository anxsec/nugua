import {
    ErrorType,
    CaptureType,
    CapturedHandler,
    TransferPayload,
    FingerPrint,
    ErrorLevel,
} from '../types/ErrorCapturer';
import ErrorCapturer from './ErrorCapturer';

class RuntimeErrorCapturer extends ErrorCapturer {
    public readonly capturedHandler: CapturedHandler;

    public constructor(handler: CapturedHandler) {
        super(CaptureType.Runtime);
        this.capturedHandler = handler;
        window.addEventListener(
            'error',
            (err: ErrorEvent) => this.handleErrorEvent(err),
            true,
        );
    }

    public receiveCaptured(payload: TransferPayload) {
        const { message } = payload;
        this.handleError('', message, 0, 0);
        return true;
    }

    protected generateFingerPrint(
        filename: string,
        lineNo: number,
        colNo: number,
        message: string,
    ): FingerPrint {
        return `${filename}@${lineNo}@${colNo}@${message}`;
    }

    protected generateErrorLevel(): ErrorLevel {
        return ErrorLevel.Error;
    }

    private handleErrorEvent(errEvent: ErrorEvent) {
        const { filename, message, lineno: lineNo, colno: colNo } = errEvent;
        this.handleError(filename, message, lineNo, colNo);
    }

    private handleError(
        filename: string,
        message: string,
        lineNo: number,
        colNo: number,
    ) {
        this.capturedHandler({
            context: ErrorCapturer.getContext(),
            type: ErrorType.RuntimeError,
            fingerPrint: this.generateFingerPrint(
                filename,
                lineNo,
                colNo,
                message,
            ),
            level: this.generateErrorLevel(),
            detail: {
                filename,
                message,
                lineNo,
                colNo,
            },
        });
    }
}

export default RuntimeErrorCapturer;
