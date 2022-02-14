# fetch-cache-js

Simple fetch cache.

See `test.js` for use cases.

##  Test
- Install the package
- Run tests
```shell
npm install
node test.js
```

##  Use in your application
```js
const { fetch, options } = require('./fetch-cache/index.js');

//  set timeout 2 sec
options.cache_timeout = 2000;

const foo = await fetch('https://google.com');
const bar = await fetch('https://google.com'); // cached response
```

##  API
- `fetch(url, options)` - setup timeout with `fetch_timeout` and call `cache(fetch_upstream, url, wrap_options(options))`.
- `cache(fetch, url, options)` - check if `url` is cached and return the cached response, or call `fetch` otherwise and cache the response.
  - If `request_filter(url, options)` returns `false`, just call `fetch` and return the response.
  - If `response_filter(response)` returns `false`, don't cache the response.
- `clear()` - clear the cache.

### Options
- `fetch_upstream` - upstream `fetch` function. Default is `require('node-fetch')`.
- `fetch_timeout` - fetch timeout in milliseconds. Default is `10000`.
- `cache_timeout` - cache timeout in milliseconds. Default is `5000`.
- `request_filter` - request filter function. By default, only `GET` request responses are cached.
- `response_filter` - response filter function. By default, only responses with status `200` OK are cached.
- `wrap_options` - wrap request options function. By default, don't change request options.
- `autoclean_count` - how many cache responses to check for timeout when `cache` is called. Default is `20`.

## For tip
- `btc` Bitcoin `bc1qau5y9wf49ammclhscuelwlm6370d9lqph6g9um`
- `btc` Bitcoin (Legacy) `369h9iMSq8ihjYMwdwhbn2ffXMrprHvxav`
- `eth` Ethereum `0x98556fb56e3079696738579dBE70a5Fa761110b9`
