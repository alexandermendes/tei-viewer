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

                dbServer.add({
                    xml: evt.target.result,
                    filename: theFile.name
                }).catch(function (error) {
                    _this._errorProcessing([theFile], error.message);
                    return;
                });
                _this._finished([theFile], 'Success');
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