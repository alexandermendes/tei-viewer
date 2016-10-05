var tableView;

/**
 * Load uploaded XML data into the table.
 */
function loadTable() {
    var page  = parseURL.getIntParameter('page') - 1 || 0,
        limit = parseURL.getIntParameter('limit') || 50;
    dbServer.getMultiple(page, limit).then(function(records) {
        console.log(xml.merge(records));
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    }).then(function() {
        loading.hide();
    });
}

/** Handle add files event. */
$('#upload-form input[type="file"]').change(function(evt) {
    var files = evt.target.files;
    uploadFiles(files);
});

/** Handle a show XML event. */
$("#tei-table").on('click', ".show-xml", function(evt) {
    var recordID = parseInt($(this).parents('tr')[0].id);
    window.location.href = '/editor?id=' + recordID;
});

/** Handle change page event. */
$("#tei-table").on('click', ".change-page", function(evt) {
    var page  = parseInt($(this).data('page')),
        limit = parseInt($(this).data('limit'));
    window.location.href = '/?page=' + page + '&limit=' + limit;
});

$(document).ready(function() {
    if($('#tei-table').length) {
        loadTable();
    }
});

export default tableView;