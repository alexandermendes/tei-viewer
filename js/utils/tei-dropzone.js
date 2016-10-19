import dbServer from '../model/db-server';
import transformer from '../utils/transformer';

/**
 * Subclass of Dropzone that transforms XML records and persists to IndexedDB.
 */
class TEIDropzone extends Dropzone {

    constructor(elementId, opts) {
        super(elementId, opts);
        Dropzone.autoDiscover = false;
    }

    uploadFiles(files) {
        var _this = this;
        var reader = {};

        function saveFile(theFile) {
            return function(evt) {

                try {
                    $.parseXML(evt.target.result);
                } catch(error) {
                    _this._errorProcessing([theFile], "Invalid XML");
                    return;
                }

                transformer.transform({
                    xml: evt.target.result,
                    filename: theFile.name
                }).then(function(record) {
                    return dbServer.add(record);
                }).then(function() {
                    _this._finished([theFile], 'Success');
                }).catch(function(error) {
                    _this._errorProcessing([theFile], error.message);
                });
            };
        }

        for (var i = 0; i < files.length; i++) {
            reader = new FileReader();
            reader.onload = saveFile(files[i]);
            reader.readAsText(files[i]);
            _this.emit("updateprogress");
        }
    }

}

export default TEIDropzone;