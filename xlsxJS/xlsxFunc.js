    allSheets.forEach(function(y) { /* iterate through sheets */
        var worksheet = workbook.Sheets[y];
        var clm = [];
        var row = [];
        for (z in worksheet) {
            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === "!") {
                continue;
            }
            clm.unique(z[0]);
            row.unique(z[1]);
            // console.log(TAG + y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
        }
        console.log("------------------- init over ----------------------");
        console.log(TAG, " column length is ", clm.length);
        console.log(TAG, " row length is ", row.length);
    });

    workbook.SheetNames
    workbook.Sheets[];
    