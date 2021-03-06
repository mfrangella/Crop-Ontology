importPackage(org.apache.poi.ss.usermodel);

var excel = {

    read: function(firstRow, blobKey, callback) {
        // Create a workbook using the File System
        var myWorkBook = new WorkbookFactory.create(new BlobstoreInputStream(blobKey));
        // Get the first sheet from workbook
        var mySheet = myWorkBook.getSheetAt(1);

        // We now need something to iterate through the cells.
        var rowIter = mySheet.rowIterator(); 

        var idx = 0,
            rows = 0,
            cellContent,
            cols = 0;
        while(rowIter.hasNext()){ // for each row
            var myRow = rowIter.next();

            // skip until we reach firstRow (it's not an index)
            rows++;
            if(rows < firstRow) continue;

            if(idx == 0) // first row must tell us how many cols we have
                cols = myRow.getPhysicalNumberOfCells();

            var arr = [],
                empty = true;
            for (var i = 0; i < cols; i++) { // for each cell
                var cell = myRow.getCell(i);
                if(cell) {
                    cellContent = ""+cell.toString().trim();
                    if(cellContent)
                        empty = false;
                } else {
                    cellContent = "";
                }
                arr.push(cellContent);
            }
            if(!empty)
                callback(arr, idx++);
        }
    },
    // firstRow is the number where the first row is...
    // remember that all blank rows are skipped
    parseTemplate: function(firstRow, blobKey, callback) {
        var idValMap = {};
        excel.read(firstRow, blobKey, function(row, idx) {
            var term = {};
            if(idx == 0) { // first row, build map
                row.forEach(function(item, i) {
                    idValMap[i] = item;
                });
                return;
            } else {
                row.forEach(function(item, i) {
                    term[idValMap[i]] = item;
                });
            }
            callback(term);
        });

    }
};
exports = excel;
