/*
 * {%= author_name %}
 * {%= author_email %}
 * Copyright (c) {%= grunt.template.today('yyyy--mm--dd') %}
 */

"use strict";
var lang = require("caf/core/lang");
var BaseWidget = require(global.basedir + "/Libs/Framework/BaseWidget");
var {%= wName %}View = require("./Views/{%= wName %}View");
var TAG = "{%= wName %}Widget::";

var {%= wName %}Widget = lang.extend(BaseWidget, {
    constructor: function() {
        {%= wName %}Widget.superclass.constructor.apply(this, arguments);
        return this;
    },
    onLoad: function(name, controller, model) {
        logger.D(TAG,"onLoading ");
        this.controller = controller;

        var {%= wName %}Model = require("./Models/{%= wName %}Model");
        this.model = (model instanceof {%= wName %}Model) ? model : new {%= wName %}Model();

        var settingConfigService = global.appp.serviceManager.get("SettingConfig");
        this.cards = settingConfigService.getConfig().{%= wName %};
        this.rootView = new {%= wName %}View("{%= wName %}", controller, name, this);

    },
    onShow: function(data) {
        logger.D("{%= wName %}Widget::onShow with data : " + data);

        setTimeout(function() {
            var trackData = {
                "event": "pv"
            };
            this.setUserTrackData(trackData);
        }.bind(this), 1000);
        this.rootView.show();
    },
    onSkinChanged: function() {
        logger.D("{%= wName %}widget:: onSkinChanged");
        this.rootView.onSkinChanged();
    },
    onLanguageChanged: function() {
        logger.D("{%= wName %}widget:: onLanguageChanged");
        this.rootView.changeLanguage();
    },
    setUserTrackData: function(para) {
        para.pageid = "set_dr";
        this.controller.setRecordData(para);
    }
});

module.exports = {%= wName %}Widget;
