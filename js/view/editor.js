import exportXML from '../utils/export-xml';
import getUrlParameter from '../utils/get-url-parameter';
import transformer from '../utils/transformer';
import notify from '../view/notify';
import dbServer from '../model/db-server';

let editor = CodeMirror(document.getElementById('editor-view'), {
    mode:'text/xml',
    lineNumbers: true,
    autofocus: true,
    lineWrapping: true,
});

/**
 * Save the record.
 */
$("#xml-save").click(function(evt) {
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
});

/**
 * Download the record.
 */
$("#xml-export").click(function(evt) {
    exportXML([editor.record]);
});

if ($("#editor-view").length) {
    let id = null;
    try {
        id = getUrlParameter(document.location.href, 'id', 'int');
    } catch(err) {
        notify(err.message, 'error');
    }

    if (id !== null) {
        dbServer.get(id).then(function(record) {
            editor.setValue(record.xml);
            editor.record = record;
        }).catch(function (err) {
            notify(err.message, 'error');
            throw err;
        });
    }
}

export default editor;