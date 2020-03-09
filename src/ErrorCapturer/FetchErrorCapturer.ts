import ErrorCapturer, {
    CaptureType,
    ErrorType,
    FingerPrint,
    ErrorLevel,
    ICapturedError,
    CapturedHandler,
} from './ErrorCapturer';

class FetchErrorCapturer extends ErrorCapturer {
    public readonly capturedHandler: CapturedHandler;
    private originalFetch: typeof window.fetch;

    public constructor(handler: CapturedHandler) {
        super(CaptureType.Fetch);
        this.capturedHandler = handler;
        this.originalFetch = window.fetch;
        window.fetch = this.capturedFetch;
    }

    public receiveCaptured() {
        console.warn(`FetchError Does Not Support Error Transfer`);
        return false;
    }

    protected generateFingerPrint(
        method: string,
        url: string,
        status: number,
        statusText: string,
    ): FingerPrint {
        return `${method}@${url}@${status}@${statusText}`;
    }

    protected generateErrorLevel(status: number) {
        if (status >= 500 && status < 600) return ErrorLevel.Fatal;
        if (status >= 400) return ErrorLevel.Error;
        if (status >= 300) return ErrorLevel.Info;
        return ErrorLevel.Warning;
    }

    private capturedFetch(input: RequestInfo, init?: RequestInit) {
        let requestMethod = 'POST';
        return this.originalFetch(input, init)
            .then((res: Response) => {
                if (!res.ok) this.handleResponseError(res, requestMethod);
                return res;
            })
            .catch((err: Error) => {
                this.handleCatchError(err);
                throw err;
            });
    }

    private handleCatchError(err: Error) {
        // transfer runtime err to RuntimeErrorCapture
        ErrorCapturer.transfer(CaptureType.Runtime, err);
    }

    private handleResponseError(res: Response, method: string) {
        const { url, status, statusText } = res;
        const capturedError: ICapturedError = {
            context: ErrorCapturer.getContext(),
            type: ErrorType.FetchError,
            fingerPrint: this.generateFingerPrint(
                method,
                url,
                status,
                statusText,
            ),
            level: this.generateErrorLevel(status),
            detail: {
                url,
                method,
                status,
                statusText,
            },
        };
        this.handleCaptured(capturedError);
    }

    private handleCaptured(err: any) {
        if (this.capturedHandler) this.capturedHandler(err);
    }
}

export default FetchErrorCapturer;
