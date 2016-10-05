var editor;
var record;

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
        var id = parseURL.getIntParameter('id', true);
        dbServer.get(id).then(function(r) {
            record = r;
            $('#editor').text(record.xml);
            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
                mode:'text/xml',
                lineNumbers: true,
                autofocus: true,
                lineWrapping: true,
            });
        }).catch(function (err) {
            notify(err.message, 'error');
            throw err;
        });
    }
});

export default editor;