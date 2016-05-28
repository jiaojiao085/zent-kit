#!/usr/bin/env node
var ch = require('child_process');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

var logger = console.log.bind(console);
var projectPath = process.cwd();
var exec = ch.exec;

module.exports = function(name) {

    // 项目规范文件拷贝
    gulp.task('reset:file', function(callback) {
        gutil.log(gutil.colors.yellow('----> 正在重新初始化', name));

        exec('git archive --remote=git@gitlab.qima-inc.com:zent/zent-seed.git HEAD ' + name + ' | tar -x', function(err, stdout, stderr) {
            if (!stderr) {
                gutil.log(gutil.colors.green('----> 重新初始化完成'));
            } else {
                gutil.log('\n', gutil.colors.red(stderr));
            }
            callback();
        });
    });

    if (!name) {
        logger('   sir: 重新初始化某个文件，是需要文件名的');
        return;
    }
    runSequence('reset:file');
}