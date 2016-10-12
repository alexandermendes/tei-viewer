window.download = {'xml': null};

/** Download XML records, zipping if there more than one. */
download.xml = function(records) {
    var zip = new JSZip();
    for (var r of records) {
        zip.file(r.filename, r.xml);
    }
    zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "teiviewer-xml-export.zip");
    });
}

export default window.download;