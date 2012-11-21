"use strict";

var assert = require('assert'),
    _ = require('underscore'),
    k = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/k') : require('../lib/k'),
    __should = require('should'),
    glob = require('glob-whatev');

describe('k', function() {
    describe('initialize', function() {
        it('should accept zero arguments', function() {
            var x = k();
            x.config.src.should.equal('./');
            x.config.dest.should.equal('./dist');
        });

        it('should accept a config object', function() {
            var x = k({
                src: 'src',
                dest: 'dest'
            });
            x.config.src.should.equal('src');
            x.config.dest.should.equal('dest');
        });

        it('should resolve all file names in the beginning', function() {
            var x = k();
            _.isEqual(_(x.files).pluck('src'), glob.glob('**/*.*')).should.be.ok;

        });
    });

    describe('.task', function() {
        it('should add tasks for all further instances created', function() {
            k.task({
                xyz: function() {}
            });
            var x = k();
            _.isFunction(x.xyz).should.be.ok;
        });

        it('should apply to instances created way before', function() {

            var x = k();

            k.task({
                xyz: function() {}
            });

            _.isFunction(x.xyz).should.be.ok;

        });
    });

    describe('::task', function() {
        it('should accept a task and attach itself', function() {
            var x = k();
            x.task('f', _.identity);
            _.isFunction(x.f).should.be.ok;

        });

        it('should execute the task in its own scope', function(done) {
            var x = k();
            x.task('f', function(cb) {
                this.should.equal(x);
                cb();
            }).f(done);

        });

        it('should fail on null fn', function() {
            var x = k();
            (function() {
                x.task('f');
            }).should.throwError();

        });

        it('should accept a key value hash', function(done) {
            var x = k();
            x.task({
                a: function(cb) {
                    x.b(function() {
                        done();
                    });
                },
                b: function(cb) {
                    cb();
                }
            });
            x.a();
        });

    });

    describe('::clone', function() {
        it('should have equivalent config', function() {
            var x = k();
            var y = x.clone();
            _.isEqual(x.config, y.config).should.be.ok;


        });

        it('should have equivalent file list', function() {
            var x = k();
            var y = x.clone();
            _.isEqual(x.files, y.files).should.be.ok;

        });
    });
});