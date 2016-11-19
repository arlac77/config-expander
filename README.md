[![npm](https://img.shields.io/npm/v/config-expander.svg)](https://www.npmjs.com/package/config-expander)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/config-expander)
[![Build Status](https://secure.travis-ci.org/arlac77/config-expander.png)](http://travis-ci.org/arlac77/config-expander)
[![bithound](https://www.bithound.io/github/arlac77/config-expander/badges/score.svg)](https://www.bithound.io/github/arlac77/config-expander)
[![codecov.io](http://codecov.io/github/arlac77/config-expander/coverage.svg?branch=master)](http://codecov.io/github/arlac77/config-expander?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/config-expander/badge.svg)](https://coveralls.io/r/arlac77/config-expander)
[![Code Climate](https://codeclimate.com/github/arlac77/config-expander/badges/gpa.svg)](https://codeclimate.com/github/arlac77/config-expander)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/config-expander/badge.svg)](https://snyk.io/test/github/arlac77/config-expander)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/config-expander.svg?style=flat-square)](https://github.com/arlac77/config-expander/issues)
[![Dependency Status](https://david-dm.org/arlac77/config-expander.svg)](https://david-dm.org/arlac77/config-expander)
[![devDependency Status](https://david-dm.org/arlac77/config-expander/dev-status.svg)](https://david-dm.org/arlac77/config-expander#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/config-expander.svg?branch=master)](http://inch-ci.org/github/arlac77/config-expander)
[![downloads](http://img.shields.io/npm/dm/config-expander.svg?style=flat-square)](https://npmjs.org/package/config-expander)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


config-expander
-------------------

Expands expressions in config json

# example

## file.js

```js
const expand = require('config-expander').expand;

// expanding hole expressions at the key position
console.log(JSON.stringify(expand({"key" : "${value}" },{ constants:{value: 77}})));
```

Output

```
{ "key" : 77 }
```

# API Reference

* * *

# install

With [npm](http://npmjs.org) do:

```shell
npm install config-expander
```

# license

BSD-2-Clause
