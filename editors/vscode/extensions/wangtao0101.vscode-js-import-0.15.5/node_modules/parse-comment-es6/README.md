# parse-comment-es6
[![NPM version](https://img.shields.io/npm/v/parse-comment-es6.svg?style=flat)](https://www.npmjs.com/package/parse-comment-es6)
[![Build Status](https://img.shields.io/travis/wangtao0101/parse-comment-es6.svg?style=flat)](https://travis-ci.org/wangtao0101/parse-comment-es6)

A new comment parse for es6

## Install
```
npm install parse-comment-es6 --save
yarn add parse-comment-es6
```

## Usage
```
import strip from 'parse-comment-es6';
const p = '`aaa`\n//abc\n';
console.log(strip(p, { comment: true, range: true, loc: true, raw: true }));
// =>
//    text: '`aaa`\n\n',
//    comments: [
//        {
//             type: 'LineComment',
//             raw: '//abc'
//             loc: {
//                 start: {
//                     line: 1,
//                     column: 0,
//                 },
//                 end: {
//                     line: 1,
//                     column: 5,
//                 },
//             },
//             range: {
//                 start: 6,
//                 end: 11,
//             },
//       }
//   ]
// };
```

## Option

| Property      | Description                                     | Type       | Default |
|-----------|------------------------------------------|------------|--------|
| comment  | need to return comment list | boolean | false
| raw  | need to return comment raw, comment option should be true | boolean | false
| loc  | need to return comment loc, comment option should be true | boolean | false
| range  | need to return comment range, comment option should be true | boolean | false


## Test
test past using jquery, react, react-dom

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/wangtao0101/parse-comment-es6/issues).
