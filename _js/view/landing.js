import TableBuilder from '../utils/table-builder';
import notify from '../view/notify';
import dbServer from '../model/db-server';

let landing;

/**
 * Handle Get Started button click.
 */
$('#get-started').on('click', function() {
    const baseurl = $('#base-url').data('baseurl');
    dbServer.count().then(function(n) {
        if (n > 0) {
            window.location.href = `${baseurl}/tables`;
        } else {
            window.location.href = `${baseurl}/upload`;
        }
    });
});

if ($('#landing-view').length) {
    const tableElem    = $('#landing-table table'),
          tableBuilder = new TableBuilder(tableElem),
          sampleUrl    = $('#sample-data').data('url');

    tableBuilder.buildFromJSONP(sampleUrl).then(function(table) {
        $('#landing-table .loading-overlay').hide();
    }).catch(function(err) {
        notify(err, 'error');
    });
}

export default landing;