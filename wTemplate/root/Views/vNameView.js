"use strict";

var lang = require("caf/core/lang");
var BaseWidgetView = require(global.basedir + "/Libs/Framework/BaseWidgetView");
var TAG = "{%= wName %}Widget::{%= vName %}View::";

var {%= vName %}View = lang.extend(BaseWidgetView, {
    constructor: function(name, controller, widgetName, widget) {
        this.widget = widget;
        {%= vName %}View.superclass.constructor.apply(this, arguments);
        return this;
    },
    initialize: function() {

    },
    on{%= vName %}SwthClick: function(data, index) {
        logger.D("Driving::on{%= vName %}SwthClick checked to: ", index);
        // this.widget.model.{%= vName %}.setOrigin("EcoDrving", index.toString());
        var typeRange = ["default", "soc_hold", "soc_charge"];
        var trackData = {
            "module": "",
            "type": typeRange[index]
        };
        this.widget.setUserTrackData(trackData);
    }
});

module.exports = {%= vName %}View;
