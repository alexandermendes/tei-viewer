/**
 * Export zipped XML records.
 */
var exportXML = function exportXML(records) {
    var zip = new JSZip();
    for (var r of records) {
        zip.file(r.filename, r.xml);
    }
    zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "teiviewer-xml-export.zip");
    });
}

export default exportXML;