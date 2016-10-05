var xml = {merge: null}

/**
 * Remove the XML declaration from an XML document.
 */
function removeXMLDeclaration(xml) {
    return xml.replace(/<\?xml.*?\?>/g, "");
}

/**
 * Add the database ID to an XML document.
 */
function addID(xml, id) {
    return xml.replace(/<TEI/g, '<TEI id="' + id + '"');
}

/**
 * Return a merged XML document.
 * @param {Array} data - The data to merge.
 */
xml.merge = function(data) {
    var xmlStr = "<MERGED-TEI>";
    $.each(data, function(i, v) {
        v.xml = addID(v.xml, v.id);
        v.xml = removeXMLDeclaration(v.xml);
        xmlStr = xmlStr.concat(v.xml);
    });
    xmlStr = xmlStr.concat('</MERGED-TEI>');
    return $.parseXML(xmlStr);
}

export default window.xml = xml;