/**
 * grunt for requirejs
 * @author xieliang
 */


function Grunt(grunt) {
    'use strict'; //严格模式

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            all: {
                options: {
                    baseUrl: "src/demo1",
                    mainConfigFile: "src/requirejs/config.js",
                    include: ['../requirejs/require.js','../requirejs/config.js', 'main', 'test'],
                    out: "./dist/demo1/all.js",
                }
            }
        }
    });


    //激活插件
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask("default", ['requirejs:all']);
}

module.exports = Grunt;