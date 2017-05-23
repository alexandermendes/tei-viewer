import Dropzone from 'dropzone';
import dbServer from '../model/db-server';


/**
 * Subclass of Dropzone that uploads records to a database.
 */
class TEIDropzone extends Dropzone {

    /**
     * Initialise.
     */
    constructor(elementId, opts) {
        super(elementId, opts);
        Dropzone.autoDiscover = false;
    }

    /**
     * Save a file to the database.
     */
    _save(f) {
        return (evt) => {

            try {
                $.parseXML(evt.target.result);
            } catch(error) {
                this._errorProcessing([f], "Invalid XML");
                return;
            }

            dbServer.add({
                xml: evt.target.result,
                filename: f.name
            }).then(() => {
                this._finished([f], 'Success');
            }).catch((error) => {
                this._errorProcessing([f], error.message);
            });
        };
    }

    /**
     * Upload an array of files.
     */
    uploadFiles(files) {
        let reader = {};
        for (let f of files) {
            reader = new FileReader();
            reader.onload = this._save(f);
            reader.readAsText(f);
            this.emit("updateprogress");
        }
    }

}

export default TEIDropzone;