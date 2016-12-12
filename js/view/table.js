import Transformer from '../utils/transformer';
import buildTable from '../utils/build-table';
import notify from '../view/notify';
import dbServer from '../model/db-server';

let tableView;


if ($('#table-view').length) {
    const tableElem    = $('table'),
          xsltFilename = tableElem.data('xslt'),
          transformer  = new Transformer(xsltFilename);
    let allRecords  = [];

    dbServer.getAll().then(function(records) {
        allRecords = records;
        return transformer.filterRecordsToUpdate(allRecords);
    }).then(function(recordsToUpdate) {
        if(recordsToUpdate.length) {
            notify(`Transforming ${recordsToUpdate.length} records,
                   please wait...`, 'info');
        }
        return transformer.transformMultiple(recordsToUpdate);
    }).then(function(transformedRecords) {
        return dbServer.updateAll(transformedRecords);
    }).then(function() {
        return buildTable(tableElem, allRecords, xsltFilename);
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}


export default tableView;