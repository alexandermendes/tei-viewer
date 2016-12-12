import CodeMirror from 'codemirror';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/hint/xml-hint.js';

import dbServer from '../model/db-server';
import Transformer from '../utils/transformer';


/**
 * XML editor modal class.
 */
class Editor {

    /**
     * Initialise.
     */
    constructor(container, record, xsltFilename) {
        this.record = record;
        this.transformer = new Transformer(xsltFilename);
        this.editor = CodeMirror(container, {
            value: this.record.xml,
            mode:'text/xml',
            lineNumbers: true,
            autofocus: true,
            lineWrapping: true,
        });
    }

    /**
     * Save the record.
     */
    save() {
        this.record.xml = this.editor.getValue();
        this.transformer.transform(this.record).then(function(r) {
            return dbServer.update(r);
        });
    }

    /**
     * Refresh the editor.
     */
    refresh() {
        this.editor.refresh();
    }
}

export default Editor;