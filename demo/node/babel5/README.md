# Babel6 development using es6+

## install

`mkdir babel5 && cd babel5 && vim package.json`：

```json
{
    "name": "es6-babel5",
    "version": "0.0.1",
    "description": "开发es6，基于babel5",
    "scripts": {
        "compile": "babel --optional runtime --loose all --stage 0 --modules common src/ --out-dir lib/",
        "watch": "npm run compile -- --watch"
    },
    "dependencies": {
        "babel-runtime": "^5.8.20"
    },
    "devDependencies": {
        "babel": "5.8.21"
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

[Babel6 development using es6+](../babel6/)