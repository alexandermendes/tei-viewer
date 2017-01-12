import Transformer from '../utils/transformer';
import TableBuilder from '../utils/table-builder';
import notify from '../view/notify';
import dbServer from '../model/db-server';
import getUrlParameter from '../utils/get-url-parameter';

let tableView;

function loadFromDB() {
    const tableElem    = $('table'),
          xsltFilename = tableElem.data('xslt'),
          transformer  = new Transformer(xsltFilename),
          tableBuilder = new TableBuilder(tableElem, xsltFilename);
    let allRecords = [];

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
        return tableBuilder.buildFromDB(allRecords);
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}


if ($('#table-view').length) {
    const tableElem    = $('table'),
          xsltFilename = tableElem.data('xslt'),
          tableBuilder = new TableBuilder(tableElem, xsltFilename),
          jsonpURL     = getUrlParameter(document.location.href, 'dataset');

    if (jsonpURL) {
        tableBuilder.buildFromJSONP(jsonpURL).catch(function(err) {
            notify(err, 'error');
        });
    } else {
        loadFromDB();
    }
}


export default tableView;