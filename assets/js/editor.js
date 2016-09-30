var editor;
var record;

/**
 * Load a record from id parameter given in the current URL.
 */
function loadRecord() {
    return new Promise(function(resolve, reject) {
        var uri   = new URI(document.location.href),
        query = URI.parseQuery(uri.query()),
        id    = query.id;

        if (isNaN(id)) {
            reject(new Error('Invalid ID parameter in URL'));
        }

        dbServer.get(parseInt(id)).then(function(record) {
            if (typeof record === 'undefined') {
                reject(new Error('Record not found'));
            }
            resolve(record);
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
    dbServer.update(record).then(function(){
        notify('Record saved!', 'success');
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    });
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
});


$(document).ready(function() {
    if ($("#editor").length) {
        var promise = loadRecord();
        promise.then(function(r) {
            record = r;
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