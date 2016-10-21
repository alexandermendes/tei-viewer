/**
 * A class for handing XSLT transformations.
 */
class Transformer {

    /**
     * Initialise.
     */
    constructor() {
        this.version = "0.0.16";
        this.xsltProc = new XSLTProcessor();
        this.xsltURL = "/assets/xslt/table.xsl";
        this.xsltLoaded = false;
    }

    /**
     * Load the XSLT script.
     */
    loadXSLT() {
        return new Promise((resolve, reject) => {
            if (this.xsltLoaded) {
                resolve();
            }
            $.ajax({
                url: this.xsltURL,
            }).done((data) => {
                this.xsltProc.importStylesheet(data);
                this.xsltLoaded = true;
                resolve();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject('Error loading XSLT: ' + jqXHR.statusText);
            });
        });
    }

    /**
     * Update a record.
     */
    updateRecord(record) {
        let x2js = new X2JS(),
            xml  = $.parseXML(record.xml),
            doc  = this.xsltProc.transformToDocument(xml),
            json = x2js.xml2js(doc.querySelector('record').outerHTML);

        record.transformed = json.record;
        record.version = this.version;
        return record;
    }

    /**
     * Return the updated record.
     */
    transform(record) {
        return new Promise((resolve, reject) => {
            this.loadXSLT().then(() => {
                resolve(this.updateRecord(record))
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Yield multiple updated records.
     */
    transformMultiple(records) {
        let promises = [];
        return new Promise((resolve, reject) => {
            this.loadXSLT().then(() => {
                for (var r of records) {
                    promises.push(this.transform(r));
                }
                resolve(Promise.all(promises));
            }).catch(function(err) {
                reject(err);
            });
        });
    }
}

export default new Transformer();