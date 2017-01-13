import TableBuilder from '../utils/table-builder';
import notify from '../view/notify';

let landing;

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