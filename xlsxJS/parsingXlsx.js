"use strict";
var XLSX = require("xlsx");
var TAG = "XLSX";
var fs = require("fs");

/**
 * used to analysys xlsx file to generate json file;
 * something objects is difficult to express in xlsx file;
 * this work maynot be that's powerful;
 */
var WBToJSON = function() {
    var workbook = null;
    var sheetRange = null;
    var sheetObj = null;

    // likely promise method;
    workbook = readWorkBook();
    sheetRange = getSheetRange(workbook.SheetNames[0], workbook);
    sheetObj = parseSheets(workbook.Sheets.test, sheetRange);
    writeToJSON(sheetObj, workbook.SheetNames[0]);
    return this;
};

var readWorkBook = function() {
    var wb = XLSX.readFile("./xlsxFile/test.xlsx");
    return wb;
};

var getSheetRange = function(sheetName, wb) {
    var z = null;
    var clm = [];
    var row = [];
    var ref = wb.Sheets[sheetName]["!ref"];
    var range = XLSX.utils.decode_range(ref);

    for (var R = range.s.r; R <= range.e.r; ++R) {
        row.push(XLSX.utils.encode_row(parseInt(R)));
    }
    for (var C = range.s.c; C <= range.e.c; ++C) {
        clm.push(XLSX.utils.encode_col(parseInt(C)));
    }

    console.log("------------- init sheet %s over ---------------", sheetName);
    console.log("%s %s column length is ", TAG, sheetName, clm.length);
    console.log("%s %s row length is ", TAG, sheetName, row.length);

    var range = {
        c: clm,
        r: row
    };
    return range;
};

var getCellByID = function(c, r, sheet) {
    var cellAdd = c + r;
    console.log(TAG, " this.sheets[y][c]", sheet[cellAdd].v);
    console.log(TAG, " this.sheets[y][c]", sheet["!ref"]);
    return sheet[cellAdd].v;
};

var parseSheets = function(sheet, sheetRange) {
    var obj = {};
    var itemProperty = [];
    var i = 0;
    var j = 0;
    var cellAdd = "";
    var itemName = "";
    for (j = 0; j < sheetRange.c.length; j++) {
        cellAdd = sheetRange.c[j] + "2";
        if (sheet[cellAdd].v) {
            itemProperty.push(sheet[cellAdd].v);
        }
    }
    console.log(TAG, "----------init itemProperty name over in sheet -----------", itemProperty.length);

    for (i = 2; i < sheetRange.r.length; i++) {
        for (j = 0; j < sheetRange.c.length; j++) {
            cellAdd = sheetRange.c[j] + sheetRange.r[i];
            console.log(TAG, "---------------------", cellAdd);

            if (sheet[sheetRange.c[j] + "2"].v === "itemName") {
                itemName = sheet[cellAdd].v;
                obj[itemName] = {};
                console.log(TAG, " init itemName -----------", itemName);

            } else if (sheet[cellAdd] && sheet[cellAdd].v) {
                if (itemProperty[j] === "parentItem" || itemProperty[j] === "bottom" || itemProperty[j] === "right") {
                    obj[itemName][itemProperty[j]] = "(" + sheet[cellAdd].v + ")";
                } else if (itemProperty[j] === "text") {
                    obj[itemName][itemProperty[j]] = "T(" + sheet[cellAdd].v + ")";
                } else if (itemProperty[j] === "cEvent") {
                    var cEn = [];
                    var str = sheet[cellAdd].v;
                    var matchRes = str.match(/(\{.+?\})/g);
                    console.log("~~~~~~~~~~~~~~~~~ matchRes ", matchRes);

                    cEn.push(sheet[cellAdd].v);
                    obj[itemName][itemProperty[j]] = cEn;
                } else if (itemProperty[j].match(/^(unComP)/) !== null) {
                    obj[itemName][sheet[cellAdd].v] = sheet[sheetRange.c[j + 1] + sheetRange.r[i]].v;
                    // jump to next pair of Property & value;
                    j++;
                } else {
                    obj[itemName][itemProperty[j]] = sheet[cellAdd].v;
                }
            }
        }
    }
    console.log(TAG, "----------init items over in sheet -----------");

    return obj;
};

var writeToJSON = function(object, fileName) {
    var filePath = "./jsonFile/" + fileName + ".json";
    console.log("%s writing to file %s.json ", TAG, fileName);
    fs.writeFile(filePath, JSON.stringify(object), "utf8", function(err) {
        if (err) {
            console.log(TAG, "ERROR writing file ");
            throw err;
        } else {
            console.log("%s writing file %s successfully", TAG, filePath);
        }
    });

};

module.exports = new WBToJSON();

// {s:{c:0, r:2}, e:{c:1, r:6}}
// for (var R = range.s.r; R <= range.e.r; ++R) {
//     for (var C = range.s.c; C <= range.e.c; ++C) {
//         var cell_address = {c: C, r: R};
//     }
// }


// utils
// {
//  encode_col: [Function: encode_col],
//  encode_row: [Function: encode_row],
//  encode_cell: [Function: encode_cell],
//  encode_range: [Function: encode_range],
//  decode_col: [Function: decode_col],
//  decode_row: [Function: decode_row],
//  split_cell: [Function: split_cell],
//  decode_cell: [Function: decode_cell],
//  decode_range: [Function: decode_range],
//  format_cell: [Function: format_cell],
//  get_formulae: [Function: sheet_to_formulae],
//  make_csv: [Function: sheet_to_csv],
//  make_json: [Function: sheet_to_json],
//  make_formulae: [Function: sheet_to_formulae],
//  sheet_to_csv: [Function: sheet_to_csv],
//  sheet_to_json: [Function: sheet_to_json],
//  sheet_to_formulae: [Function: sheet_to_formulae],
//  sheet_to_row_object_array: [Function: sheet_to_row_object_array]
// }
