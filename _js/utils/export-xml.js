import JSZip from 'jszip';
import FileSaver from 'file-saver';


/**
 * Export zipped XML records.
 */
const exportXML = function(records) {
    const zip = new JSZip();
    for (let r of records) {
        zip.file(r.filename, r.xml);
    }
    zip.generateAsync({type: "blob"}).then(function(blob) {
        FileSaver.saveAs(blob, "teiviewer-xml-export.zip");
    });
    return zip;
};

export default exportXML;