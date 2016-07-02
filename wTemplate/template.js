/*
 * grunt-init-myWidget
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

/**
 * remains:
 *   1  copy of empty file path
 *   2  
 */
'use strict';

// Basic template description.
exports.description = 'Create an empty widget frame accord with HMI\'s libs.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ should not contain "myWidget" or "js" and ' +
  'should be a unique ID not already in use at plugins.myWidget.com. _Project ' +
  'title_ should be a human-readable title, and doesn\'t need to contain ' +
  'the word "myWidget", although it may. For example, a plugin titled "Awesome ' +
  'Plugin" might have the name "awesome-plugin".' +
  '\n\n'+
  'For more information, please contact mayage:' +
  '\n\n';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'myWidget'}, [
    // Prompt for these values.
    init.prompt('wName'),
    init.prompt('vName'),
    init.prompt('version'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url')
  ], function(err, props) {
    // A few additional properties.
    props.dependencies = {myWidget: props.myWidget_version || '>= 1'};
    
    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);
    
    // init.copy(srcpath[, destpath], options);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: '**/res'});

    // All done!
    done();
  });

};
