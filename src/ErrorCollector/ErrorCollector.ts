import { COLLECTION_MAX_INTERVAL, COLLECTOR_SIZE } from 'config';
import { ICapturedError } from '../ErrorCapturer/ErrorCapturer';
import FetchErrorCapturer from '../ErrorCapturer/FetchErrorCapturer';
import RuntimeErrorCapturer from '../ErrorCapturer/RuntimeErrorCapturer';
import ErrorUploader from '../ErrorUploader/ErrorUploader';

export default class ErrorCollector {
    private errorQueue: ICapturedError[];
    private readonly fetchErrorCapturer: FetchErrorCapturer;
    private readonly runtimeErrorCapturer: RuntimeErrorCapturer;
    private readonly errorUploader: ErrorUploader;
    private timeoutScheduleTimer: number;

    public constructor() {
        this.fetchErrorCapturer = new FetchErrorCapturer(
            this.onCollected.bind(this),
        );
        this.runtimeErrorCapturer = new RuntimeErrorCapturer(
            this.onCollected.bind(this),
        );
        this.errorUploader = new ErrorUploader();
        this.errorQueue = [];
        this.setupTimeoutSchedule();
    }

    private onCollected(capturedError: ICapturedError) {
        this.errorQueue.push(capturedError);
        if (this.errorQueue.length >= COLLECTION_MAX_INTERVAL)
            this.flushErrorQueue();
    }

    private async flushErrorQueue() {
        const queueWIP = this.errorQueue;
        if (queueWIP.length < 1) return;
        this.errorQueue = [];
        this.clearTimeoutSchedule();
        try {
            await this.errorUploader.upload(queueWIP);
            this.setupTimeoutSchedule();
        } catch (err) {
            console.warn(err);
            this.errorQueue.push(...queueWIP);
        }
    }

    private setupTimeoutSchedule() {
        this.timeoutScheduleTimer = setTimeout(
            () => this.flushErrorQueue(),
            COLLECTION_MAX_INTERVAL,
        );
    }

    private clearTimeoutSchedule() {
        clearTimeout(this.timeoutScheduleTimer);
        this.timeoutScheduleTimer = null;
    }
}
