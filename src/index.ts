import ErrorCollector from './ErrorCollector/ErrorCollector';

export default function init(): ErrorCollector {
    return new ErrorCollector();
}
