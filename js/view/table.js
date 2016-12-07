import Transformer from '../utils/transformer';
import buildTable from '../utils/build-table';
import notify from '../view/notify';
import dbServer from '../model/db-server';

var tableView;


/**
 * Return the dataset.
 */
function getDataset(xslt, records) {
    return records.map(function(el) {
        return el[xslt];
    })
}


/**
 * Return the records transformed before the latest release.
 */
function filterRecordsToUpdate(xslt, records) {
    return records.filter(function(el) {
        return !(xslt in el);
    });
}


/**
 * Ensure all records were transformed using the XSLT for the current table.
 */
function updateRecords(xslt, records) {
    return new Promise(function(resolve, reject) {
        const recordsToUpdate = filterRecordsToUpdate(xslt, records),
              transformer     = new Transformer(xslt),
              updatePromises  = [];

        if(recordsToUpdate.length) {
            notify(`Transforming ${recordsToUpdate.length} records,
                   please wait...`, 'info');
        }

        transformer.transformMultiple(recordsToUpdate).then(function(updatedRecords) {
            for (let r of updatedRecords) {
                updatePromises.push(dbServer.update(r));
            }
            return Promise.all(updatePromises);
        }).then(function() {
            resolve(records);
        }).catch(function(err) {
            reject(err);
        });
    });
}


if ($('#table-view').length) {
    const tableElem = $('table'),
          xslt      = tableElem.data('xslt');
    dbServer.getAll().then(function(records) {
        return updateRecords(xslt, records);
    }).then(function(records) {
        return buildTable(tableElem, getDataset(xslt, records));
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}


export default tableView;