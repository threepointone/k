"use strict";

var _ = require('underscore'),
    k = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/k') : require('../lib/k'),
    __should = require('should'),
    path = require('path'),
    fs = require('fs'),
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
            _.isEqual(_(x.files).pluck('src'), _(glob.glob('**/*')).filter(function(f) {
                return fs.statSync(f).isFile();
            })).should.be.ok;

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
                abc: function() {}
            });
            x.abc();
            _.isFunction(x.abc).should.be.ok;
        });

        it('should fail on a null fn', function(){
            (function(){
                k.task('alpha');
            }).should.throwError();
        });

        it('should execute a task in its own scope', function(done){
            var x = k();
            k.task('a', function(){
                (x === this).should.be.ok;
                done();
            });

            x.a();
        });

        it('should accept an object hash', function(){

        });
    });

    describe('::clone', function() {
        it('should have equivalent config', function() {
            var x = k({
                falafel: 'shawarma'
            });
            var y = x.clone();
            _.isEqual(x.config, y.config).should.be.ok;
            (x === y).should.not.be.ok;
        });

        it('should have equivalent file list', function() {
            var x = k({
                falafel: 'shawarma'
            });
            var y = x.clone();
            _.isEqual(x.files, y.files).should.be.ok;
            (x === y).should.not.be.ok;
        });
    });

    describe('::chain', function() {
        it('should clone self, start a new chain', function(){
            var x = k();
            var y = x.chain();
            (x===y.host).should.not.be.ok;
            _.isEqual(x.files, y.host.files).should.be.ok;
            _.isEqual(x.config, y.host.config).should.be.ok;
        });
        it('should exec async tasks in order', function(done){
            var str = '';
            k.task('a', function(done){
                setTimeout(function(){
                    str+='1';
                    done();
                }, 200)
            });
            k.task('b', function(done){
                setTimeout(function(){
                    str+='2';
                    done();
                }, 100)
            });
            k.task('c', function(done){
                setTimeout(function(){
                    str+='3';
                    done();
                }, 300)
            });
            k().chain().a().b().c().then(function(){
                (str==='123').should.be.ok;
                done();
            });
        });
    });
});
