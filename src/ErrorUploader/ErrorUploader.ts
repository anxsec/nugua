import { ICapturedError } from '../ErrorCapturer/ErrorCapturer';

export default class ErrorUploader {
    public upload(capturedErrorQueue: ICapturedError[]): Promise<void> {
        // simulate the upload
        return new Promise((resolve, reject) => {
            console.log(capturedErrorQueue);
            setTimeout(() => {
                if (Math.random() * 10 < 1)
                    reject(new Error('Upload failed after 3 times retries.'));
                else resolve();
            }, Math.random() * 1000);
        });
    }
}
