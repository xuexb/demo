# Babel6 development using es6+

## install

`mkdir babel6 && cd babel6 && vim package.json`：

```json
{
  "name": "es6-babel6",
  "version": "0.0.1",
  "description": "开发es6，基于babel6",
  "scripts": {
    "compile": "babel src --out-dir lib",
    "watch": "npm run compile -- --watch"
  },
  "devDependencies": {
    "babel-cli": "^6.2.0",
    "babel-preset-es2015": "6.x.x",
    "babel-preset-stage-0": "6.x.x",
    "babel-preset-stage-3": "6.x.x",
    "babel-plugin-transform-runtime": "6.x.x"
  },
  "babel": {
    "presets": [
      "es2015",
      "stage-0",
      "stage-3"
    ],
    "plugins": [
      "transform-runtime"
    ]
  },
  "dependencies": {
    "babel-runtime": "^5.0.0"
  }
}
```

Use `npm insatll` to install dependency

## CLI

### compile

```bash
npm run compile
```

### watch && compile

```bash
npm run watch
```

## Why use runtime

Because even with babel compilation will retain some global objects , such as Iterator, Generator, Set, Map, Symbol, Promise, in order to achieve compatible es5, you can use runtime can solve these problems

## Links

[Babel5 development using es6+](../babel5/)