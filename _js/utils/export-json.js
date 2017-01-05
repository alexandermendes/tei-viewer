import JSZip from 'jszip';


/**
 * Export JSON transformed records.
 */
const exportJSON = function(records, xsltFilename) {
    const zip = new JSZip();
    const json = JSON.stringify(records.map(function(el) {
        return el[xsltFilename];
    }), null, 2);
    zip.file(`${xsltFilename}-data.json`, json);
    zip.generateAsync({type:'blob'}).then(function(blob) {
        saveAs(blob, 'teiviewer-json-export.zip');
    });
};

export default exportJSON;