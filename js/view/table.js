import transformer from '../utils/transformer';
import buildTable from '../utils/build-table';
import notify from '../view/notify';
import dbServer from '../model/db-server';

var table;

/**
 *
 */
function filterRecordsToUpdate(records) {
    return records.filter(function(el) {
        return transformer.version !== el.version;
    });
}

/**
 * Update records to use latest transformation.
 */
function updateRecords(records) {
    let promises = [];
    return new Promise(function(resolve, reject) {
        transformer.transformMultiple(records).then(function(updatedRecords) {
            for (let r of updatedRecords) {
                promises.push(dbServer.update(r));
            }
            return Promise.all(promises);
        }).then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

if ($('#table-view').length) {
    let records = [];
    dbServer.getAll().then(function(recs) {
        records = recs;
        return filterRecordsToUpdate(records);
    }).then(function(recordsToUpdate) {
        return updateRecords(recordsToUpdate);
    }).then(function() {
        return buildTable($('table'), records);
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}

export default table;