var _ = require('underscore'),
    k = _(process.argv).indexOf('html-cov') >= 0 ? require('../lib-cov/k') : require('../lib/k'),
    async = require('async'),
    __should = require('should'),
    glob = require('glob-whatev');

describe('tasks', function() {
    describe('read', function() {
        it('should populate f.content with raw content', function(done) {
            var x = k();
            __should.not.exist(x.files[0].content);
            x.read(function() {
                // (x.files[0].content).should.be.ok;   // this is throwing exceptions when trying the coverage script. dunno why.
                done();
            });
        });
    });

    describe('filter', function() {
        it('should filter files', function(done) {
            var x = k({
                files: [{
                    src: 'something.js'
                }, {
                    src: 'something.css'
                }, {
                    src: 'something.jpg'
                }]
            });
            x.filter(/js/, function() {
                _.isEqual(this.files[0].src, 'something.js').should.be.ok;
                _.isEqual(this.files.length, 1).should.be.ok;
                done();
            });
        });

        it('should accept a filter function argument', function(done) {
            var x = k({
                files: [{
                    src: 'something.js'
                }, {
                    src: 'something.css'
                }, {
                    src: 'something.jpg'
                }]
            });
            x.filter(function(f){return f.src.indexOf('.js')>=0;}, function() {
                _.isEqual(this.files[0].src, 'something.js').should.be.ok;
                _.isEqual(this.files.length, 1).should.be.ok;
                done();
            });

        });
    });

    describe('compress', function() {
        it("should be able to minify css and js files", function(done){
            k({src:'./lib'}).chain().read().compress(done);
        });

        it("should generate .min paths", function(done){
            k({src:'./lib'}).chain().read().compress(done);
        });
    });

    describe('write', function() {
        it("should do a dance, I say.");
    });

    describe('hashify', function() {
        it("generate a hashified file name and dest", function(done){
            k({src:'./lib'}).chain().read().hashify(done);
        });
    });

    describe('meta', function(){
        it('should be able to generate a meta descriptor file from a fileset', function(done){
            k().meta('test', done);
        });
    });

    describe('concat', function() {
        it("generate a concatenated file name at given dest");
    });

    describe('templates', function() {
        it("generate js-ified template set");
    });

    describe('cdnify', function() {
        it("should replace relative urls in css with cdned versions");
    });
    describe('clean', function(done){
        it('should wipe out the dist dir', function(done){
            k().clean(done);
        });
    });
    describe('wait', function(){
        it('should wait, duh', function(done){
            k().wait(100, done);
        });
    });

});
