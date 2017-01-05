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


function loadFromJSONP(url) {
    const tableElem    = $('table'),
          xsltFilename = tableElem.data('xslt'),
          tableBuilder = new TableBuilder(tableElem, xsltFilename);

    new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            jsonp: 'callback',
            jsonpCallback: 'callback',
            dataType: 'jsonp',
        }).done(function(dataSet) {
            return tableBuilder.build(dataSet);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            reject(`Error loading dataset: ${textStatus}`);
        });
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}


if ($('#table-view').length) {
    const datasetURL = getUrlParameter(document.location.href, 'dataset');
    if (datasetURL) {
        loadFromJSONP(datasetURL);
    } else {
        loadFromDB();
    }
}


export default tableView;