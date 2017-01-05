[![npm](https://img.shields.io/npm/v/config-expander.svg)](https://www.npmjs.com/package/config-expander)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/config-expander)
[![Build Status](https://secure.travis-ci.org/arlac77/config-expander.png)](http://travis-ci.org/arlac77/config-expander)
[![bithound](https://www.bithound.io/github/arlac77/config-expander/badges/score.svg)](https://www.bithound.io/github/arlac77/config-expander)
[![codecov.io](http://codecov.io/github/arlac77/config-expander/coverage.svg?branch=master)](http://codecov.io/github/arlac77/config-expander?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/config-expander/badge.svg)](https://coveralls.io/r/arlac77/config-expander)
[![Code Climate](https://codeclimate.com/github/arlac77/config-expander/badges/gpa.svg)](https://codeclimate.com/github/arlac77/config-expander)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/config-expander/badge.svg)](https://snyk.io/test/github/arlac77/config-expander)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/config-expander.svg?style=flat-square)](https://github.com/arlac77/config-expander/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/config-expander.svg?label=ready&title=Ready)](http://waffle.io/arlac77/config-expander)
[![Dependency Status](https://david-dm.org/arlac77/config-expander.svg)](https://david-dm.org/arlac77/config-expander)
[![devDependency Status](https://david-dm.org/arlac77/config-expander/dev-status.svg)](https://david-dm.org/arlac77/config-expander#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/config-expander.svg?branch=master)](http://inch-ci.org/github/arlac77/config-expander)
[![downloads](http://img.shields.io/npm/dm/config-expander.svg?style=flat-square)](https://npmjs.org/package/config-expander)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

config-expander
-------------------

Expands expressions in config files

# example

## file.js

```js
const {expand} = require('config-expander');

// expanding hole expressions at the value position (result is a number)

expand({"key" : "${value + 1}" },{ constants:{value: 77}}).then(r => console.log(JSON.stringify(r)));
```

Output

```
{ "key" : 78 }
```

# API Reference
- config-expander
- config-expander

* <a name="module_config-expander.expand"></a>

## config-expander.expand(config, [options]) ⇒ <code>Promise</code>
Expands expressions in a configuration object

**Kind**: static method of <code>[config-expander](#module_config-expander)</code>  
**Returns**: <code>Promise</code> - expanded configuration  

| Param | Type |
| --- | --- |
| config | <code>object</code> | 
| [options] | <code>object</code> | 


* <a name="module_config-expander..functions.encrypt.apply"></a>

## module:config-expander~functions.encrypt.apply(key, plaintext) ⇒ <code>string</code>
Encrypt a plaintext value

**Kind**: static method of <code>module:config-expander~functions.encrypt</code>  
**Returns**: <code>string</code> - encrypted value  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| plaintext | <code>string</code> | 


* <a name="module_config-expander..functions.decrypt.apply"></a>

## module:config-expander~functions.decrypt.apply(key, encrypted) ⇒ <code>string</code>
Decrypt a former encrypted string

**Kind**: static method of <code>module:config-expander~functions.decrypt</code>  
**Returns**: <code>string</code> - plaintext  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| encrypted | <code>string</code> | 


* * *

# install

With [npm](http://npmjs.org) do:

```shell
npm install config-expander
```

# license

BSD-2-Clause
