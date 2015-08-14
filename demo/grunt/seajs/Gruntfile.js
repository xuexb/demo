/**
 * @file 前端自动化编译, 请先配置 app.js
 *
 * @author xiaowu
 *
 * @version 4.0
 *
 * @changelog
 *     2.0 优化文件，抽出check_app
 *     3.0 添加cmd文件对css,html的打包, 由于seajs2.3.0不支持加载.css，固还使用2.2.1， 2.3.0还得加载css插件
 *     4.0 优化代码，不支持css-sprite，使用import处理合并xhaa
 *
 * @link
 *     1, http://www.xuexb.com/html/223.html
 *     2, http://www.xuexb.com/html/222.html
 *
 * @description 文档待整理
 *
 */

module.exports = function (grunt) {
    'use strict'; // 严禁模式
    var config = grunt.file.readJSON('package.json');
    var banner = '/*' + config.name + ' - v' + config.version + ' - <%= grunt.template.today("yyyy-mm-dd  HH:mm:ss") %>*/';

    // 应用配置
    var App = require('./app');

    // 抽取cmd tpl,css依赖用
    var format = require('util').format;
    var Transport = require('grunt-cmd-transport');
    var style = Transport.style.init(grunt);
    var script = Transport.script.init(grunt);

    var path = require('path');

    // 初始化对象
    var obj = {}; 
    // seajs提取依赖
    var transport = obj.transport = {}; 
    // 合并代码
    var concat = obj.concat = {}; 
    // 压缩js
    var uglify = obj.uglify = {}; 
    // 复制文件
    var copy = obj.copy = {}; 
    // css压缩
    var cssmin = obj.cssmin = {}; 
    // 文件监听
    var watch = obj.watch = {}; 
    // web server
    var connect = obj.connect = {}; 
    // jshint
    var jshint = obj.jshint = {}; 
    // url重写
    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest; 

    // 配置包
    obj.pkg = config;


    // 抽取cmd依赖配置
    // 不使用alias
    transport.options = {
        debug: false,
        paths: [
            './'
        ],
        // alias: { //命名引用, 这里写的生成前的地址
        //     // 'jquery': 'lib/jquery',//jquery库
        //     // 'base': 'lib/base',//初类
        //     // 'dialog': 'lib/dialog'//弹出层
        // },
        parsers: { // 解析方式
            '.js': [
                script.jsParser
            ],
            '.css': [
                style.css2jsParser
            ],
            '.tpl': [function (fileObj, options) {
                var dest = fileObj.dest + '.js';
                var id = (options.idleading + fileObj.name.replace(/\.js$/, '')).replace(/\\/g, '/');
                var data = fileObj.srcData || grunt.file.read(fileObj.src);
                var code = format('define("%s", [], "%s");', id, data.replace(/\"/g, '\\\"'));
                data = code.replace(/(\s{2,}|([\r\n]))/g, '');

                grunt.log.writeln('Transport ' + fileObj.src + ' -> ' + dest);
                grunt.file.write(dest, data);
            }
            ],

        }

    };

    // 复制文件配置
    copy.options = {
        paths: [
            ''
        ]

    };

    // js压缩配置
    uglify.options = {
        banner: banner + '\n'

    };


    // css压缩配置
    cssmin.options = {
        banner: banner,
        compatibility: 'ie7'

    };


    // http服务配置
    connect.options = {
        port: config.port,
        base: './',
        hostname: '*',
        middleware: function (connect, options) {
            var middlewares = [];

            // RewriteRules support
            middlewares.push(rewriteRulesSnippet);

            if (!Array.isArray(options.base)) {
                options.base = [
                    options.base
                ];
            }

            var directory = options.directory || options.base[options.base.length - 1];
            options.base.forEach(function (base) {
                // Serve static files.
                middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            // 添加对字体文件的支持
            middlewares.unshift(function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            });

            return middlewares;
        }

    };
    connect.server = {};
    connect.server_keepalive = {
        options: {
            keepalive: true

        }

    };


    // jshint
    jshint.options = {
        jshintrc: true

    };


    // watch
    watch.options = {
        options: {
            livereload: false

        }

    };
    watch.debug = {
        options: {
            livereload: true

        },
        files: [
            'tpl/**/*',
            'src/**/*',
            '!src/css/lib/global.css'
        ]

    };

    grunt.initConfig(obj);


    // 激活插件
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-rewrite');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('server', 'http调试', function (rules) {
        var taskName = [];

        if (rules && [
                'src',
                'dist',
                'src-src',
                'src-dist',
                'dist-dist',
                'dist-src'
            ].indexOf(rules) > -1) {
            config.rules = rules.replace('-', '->');
        }

        if (config.rules !== 'src' && config.rules !== 'src->src') {
            // 创建路由映射
            create_rules(); 
            taskName.push('configureRewriteRules');
        }
        taskName.push('connect:server_keepalive');
        grunt.task.run(taskName);
    });

    grunt.registerTask('task', '多任务', function (name) {
        var app;
        // 检查方法
        if (!check_app('task', name)) {
            return false;
        }
        app = App['task'][name];
        grunt.task.run(app);
    });

    grunt.registerTask('init-css', '初始化css', function (name) {
        log('请css里使用import引用，dist-css时会自动处理');
    });

    grunt.registerTask('dist-css', '编译css', function (name) {
        var app;
        var result;

        app = check_app('css', name);

        if (!app) {
            return false;
        }

        // 如果有源则压缩源
        if (app.src) { 
            grunt.config.set('cssmin.src', {
                options: {
                    banner: app.banner || banner

                },
                files: [
                    {
                        expand: true,
                        cwd: app.src_path,
                        src: app.src,
                        dest: app.dist_path,
                        filter: 'isFile'

                    }
                ]

            });
            grunt.task.run('cssmin:src');
        }

    });

    grunt.registerTask('watch-css', '调试css', function (name) {
        log('不需要监听了，因为使用import引用')

    });


    /**
     * 初始化生成
     */
    grunt.registerTask('init-js', '初始化js', function (name) {
        var app;
        var result;

        app = check_app('js', name);

        if (!app) {
            return false;
        }

        if (app.dest && app.noCmd) {
            // 如果有非cmd模块,则只生成 非cmd 模块
            result = {
                options: {
                    noncmd: true

                },
                dest: get_path_str(app.src_path + app.dest),
                src: get_path_arr(app.noCmd, app.src_path)

            };

            grunt.config.set('concat.init', result);
            grunt.task.run('concat:init');
        }


        // 如果有模板需要提出来
        if (app.src) {
            if (!Array.isArray(app.src)) {
                app.src = [
                    app.src
                ];
            }

            app.src = app.src.filter(function (val) {
                return val.indexOf('.tpl') > 0;
            });

            if (app.src.length) {
                result = {
                    files: [
                        {
                            expand: true, // 智能搜索
                            cwd: app.src_path,
                            src: app.src,
                            dest: app.src_path,
                            filter: 'isFile'

                        }
                    ]

                };


                // 处理id前缀
                if (app.idleading) {
                    result.options = {
                        idleading: app.idleading

                    };
                }

                grunt.config.set('transport.src', result);
                grunt.task.run('transport:src');
            }
        }

    });

    grunt.registerTask('dist-js', '编译js', function (name) {
        var app;
        var result;

        app = check_app('js', name);

        if (!app) {
            return false;
        }


        // 做jshint检查
        grunt.task.run('jsHint:' + name);

        // 如果有cmd模块, 先提取依赖到 dist 里
        if (app.src) {
            result = {
                files: [
                    {
                        expand: true, // 智能搜索
                        cwd: app.src_path,
                        src: app.src,
                        dest: app.dist_path,
                        filter: 'isFile'

                    }
                ]

            };


            // 处理id前缀
            if (app.idleading) {
                result.options = {
                    idleading: app.idleading

                };
            }
            else {
                // if (app.cwd) {

                //     //判断cwd是否设置的就是默认路径
                //     if (app.cwd.slice(- (type.length + 1), -1) === type) {
                //         result.options = {
                //             idleading: type + "/"
                //         }
                //     }
                // } else {
                //     result.options = {//添加uri前缀
                //         idleading: type + "/"
                //     }
                // }
            }
            grunt.config.set('transport.src', result);
            grunt.task.run('transport:src');


            // 因为有css的情况出现，抽取完依赖就会把 .css => .css.js
            if (!Array.isArray(app.src)) {
                app.src = [
                    app.src
                ];
            }
            app.src = app.src.map(function (val) {
                return val + (val.indexOf('.js') > 0 ? '' : '.js');
            });

        }


        // 如果有非cmd模块
        if (app.noCmd) {
            console.log('noCmd');
            // 复制src到dist
            result = {
                files: [
                    {
                        expand: true, // 智能搜索
                        cwd: app.src_path,
                        src: app.noCmd,
                        dest: app.dist_path,
                        filter: 'isFile'

                    }
                ]

            };
            grunt.config.set('copy.noCmd', result);
            grunt.task.run('copy:noCmd');
        }

        // 分情况进行合并
        // 如果有 dest, 则dest已经有nocmd了,所有只需要处理src
        if (app.dest) {
            // if (!grunt.file.exists(get_path_str(src_path + app.dest))) {
            //     log("依赖文件不存在, 请先初始化 : "+ get_path_str(src_path + app.dest));
            //     return false;
            // }

            // 先把src里的dest移动过来
            result = {
                options: {
                    noncmd: true

                },
                dest: get_path_str(app.dist_path + app.dest)

            };


            // 如果有nocmd的模块, 则添加, 这里的模块已经在dist层了
            if (app.noCmd) {
                result.src = get_path_arr(app.noCmd, app.dist_path);
            // result.src.push.apply(result.src, get_path_arr(app.src, dist_path));
            }

            // 如果有 源文件, 则一并合成,这里的源已经在dist层了
            if (app.src) {
                if (!result.src) {
                    result.src = [];
                }
                result.src = result.src.concat(get_path_arr(app.src, app.dist_path));
            // result.src.push.apply(result.src, get_path_arr(app.src, dist_path));
            }

            grunt.config.set('concat.dest', result);
            grunt.task.run('concat:dest');


            // 压缩最终版
            result = {
                options: {
                    banner: (app.banner || banner) + '\n'

                },
                src: get_path_str(app.dist_path + app.dest),
                dest: get_path_str(app.dist_path + app.dest)

            };
            grunt.config.set('uglify.dest', result);
            grunt.task.run('uglify:dest');
        }

        // 压缩 源
        if (app.src) {
            // 这里的源已经在dist里了
            // 开始压缩src
            result = {
                options: {
                    banner: (app.banner || banner) + '\n'

                },
                files: [
                    {
                        expand: true, // 智能搜索
                        cwd: app.dist_path,
                        src: app.src,
                        dest: app.dist_path,
                        filter: 'isFile'

                    }
                ]

            };

            grunt.config.set('uglify.src', result);
            grunt.task.run('uglify:src');
        }

        // 压缩非cmd
        if (app.noCmd) {
            result = {
                options: {
                    banner: (app.banner || banner) + '\n'

                },
                files: [
                    {
                        expand: true, // 智能搜索
                        cwd: app.dist_path,
                        src: app.noCmd,
                        dest: app.dist_path,
                        filter: 'isFile'

                    }
                ]

            };
            grunt.config.set('uglify.noCmd', result);
            grunt.task.run('uglify:noCmd');
        }
    });

    grunt.registerTask('jsHint', function (name) {
        var app;
        var result;

        app = check_app('js', name);

        if (!app) {
            return false;
        }

        // 做jshint检查
        if (app.src) {
            result = {
                src: get_path_arr(app.src, app.src_path)

            };
        }
        if (app.noCmd) {
            if (!result) {
                result = {
                    src: []

                };
            }
            result.src = result.src.concat(get_path_arr(app.noCmd, app.src_path));
        }

        if (result && result.src && result.src.length) {
            grunt.config.set('jshint.check', {
                src: result.src,
                filter: function (val) {
                    return val.lastIndexOf('.tpl.js') === -1 && val.lastIndexOf('.css') === -1 && val.lastIndexOf('.tpl') === -1;
                }

            });
            grunt.task.run('jshint:check');
        }
    });

    grunt.registerTask('watch-js', '调试js', function (name) {
        var app;
        var result;

        app = check_app('js', name);

        if (!app) {
            return false;
        }

        // 如果有依赖包和非cmd文件
        if (app.dest && app.noCmd) {
            result = {
                files: get_path_arr(app.noCmd, app.src_path)

            };
        }

        if (app.src) {
            if (!Array.isArray(app.src)) {
                app.src = [
                    app.src
                ];
            }

            app.src = app.src.filter(function (val) {
                return val.indexOf('.tpl') > 0;
            });

            if (app.src.length) {
                if (!result) {
                    result = {
                        files: []

                    };
                }

                result.files = result.files.concat(get_path_arr(app.src, app.src_path));
            }

        }

        // 如果有则说明有源文件和依赖文件, 需要监听
        var taskName;
        if (result) {
            grunt.task.run('init-js:' + name); // 这里先初始化, 以防文件没有初始化过
            result.tasks = [
                'init-js:' + name
            ];
            grunt.config.set('watch.dest', result);
            grunt.task.run('watch:dest');
        }
        else { // 如果没有依赖文件, 则只启动web server,后期可以做成监听并刷新
            log('没有配置源文件, 不需要调试');
        }
    });

    grunt.registerTask('init-copy', function () {
        log('复制文件不需要初始化');
    });

    grunt.registerTask('watch-copy', function () {
        log('复制文件不需要调试');
    });

    grunt.registerTask('dist-copy', '复制文件到dist层', function (name) {
        var app;

        app = check_app('copy', name);

        if (!app) {
            return false;
        }

        if (!app.src) {
            log('请先配置源文件地址');
            return false;
        }

        grunt.config.set('copy.dist', {
            files: [
                {
                    expand: true, // 智能搜索
                    cwd: app.src_path,
                    src: app.src,
                    dest: app.dist_path,
                    filter: 'isFile'

                }
            ]

        });
        grunt.task.run('copy:dist');
    });

    grunt.registerTask('default', [
        'server'
    ]);

    grunt.registerTask('release', '发布任务', function () {
        var version = config.version;
        var changelog;
        var changelog_data;

        if (!App.task || !App.task[version]) {
            log('没有配置任务，没法发布！');
            return false;
        }

        changelog = config.changelog;
        changelog_data = grunt.file.read('./res/changelog.md');


        // 发布的任务没有记录说明
        if (changelog_data.indexOf('## ' + version) === -1) {
            changelog_data += '\n\n## ' + version + '\n' + changelog + '\n> 发布于 ' + grunt.template.today('yyyy-mm-dd  HH:mm:ss');
            grunt.file.write('./res/changelog.md', changelog_data);
        }

        grunt.task.run('task:' + version);
    });


    /**
     * 打印日志
     * @param  {string} str 要打印的信息
     */
    function log(str) {
        grunt.log.writeln('Error => ' + str);
    }


    /**
     * 获取目标路径
     * @param  {string} type   类型， 如： css,js,img
     * @param  {string} target 目标，如：src源，dist编译，dist发布版
     * @return {string}        最终路径
     */
    function get_path(target) {
        return config[(target || 'src') + '_path'];
    }


    /**
     * 转换路径, 摘自sea.js
     * @param  {string} path 要转换的路径
     * @return {string} 转换后的路径
     * @example
     *     1, ./a/../b => ./b
     *     2, ./a/b/c/d/../../e => ./a/b/e
     */
    function get_path_str(path) {
        var DIRNAME_RE = /[^?#]*\//;
        var DOT_RE = /\/\.\//g;
        var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
        var MULTI_SLASH_RE = /([^:/])\/+\//g;
        path = path.replace(DOT_RE, '/');

        path = path.replace(MULTI_SLASH_RE, '$1/');
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, '/');
        }
        return path;
    }


    /**
     * 转换路径, 数组类型
     * @param  {array} arr  数组
     * @param  {undefined | string} path 路径前缀或者空
     * @return {array}      转换后的数组
     */
    function get_path_arr(arr, path) {
        if (!Array.isArray(arr)) {
            arr = [
                arr
            ];
        }

        return arr.map(function (key) {
            return get_path_str(key.indexOf('!') === 0 ? // 解决如果是 ("!xl.txt", "src/txt/") 的问题
                ('!' + path + key.substr(1)) : path + key);
        });
    }


    /**
     * 创建路由
     */
    function create_rules() {
        var rules;
        var rewrite = config.rules;

        if ('string' === typeof (rewrite)) {
            if (rewrite === 'dist' || rewrite === 'dist->src') { // 把线上指向源
                rules = [
                    {
                        from: '^/' + config.dist_path + '(.*)$',
                        to: '/' + config.src_path + '$1'

                    }
                ];
            }
            else {
                if (rewrite === 'src->dist') {
                    rules = [
                        {
                            from: '^/' + config.src_path + '(.*)$',
                            to: '/' + config.dist_path + '$1'

                        }
                    ];
                }
            }
        }
        else {
            if (Array.isArray(rewrite)) {
                rules = rewrite;
            }
            else {
                if ('object' === typeof (rewrite)) {
                    rules = [
                        rewrite
                    ];
                }
            }
        }

        if (rules) {
            console.log('启动重写, 端口 ' + config.port);
            grunt.config.set('connect.rules', rules);
            rules = null;
        }
    }


    /**
     * 检查配置里是否存在 自己要找的方法
     * @param  {string} type 应该名, 有home
     * @param  {string} fnName  方法如
     */
    function check_app(type, fnName) {
        var object = null;

        if (!App[type]) {
            log('没有找到项目 : ' + type);
        }
        else {
            if (!App[type][fnName]) {
                log('没有找到配置 : ' + fnName);
            }
            else {
                object = App[type][fnName];
                if (Array.isArray(object) || 'string' === typeof object) {
                    object = {
                        src: object

                    };
                }

                object = extend({}, object);

                // fix cwd情况
                if (object.cwd) {
                    object.src_path = config.src_path + object.cwd;
                    object.dist_path = config.dist_path + object.cwd;
                }
                else {
                    object.src_path = config.src_path;
                    object.dist_path = config.dist_path;
                }
            }
        }

        return object;
    }

    function extend(obj, newObj) {
        Object.keys(newObj).forEach(function (val) {
            obj[val] = newObj[val];
        });

        return obj;
    }

};
