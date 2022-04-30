[![npm](https://img.shields.io/npm/v/config-expander.svg)](https://www.npmjs.com/package/config-expander)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/config-expander)](https://bundlephobia.com/result?p=config-expander)
[![downloads](http://img.shields.io/npm/dm/config-expander.svg?style=flat-square)](https://npmjs.org/package/config-expander)
[![GitHub Issues](https://img.shields.io/github/issues/config-expander/config-expander.svg?style=flat-square)](https://github.com/config-expander/config-expander/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fconfig-expander%2Fconfig-expander%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/config-expander/config-expander/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/config-expander/config-expander/badge.svg)](https://snyk.io/test/github/config-expander/config-expander)
[![Coverage Status](https://coveralls.io/repos/config-expander/config-expander/badge.svg)](https://coveralls.io/github/config-expander/config-expander)

## config-expander

Expands expressions in config files

# example

## file.js

<!-- skip-example -->

```js
import { expand } from "config-expander";

// expanding hole expressions at the value position (result key is a number)
expand({ key: "${value + 1}" }, { constants: { value: 77 } }).then(r =>
  console.log(JSON.stringify(r))
);

// calculate port numbers
expand({ constants: { base: 10000 }, http: { port: "${base + 1}" } }).then(r =>
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

*   [defaultConstants](#defaultconstants)
    *   [Properties](#properties)
*   [expand](#expand)
    *   [Parameters](#parameters)
*   [Value](#value)
    *   [Properties](#properties-1)
*   [Apply](#apply)
    *   [Parameters](#parameters-1)
*   [ConfigFunction](#configfunction)
    *   [Properties](#properties-2)
*   [functions](#functions)
    *   [include](#include)
        *   [Parameters](#parameters-2)
    *   [replace](#replace)
        *   [Parameters](#parameters-3)
    *   [toUpperCase](#touppercase)
        *   [Parameters](#parameters-4)
    *   [toLowerCase](#tolowercase)
        *   [Parameters](#parameters-5)
    *   [split](#split)
        *   [Parameters](#parameters-6)
    *   [encrypt](#encrypt)
        *   [Parameters](#parameters-7)
    *   [decrypt](#decrypt)
        *   [Parameters](#parameters-8)
    *   [spawn](#spawn)
        *   [Parameters](#parameters-9)
*   [merge](#merge)
    *   [Parameters](#parameters-10)

## defaultConstants

Predefined constants

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `env` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** environment variables from process.env
*   `os` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** os module
*   `basedir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** filesystem configuration start point

## expand

Expands expressions in a configuration object

### Parameters

*   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** config source
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the options (optional, default `{}`)

    *   `options.constants` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** additional constants
    *   `options.default` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** default configuration
    *   `options.functions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** additional functions

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** resolves to the expanded configuration

## Value

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `value` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## Apply

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

### Parameters

*   `Context` **Context** 
*   `args` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Value](#value)>** 

## ConfigFunction

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `arguments` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
*   `returns` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `apply` **[Apply](#apply)** 

## functions

knwon functions

### include

Include definition form a file.

#### Parameters

*   `file` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file name to be included

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** content of the file

### replace

Replace string.

#### Parameters

*   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** replaced content

### toUpperCase

Convert string into upper case.

#### Parameters

*   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** uppercase result

### toLowerCase

Convert string into lower case.

#### Parameters

*   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** lowercase result

### split

Split source string on pattern boundaries.

#### Parameters

*   `source` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `pattern` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** separated source

### encrypt

Encrypt a plaintext value.

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `plaintext` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input value

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** encrypted value

### decrypt

Decrypt a former encrypted string.

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `encrypted` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** plaintext

### spawn

Call executable.

#### Parameters

*   `executable` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path
*   `arguments` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** stdout

## merge

merge from b into a
When a and b are arrays of values only the none duplaces are appendend to a

### Parameters

*   `a` **any** 
*   `b` **any** 

Returns **any** merged b into a

# install

With [npm](http://npmjs.org) do:

```shell
npm install config-expander
```

# license

BSD-2-Clause
