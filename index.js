/*  Copyright (c) 2022 Mitya Selivanov
 */ 

'use strict';

const default_fetch = require('node-fetch');

const default_cache_timeout = 5000;

function default_request_filter(url, request_options) {
  return  !request_options ||
          !('method' in request_options) ||
          request_options['method'] == 'GET';
}

function default_response_filter(response) {
  return response.status == 200;
}

function default_wrap_options(request_options) {
  return request_options;
}

const options = {
  fetch:            default_fetch,
  cache_timeout:    default_cache_timeout,
  request_filter:   default_request_filter,
  response_filter:  default_response_filter,
  wrap_options:     default_wrap_options
};

let response_pool = {};

function clear() {
  response_pool = {};
}

async function save_response(url, response) {
  if (!options.response_filter(response)) {
    return response;
  }

  response_pool[url] = {
    time: Date.now(),
    response: response.clone()
  };
}

function load_response(url) {
  return response_pool[url].response.clone();
}

function time_elapsed(url) {
  return Date.now() - response_pool[url].time;
}

function check_timeout(url) {
  return  (url in response_pool) &&
          time_elapsed(url) < options.cache_timeout;
}

var fetch;

async function cache(custom_fetch, url, request_options) {
  if (custom_fetch === fetch) {
    throw "Infinite recursion.";
  }

  if (!options.request_filter(url, request_options)) {
    return await custom_fetch(url, request_options);
  }

  if (!check_timeout(url)) {
    await save_response(url, await custom_fetch(url, request_options));
  }

  return load_response(url);
}

fetch = function(url, request_options) {
  return new Promise((resolve, reject) => {
    cache(options.fetch, url, options.wrap_options(request_options))
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = {
  fetch:    fetch,
  cache:    cache,
  clear:    clear,
  options:  options
};
