import buildTable from '../utils/build-table';

let landing;

if ($('#landing-view').length) {
    const tableElem = $('#landing-table table'),
          records   = JSON.parse($('#sample-data').text());

    buildTable(tableElem, records, 'example.xsl').then(function(table) {
        table.buttons('.buttons-xml-export').disable();
        table.buttons('.buttons-delete').disable();
        table.buttons('.buttons-delete-all').disable();
        table.buttons('.buttons-xml-editor').disable();
        $('.loading-overlay').hide();
    });
}

export default landing;