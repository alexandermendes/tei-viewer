var editor;
var record;

/**
 * Load a record from the id URL parameter.
 */
function loadRecord() {
    return new Promise(function(resolve, reject) {
        var uri   = new URI(document.location.href),
            query = URI.parseQuery(uri.query()),
            id    = query.id;

        if (isNaN(id)) {
            reject(new Error('Invalid ID parameter in URL'));
        }

        dbServer.get(parseInt(id)).then(function(r) {
            record = r;
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

/**
 * Save the record.
 */
$("#xml-save").click(function(evt) {
    record.xml = editor.getValue();
    dbServer.update(record).then(function() {
        notify('Record saved!', 'success');
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    });
    evt.preventDefault();
});

/**
 * Download the record.
 */
$("#xml-download").click(function(evt) {
    var type = 'application/xml',
        link = document.createElement("a"),
        file = new Blob([editor.getValue()], {type: type});
    link.download = record.filename;
    link.href = window.URL.createObjectURL(file);
    link.dataset.downloadurl = [type, link.download, link.href].join(':');
    link.click();
    evt.preventDefault();
});

$(document).ready(function() {
    if ($("#editor").length) {
        loadRecord().then(function() {
            $('#editor').text(record.xml);
            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
                mode:'text/xml',
                lineNumbers: true,
                autofocus: true,
                lineWrapping: true,
            });
        }).catch(function(error) {
            notify(error.message, 'error');
            throw error;
        });
    }
});

export default editor;