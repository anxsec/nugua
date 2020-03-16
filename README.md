# nugua

An Error Monitoring SDK for Web Browsers.

## Configuration

To change default `COLLECTION_MAX_INTERVAL` and `COLLECTOR_SIZE` configuration, modify `config.yml` file in the root of this repo and recompile.

```yaml
COLLECTION_MAX_INTERVAL: 10000
COLLECTOR_SIZE: 10
```

## TODO

-   [x] Refactor `types` directory structure and extract ts type definitions from source code.
-   [ ] Use IoC to initialize objects and inject dependencies.
-   [ ] Add automated testing.
-   [ ] Improve complication process.
