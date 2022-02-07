/*  Copyright (c) 2022 Mitya Selivanov
 */ 

'use strict';

const { fetch, cache, clear } = require('./index.js');
const node_fetch              = require('node-fetch');

async function test_fetch_google() {
  let foo = await (await fetch('https://google.com')).text();
  let bar = await (await fetch('https://google.com')).text();

  return foo == bar;
}

async function test_custom_fetch() {
  let fetch_called = 0;

  const my_fetch = function(url, options) {
    return new Promise((resolve, reject) => {
      fetch_called++;
      node_fetch(url, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  clear();

  let foo = await (await cache(my_fetch, 'https://google.com')).text();
  let bar = await (await cache(my_fetch, 'https://google.com')).text();

  return fetch_called == 1;
}

let test_count = 0;
let fail_count = 0;

async function add_test(do_test, name) {
  test_count++;

  let success = false;
  let error   = false;

  const time = Date.now();

  try {
    success = await do_test();
  } catch (e) {
    success = false;
    error   = e;
  }

  const time_elapsed = Date.now() - time;
  const spaces       = ' '.repeat(Math.max(0, 40 - name.length));

  if (success) {
    console.log(`[ OK   ] ${name}${spaces} - ${time_elapsed / 1000} sec`);
  } else {
    fail_count++;
    console.log(`[ FAIL ] ${name}${spaces} - ${time_elapsed / 1000} sec`);
  }

  if (error) {
    console.log(error);
  }
}

async function run_tests() {
  console.log('Run tests.\n');

  await add_test(test_fetch_google, 'Fetch Google.');
  await add_test(test_custom_fetch, 'Custom fetch function.');

  console.log(`\n${test_count - fail_count} of ${test_count} tests pass.`);

  if (fail_count == 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run_tests();
