import JSZip from 'jszip';


/**
 * Export JSON transformed records.
 */
const exportJSON = function(dataSet, wrapJSON) {
    const zip = new JSZip();
    let json = JSON.stringify(dataSet, null, 2);

    if (wrapJSON) {
        json = `callback(${json})`;
    }

    zip.file('data.json', json);
    zip.generateAsync({type:'blob'}).then(function(blob) {
        saveAs(blob, 'teiviewer-json-export.zip');
    });
    return zip;
};

export default exportJSON;