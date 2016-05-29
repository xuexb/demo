
var inArray = require('in-array');
var gutil = require('gulp-util');
var through = require('through2');
var extend = require('extend');
var path = require('path');
var Promise = require('promise');


// consts
var PLUGIN_NAME = 'gulp-requirejs-concat';

var defaults = {
    baseUrl: './',
    paths: {},
    shim: {},
    outFile: null,
    copyFile: false
};

var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
var defineTpl = 'define("{uri}", [{deps}], function';

var concat = {};

var showErrMsg = function (err) {
    gutil.log(gutil.colors.red(PLUGIN_NAME + ' Error: ' + err));
};

concat.checkAmd = function (contents, filepath) {
    return new Promise(function (resolve, reject) {
        var uri;

        if (/define\(([\s\S]+?)\)/.test(contents)) {
            resolve({
                shim: false
            });
        }
        else {
            uri = concat.parseUri(filepath).uri;
            uri = concat.options.__paths[uri] || uri;
            if (concat.options.shim[uri]) {
                resolve({
                    shim: concat.options.shim[uri],
                    uri: uri
                });
            }
            else {
                reject('文件不是amd模块，请配置 shim，路径：' + filepath);
            }
        }
    });
};

concat.parse = function (contents, filepath) {
    return concat.checkAmd(contents, filepath).then(function (data) {
        return new Promise(function (resolve, reject) {
            if (data.shim) {
                contents += '\ndefine("' + data.uri + '",[],function(){return ' + data.shim.exports + '});\n';
                return resolve({
                    shim: true,
                    contents: contents
                });
            }

            global.define = function (name, deps, callback) {
                // Allow for anonymous modules
                if (typeof name !== 'string') {
                    // Adjust args appropriately
                    callback = deps;
                    deps = name;
                    name = null;
                }

                // This module may not have dependencies
                if (!Array.isArray(deps)) {
                    callback = deps;
                    deps = null;
                }

                // 没有依赖，则从callback里提取
                if (!deps && 'function' === typeof callback) {
                    deps = [];

                    if (callback.length) {
                        callback.toString().replace(commentRegExp, function (match, multi, multiText, singlePrefix) {
                            return singlePrefix || '';
                        }).replace(cjsRequireRegExp, function (match, dep) {
                            deps.push(dep);
                        });

                        deps = (callback.length === 1 ? [
                            'require'
                        ] : [
                            'require',
                            'exports',
                            'module'
                        ]).concat(deps);
                    }
                }
                else if ('function' !== typeof callback) {
                    name = concat.parseUri(filepath).uri;
                }

                // 第二种情况：define(['a'], function (a) {})
                // else if (Array.isArray(deps)) {
                // }

                // 如果没有定义模块id则从路径里提取
                if (!name) {
                    name = concat.parseUri(filepath).uri;
                }

                // 替换define
                contents = contents.replace(/define\(([\S\s]*?)function/, function ($0, $1) {
                    return defineTpl.replace(/{([^}]+)}/g, function ($$0, $$1) {
                        if ($$1 === 'uri') {
                            return name;
                        }

                        if ($$1 === 'deps') {
                            return deps && deps.length ? deps.map(function (val) {
                                return '"' + val + '"';
                            }).join(', ') : '';
                        }

                        return '';
                    });
                });

                resolve({
                    contents: contents
                });
            };

            try {
                new Function('return function(){' + contents + '}')().call();
            }
            catch (e) {
                reject('模块解析失败, ' + e.message);
            }
        });

    });
};

/**
 * 解析文件路径的uri
 *
 * @param  {string} filepath 文件绝对路径
 *
 * @return {Object}          {ext, uri}
 */
concat.parseUri = function (filepath) {
    var options = concat.options;
    var ext = path.extname(filepath);
    var uri = filepath.replace(options.__dirname, '').replace(options.baseUrl, '');

    uri = uri.slice(1, uri.indexOf(ext));

    return {
        ext: ext.substr(1),
        uri: options.__paths[uri] || uri
    };
};

concat.run = function (options) {
    var filedata = [];

    concat.options = extend({}, defaults, options);
    concat.options.__dirname = path.resolve('./');

    // 处理paths映射
    concat.options.__paths = {};
    Object.keys(concat.options.paths).forEach(function (key) {
        concat.options.__paths[concat.options.paths[key]] = key;
    });

    return through.obj(function (file, encoding, callback) {
        if (!concat.options.outFile && !concat.options.copyFile) {
            return showErrMsg('请配置 outFile 或者 copyFile');
        }

        concat.parse(file.contents.toString(), file.path).then(function (data) {
            // 如果需要复制文件
            if (concat.options.copyFile) {
                file.contents = new Buffer(data.contents);
                callback(null, file);
            }
            else {
                callback();
            }

            // 如果有产出合并文件
            if (concat.options.outFile) {
                filedata.push({
                    filepath: file.path,
                    contents: data.contents
                });
            }

        }).catch(function (err) {
            showErrMsg(err);
        });
    }, function () {
        var contents;
        var file;

        if (!filedata.length || !concat.options.outFile) {
            return;
        }

        contents = filedata.map(function (data) {
            return data.contents;
        }).join('');

        file = new gutil.File({
            base: path.resolve(__dirname, './'),
            cwd: __dirname,
            path: path.resolve(__dirname, './', concat.options.outFile),
            contents: new Buffer(contents)
        });

        this.push(file);
    });
};

module.exports = concat.run;
