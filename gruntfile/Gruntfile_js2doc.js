"use strict";
module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            options: {
                force: true
            },
            docFold: ["doc/"],
            allMdFile: ["doc/**/*.md"]
        },
        jsdoc2md: {
            MyApp: {
                src: "Areas/MyApp/**/*.js",
                dest: "doc/MyApp.md"
            },
            Libs: {
                src: "Libs/**/*.js",
                dest: "doc/Libs.md"
            },
            separateOutputFiles: {
                files: [{
                    src: "test/fixture/class.js",
                    dest: "tmp/output/class.md"
                }, {
                    src: "test/fixture/typedef.js",
                    dest: "tmp/output/typedef.md"
                }]
            },
            withOptions: {
                options: {
                    "no-gfm": true
                },
                src: "test/fixture/object.js",
                dest: "tmp/output/no-gfm.md"
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadTasks("node_modules/grunt-jsdoc-to-markdown/tasks");
    grunt.registerTask("default", ["clean:docFold","jsdoc2md:MyApp"]);
};
