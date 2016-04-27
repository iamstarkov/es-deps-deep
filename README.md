# es-deps-deep

[![NPM version][npm-image]][npm-url]
[![Unix Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> ECMAScript 2015+/CommonJS module dependencies resolved array in depth

## Install

    npm install --save es-deps-deep

## Usage

```js
import { esDepsDeep, esDepsDeepAsync } from 'es-deps-deep';

esDepsDeep('unicorns'); // unicorns
esDepsDeepAsync('unicorns')
  .then(result => console.log(result)); // unicorns
```

## API

### esDepsDeep(input, [options])

### esDepsDeepAsync(input, [options])

Return a promise that resolves to `result`.

#### input

*Required*  
Type: `String`

Lorem ipsum.

#### options

##### foo

Type: `Boolean`  
Default: `false`

Lorem ipsum.

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/es-deps-deep
[npm-image]: https://img.shields.io/npm/v/es-deps-deep.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/es-deps-deep
[travis-image]: https://img.shields.io/travis/iamstarkov/es-deps-deep.svg?style=flat-square&label=unix

[appveyor-url]: https://ci.appveyor.com/project/iamstarkov/es-deps-deep
[appveyor-image]: https://img.shields.io/appveyor/ci/iamstarkov/es-deps-deep.svg?style=flat-square&label=windows

[coveralls-url]: https://coveralls.io/r/iamstarkov/es-deps-deep
[coveralls-image]: https://img.shields.io/coveralls/iamstarkov/es-deps-deep.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/es-deps-deep
[depstat-image]: https://david-dm.org/iamstarkov/es-deps-deep.svg?style=flat-square
