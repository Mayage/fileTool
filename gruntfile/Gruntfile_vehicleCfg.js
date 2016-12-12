"use strict";
var path = require("path");
var fs = require("fs");

var isEmptyObj = function(obj) {
    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
};

var execSync = require("child_process").execSync;
var appsPath = path.normalize("../apps/");
var configedApps = [];

module.exports = function(grunt) {
    grunt.initConfig({
        copy: {},
        clean: {},
        uglify: {
            options: {
                mangle: true
            },
            "my_target": {
                files: [{
                    expand: true,
                    cwd: "../apps",
                    src: "**/*.js",
                    dest: "../apps"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("jsUglify", ["uglify"]);
    grunt.registerTask("extractProject", "move the project from build folder to outside folder!", function() {
        for (var i = configedApps.length - 1; i >= 0; i--) {
            if (fs.existsSync(configedApps[i].appPath + "/build")) {
                try {
                    var appBuildDir = configedApps[i].appPath + "/build";
                    execSync("mv " + appBuildDir + "/* " + configedApps[i].appPath, function(err) {
                        grunt.log.writeln("move files encounter error: ", err);
                    });
                    fs.rmdir(appBuildDir);
                } catch (e) {
                    grunt.log.writeln("encounter ERROR using execSync...", e.stack);
                }
            } else {
                grunt.log.writeln("no build folder successfully create for app: ", configedApps[i].name);
            }
        }
        grunt.log.writeln("finish successfully!");
        return true;
    });
    /**
     * 1. no grunt parameter(vehicleType) specified, clean the build dir;
     * 2. once recipes folder doesn't contain the vehicle type config, cause an error;
     */
    grunt.registerTask("build", "the build task is to compile and copy fyand ugli files in build directory.", function(vehicleType) {
        if (arguments.length === 0) {
            grunt.log.writeln("*** no vehicleType specified so no action to take! *** ");
            return false;
        } else {
            grunt.log.writeln("*** vehicleType is specified as: ", vehicleType, "*** ");
            var apps = fs.readdirSync(appsPath);
            var config = {};
            var i = 0;

            grunt.log.writeln("*** identify apps with recipe and read recipe! *** ");
            // identify apps with recipe and read recipe;
            for (i = apps.length - 1; i >= 0; i--) {
                var appPath = path.normalize(appsPath + "/" + apps[i]);
                var recipe = null;
                try {
                    recipe = grunt.file.readJSON(appPath + "/recipes/" + vehicleType + ".json");
                } catch (e) {
                    grunt.log.writeln(" no such vehicleType recipe found for: ", apps[i]);
                    continue;
                }
                grunt.log.writeln(" recipe found for: ", apps[i]);
                var cfgApp = {
                    recipe: recipe,
                    appPath: appPath,
                    name: apps[i]
                };
                configedApps.push(cfgApp);
            }

            if (configedApps.length <= 0) {
                grunt.log.writeln("*** no app specified with a recipe! task exit! *** ");
                return true;
            }

            grunt.log.writeln("*** rm/mk build dir for apps with recipe! *** ");
            for (i = configedApps.length - 1; i >= 0; i--) {
                var appBuildDir = configedApps[i].appPath + "/build";
                if (fs.existsSync(appBuildDir)) {
                    grunt.log.writeln(" remove old build dir for: ", configedApps[i].name);
                    try {
                        execSync("rm -rf " + appBuildDir, function(err) {
                            grunt.log.writeln(" remove dir encounter error: ", err);
                        });
                        fs.mkdirSync(appBuildDir);
                    } catch (e) {
                        grunt.log.writeln(" encounter ERROR using execSync...", e.stack);
                    }
                } else {
                    grunt.log.writeln(" create build dir for app: ", configedApps[i].name);
                    fs.mkdirSync(appBuildDir);
                }
            }

            grunt.log.writeln("*** add copy task for apps with recipe! *** ");
            for (i = configedApps.length - 1; i >= 0; i--) {
                grunt.log.writeln(" init recipe and add copy task for: ", configedApps[i].name);
                var rcp = configedApps[i].recipe;
                for (var j = rcp.length - 1; j >= 0; j--) {
                    if (!path.extname(rcp[j])) {
                        rcp[j] = path.normalize(rcp[j] + "/**");
                    }
                }
                config = {};
                config.copy = {};
                config.copy[configedApps[i].name] = {
                    files: [{
                        cwd: "../apps/" + configedApps[i].name,
                        expand: true,
                        src: configedApps[i].recipe,
                        dest: "../apps/" + configedApps[i].name + "/build"
                    }]
                };
                grunt.config.merge(config);
            }
            if (!isEmptyObj(grunt.config.get("copy"))) {
                grunt.log.writeln("*** run all copy task! *** ");
                grunt.task.run(["copy"]);
            } else {
                grunt.log.writeln("*** no copy task to run! *** ");
            }

            grunt.log.writeln("*** add clean task for apps with recipe! *** ");
            for (i = configedApps.length - 1; i >= 0; i--) {
                grunt.log.writeln(" add clean task  for: ", configedApps[i].name);
                config = {};
                config.clean = {};
                var src = [];
                src.push("../apps/" + configedApps[i].name + "/*.*");
                src.push("../apps/" + configedApps[i].name + "/.*");
                var subfolders = fs.readdirSync(configedApps[i].appPath);
                for (var l = subfolders.length - 1; l >= 0; l--) {
                    if (subfolders[l] !== "build") {
                        src.push("../apps/" + configedApps[i].name + "/" + subfolders[l]);
                    }
                }
                config.clean[configedApps[i].name] = {
                    src: src
                };
                grunt.config.merge(config);

            }
            if (!isEmptyObj(grunt.config.get("clean"))) {
                grunt.log.writeln("*** run all clean task! *** ");
                grunt.task.run(["clean"]);
            } else {
                grunt.log.writeln("*** no clean task to run! *** ");
            }

            // extract files to outside
            if (configedApps.length > 0) {
                grunt.log.writeln("*** extract target folder and files! *** ");
                grunt.task.run("extractProject");
            }
        }
    });
};
