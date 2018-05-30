[![npm](https://img.shields.io/npm/v/config-expander.svg)](https://www.npmjs.com/package/config-expander)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
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
-   [Value](#value)
-   [ConfigFunction](#configfunction)
-   [functions](#functions)
    -   [include](#include)
    -   [replace](#replace)
    -   [toUpperCase](#touppercase)
    -   [toLowerCase](#tolowercase)
    -   [split](#split)
    -   [encrypt](#encrypt)
    -   [decrypt](#decrypt)
    -   [spawn](#spawn)
-   [Apply](#apply)

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

## Value

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

-   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## ConfigFunction

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

-   `arguments` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `returns` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `apply` **[Apply](#apply)** 

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

### spawn

Call programm

**Parameters**

-   `executable` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path
-   `arguments` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** stdout

## Apply

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `Context` **Context** 
-   `args` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Value](#value)>** 

# install

With [npm](http://npmjs.org) do:

```shell
npm install config-expander
```

# license

BSD-2-Clause
