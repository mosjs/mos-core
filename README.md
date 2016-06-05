# mos-core

> Markdown parser

<!--@shields.flatSquare('npm', 'travis', 'coveralls')-->
[![npm version](https://img.shields.io/npm/v/mos-core.svg?style=flat-square)](https://www.npmjs.com/package/mos-core) [![Build Status](https://img.shields.io/travis/mosjs/mos-core/master.svg?style=flat-square)](https://travis-ci.org/mosjs/mos-core) [![Coverage Status](https://img.shields.io/coveralls/mosjs/mos-core/master.svg?style=flat-square)](https://coveralls.io/r/mosjs/mos-core?branch=master)
<!--/@-->

## Installation

```sh
npm install --save mos-core
```

## Usage

```js
const mosCore = require('mos-core')
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)

* * *

<!--@dependencies({ shield: 'flat-square' })-->
## <a name="dependencies">Dependencies</a> [![dependency status](https://img.shields.io/david/mosjs/mos-core/master.svg?style=flat-square)](https://david-dm.org/mosjs/mos-core/master)

- [babel-run-async](https://github.com/zkochan/run-async): Utility method to run function either synchronously or asynchronously using the common `this.async()` style.
- [babel-runtime](https://github.com/babel/babel/blob/master/packages): babel selfContained runtime
- [ccount](https://github.com/wooorm/ccount): Count characters
- [collapse-white-space](https://github.com/wooorm/collapse-white-space): Replace multiple white-space characters with a single space
- [core-js](https://github.com/zloirock/core-js): Standard library
- [longest-streak](https://github.com/wooorm/longest-streak): Count the longest repeating streak of a character
- [markdown-table](https://github.com/wooorm/markdown-table): Markdown/ASCII tables
- [parse-entities](https://github.com/wooorm/parse-entities): Parse HTML character references: fast, spec-compliant, positional information
- [stringify-entities](https://github.com/wooorm/stringify-entities): Encode HTML character references and character entities
- [trim-trailing-lines](https://github.com/wooorm/trim-trailing-lines): Remove final newline characters from a string
- [unist-util-remove-position](https://github.com/wooorm/unist-util-remove-position): Remove `position`s from a unist tree
- [vfile](https://github.com/wooorm/vfile): Virtual file format for text processing
- [vfile-location](https://github.com/wooorm/vfile-location): Convert between positions (line and column-based) and offsets (range-based) locations in a virtual file

<!--/@-->

<!--@devDependencies({ shield: 'flat-square' })-->
## <a name="dev-dependencies">Dev Dependencies</a> [![devDependency status](https://img.shields.io/david/dev/mosjs/mos-core/master.svg?style=flat-square)](https://david-dm.org/mosjs/mos-core/master#info=devDependencies)

- [babel-cli](https://github.com/babel/babel/blob/master/packages): Babel command line.
- [babel-plugin-add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports): Fix babel/babel#2212
- [babel-plugin-transform-runtime](https://github.com/babel/babel/blob/master/packages): Externalise references to helpers and builtins, automatically polyfilling your code without polluting globals
- [babel-preset-es2015](https://github.com/babel/babel/blob/master/packages): Babel preset for all es2015 plugins.
- [babel-register](https://github.com/babel/babel/blob/master/packages): babel require hook
- [camelcase](https://github.com/sindresorhus/camelcase): Convert a dash/dot/underscore/space separated string to camelCase: foo-bar → fooBar
- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [clone](https://github.com/pvorb/node-clone): deep cloning of objects and arrays
- [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog): Commitizen adapter following the conventional-changelog format.
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://github.com/feross/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise): Enforce best practices for JavaScript promises
- [eslint-plugin-standard](https://github.com/xjamundx/eslint-plugin-standard): ESlint Plugin for the Standard Linter
- [extend](https://github.com/justmoon/node-extend): Port of jQuery.extend for node.js and the browser
- [ghooks](https://github.com/gtramontina/ghooks): Simple git hooks
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mos](https://github.com/mosjs/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [mos-plugin-readme](https://github.com/mosjs/mos-plugin-readme): A mos plugin for generating README
- [semantic-release](https://github.com/semantic-release/semantic-release): automated semver compliant package publishing
- [tslint](https://github.com/palantir/tslint): An extensible static analysis linter for the TypeScript language
- [typescript](https://github.com/Microsoft/TypeScript): TypeScript is a language for application scale JavaScript development
- [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg): Script to validate a commit message follows the conventional changelog standard

<!--/@-->
