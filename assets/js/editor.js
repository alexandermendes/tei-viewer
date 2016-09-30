var editor;
var record;

/** Attempt to load a record from id parameter given in the current URL. */
function loadRecord() {
    return new Promise(function(resolve, reject) {
        var uri   = new URI(document.location.href),
        query = URI.parseQuery(uri.query()),
        id    = query.id;

        if (isNaN(id)) {
            reject(new Error('Invalid ID parameter in URL'));
        }

        return dbServer.tei.get(id).then(function(record) {
            if (typeof record === 'undefined') {
                reject(new Error('Record not found'));
            }
            resolve(record);
        }).catch(function (err) {
            reject(err);
        });

    });
}


/** Handle XML save button event */
$("#xml-save").click(function(evt) {
    record.xml = codeEditor.getValue();
    dbServer.tei.update(result).then(function(){
        showView('loading');
        refreshView();

        // Go back to main view

        notify('Record updated!', 'success');
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    });
});


/** Handle XML download button event */
$("#xml-download").click(function(evt) {
    var recordID    = parseInt($('#record-id').html()),
        contentType = 'application/xml',
        link        = document.createElement("a"),
        xmlFile     = {};
    dbServer.tei.get(recordID).then(function(result) {
        xmlFile     = new Blob([codeEditor.getValue()], {type: contentType});
        link.download = result.filename;
        link.href = window.URL.createObjectURL(xmlFile);
        link.dataset.downloadurl = [contentType, link.download, link.href].join(':');
        link.click();
    });
});


$(document).ready(function() {
    if ($("#editor").length) {
        var promise = loadRecord();
        promise.then(function(record) {
            record = record;
            $('#editor').show();
            $('#editor').text(record.xml);
            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
                mode:'text/xml',
                lineNumbers: true,
                autofocus: true,
                lineWrapping: true,
            });
        }).catch(function(error) {
            notify(error.message, 'error');
        });
    }
});

export default editor;