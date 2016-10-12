/**
 * A class for handing XSLT transformations.
 */
class Transformer {

    /**
     * Initialise.
     */
    constructor() {
        this.xsltProc = new XSLTProcessor();
        this.xsltURL = "/assets/xslt/table.xsl";
        this.version = "0.0.3";
    }

    /**
     * Load the XSLT script.
     */
    loadXSLT() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: _this.xsltURL,
                cache: false
            }).done(function(data) {
                _this.xsltProc.importStylesheet(data);
                resolve();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject('Error loading XSLT: ' + jqXHR.statusText);
            });
        });
    }

    /**
     * Promise to update a record.
     */
    updateRecord(record) {
        var xml  = $.parseXML(record.xml),
            frag = this.xsltProc.transformToDocument(xml);
        if (frag === null) {
            throw new Error("XSLT transformation failed with " + this.xsltURL);
        }
        record.transformed = frag.getElementsByTagName('tbody')[0].innerHTML;
        record.xsltURL = this.xsltURL;
        record.version = this.version;
        return record;
    }

    /**
     * Update multiple records.
     */
    *updateRecordsGenerator(records) {
        for (var r of records) {
            yield this.updateRecord(r);
        }
    }
}

export default new Transformer();