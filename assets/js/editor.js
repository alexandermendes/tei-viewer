var editor;

/**
 * Save the record.
 */
$("#xml-save").click(function(evt) {
    var transformer = new Transformer();
    editor.record.xml = editor.getValue();

    transformer.loadXSLT().then(function() {
        return transformer.updateRecord(editor.record);
    }).then(function() {
        return dbServer.update(editor.record);
    }).then(function() {
        notify('Record saved!', 'success');
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    });

    $(this).blur();
    evt.preventDefault();
});

/**
 * Download the record.
 */
$("#xml-export").click(function(evt) {
    download.xml([editor.record]);
    $(this).blur();
    evt.preventDefault();
});

$(document).ready(function() {
    if ($("#editor-view").length) {
        var id = null;

        try {
            id = parseURL.getIntParameter('id', true);
        } catch(err) {
            $('#editor').hide();
            loading.hide();
            notify(err.message, 'error', 1000)
            throw err;
        }

        dbServer.get(id).then(function(record) {
            $('#editor').text(record.xml);
            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
                mode:'text/xml',
                lineNumbers: true,
                autofocus: true,
                lineWrapping: true,
            });
            editor.record = record;
            loading.hide();
        }).catch(function (err) {
            $('#editor').hide();
            loading.hide();
            notify(err.message, 'error', 1000)
            throw err;
        });
    }
});

export default editor;