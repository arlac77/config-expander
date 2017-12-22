[![npm](https://img.shields.io/npm/v/config-expander.svg)](https://www.npmjs.com/package/config-expander)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/config-expander.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/config-expander)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/config-expander.png)](http://travis-ci.org/arlac77/config-expander)
[![bithound](https://www.bithound.io/github/arlac77/config-expander/badges/score.svg)](https://www.bithound.io/github/arlac77/config-expander)
[![codecov.io](http://codecov.io/github/arlac77/config-expander/coverage.svg?branch=master)](http://codecov.io/github/arlac77/config-expander?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/config-expander/badge.svg)](https://coveralls.io/r/arlac77/config-expander)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/config-expander/badge.svg)](https://snyk.io/test/github/arlac77/config-expander)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/config-expander.svg?style=flat-square)](https://github.com/arlac77/config-expander/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/config-expander.svg?label=ready&title=Ready)](http://waffle.io/arlac77/config-expander)
[![Dependency Status](https://david-dm.org/arlac77/config-expander.svg)](https://david-dm.org/arlac77/config-expander)
[![devDependency Status](https://david-dm.org/arlac77/config-expander/dev-status.svg)](https://david-dm.org/arlac77/config-expander#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/config-expander.svg?branch=master)](http://inch-ci.org/github/arlac77/config-expander)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/config-expander.svg?style=flat-square)](https://npmjs.org/package/config-expander)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## config-expander

Expands expressions in config files

# example

## file.js

```js
const { expand } = require('config-expander');

// expanding hole expressions at the value position (result key is a number)
expand({ key: '${value + 1}' }, { constants: { value: 77 } }).then(r =>
  console.log(JSON.stringify(r))
);

// calculate port numbers
expand({ constants: { base: 10000 }, http: { port: '${base + 1}' } }).then(r =>
  console.log(JSON.stringify(r))
);

// load config from file
expand("${include('tests/fixtures/other.json')}").then(r =>
  console.log(JSON.stringify(r))
);
```

## Output

```json
{ "key" : 78 }
{ "constants": { "base": 10000 }, "http": { "port": 10001 }}
{ "key": "value from other" }
```

# Examples

## read config file (json)

<!-- skip-example -->

```js
const configuration await expand("${include('" + '/path/to/the/config.json' + "')}")
```

## load key file

```json
{
  "ca": "${document(os.home + '/ca.pem')}"
}
```

## calculate port numbers

```json
{
  "http-port": "${base + 0}",
  "https-port": "${base + 1}"
}
```

## conditions

```json
{
  "copy-cmd": "${os.platform == 'win32' ? 'copy' : 'cp'}"
}
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [expand](#expand)
-   [config-expander](#config-expander)
-   [functions](#functions)
    -   [include](#include)
    -   [replace](#replace)
    -   [toUpperCase](#touppercase)
    -   [toLowerCase](#tolowercase)
    -   [split](#split)
    -   [encrypt](#encrypt)
    -   [decrypt](#decrypt)

## expand

Expands expressions in a configuration object
Predefined constants:

-   os
-   basedir

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** config source
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the options (optional, default `{}`)
    -   `options.constants` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** additional constants
    -   `options.functions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** additional functions

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** resolves to the expanded configuration

## config-expander

## functions

knwon functions

### include

include definition form a file

**Parameters**

-   `file` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file name to be included

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** content of the file

### replace

Replace strang

**Parameters**

-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** replaced content

### toUpperCase

convert string into upper case

**Parameters**

-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** uppercase result

### toLowerCase

convert string into lower case

**Parameters**

-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** lowercase result

### split

split source string on pattern boundaries

**Parameters**

-   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `pattern` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** separated source

### encrypt

Encrypt a plaintext value

**Parameters**

-   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `plaintext` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** encrypted value

### decrypt

Decrypt a former encrypted string

**Parameters**

-   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `encrypted` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** plaintext

# install

With [npm](http://npmjs.org) do:

```shell
npm install config-expander
```

# license

BSD-2-Clause
