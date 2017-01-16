import TableBuilder from '../utils/table-builder';
import notify from '../view/notify';
import getUrlParameter from '../utils/get-url-parameter';

let tableView;


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
        tableBuilder.buildFromDB().catch(function(err) {
            notify(err, 'error');
        });
    }
}


export default tableView;