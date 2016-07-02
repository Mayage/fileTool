/*
 * author:: {%= author_name %} {%= author_email %}
 * Copyright (c) {%= grunt.template.today('yyyy--mm--dd') %}
 */
"use strict";

var lang = require("caf/core/lang");
var CardContainer = require(global.basedir + "/Areas/SettingsApp/Widgets/CC/CardContainer");
var TAG = "{%= wName %}Widget::{%= wName %}View::";

var {%= wName %}View = lang.extend(CardContainer, {
    constructor: function() {
        {%= wName %}View.superclass.constructor.apply(this, arguments);
        return this;
    },
    initialize: function() {
    	logger.D(TAG,"initialize");
        {%= wName %}View.superclass.initialize.apply(this, arguments);
    }
});

module.exports = {%= wName %}View;
