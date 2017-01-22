import xml2js from 'xml2js';

/**
 * A class for handing XSLT transformations.
 */
class Transformer {

    /**
     * Initialise.
     */
    constructor(xsltFilename) {
        this.xsltFilename = xsltFilename;
    }

    /**
     * Load the XSLT stylesheet.
     */
    loadXSLT() {
        const baseurl  = $('#base-url').data('baseurl'),
              xsltProc = new XSLTProcessor();

        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${baseurl}/assets/xslt/${this.xsltFilename}`,
            }).done((data) => {
                try {
                    xsltProc.importStylesheet(data);
                } catch(err) {
                    // Error not always specified so throw a new one
                    reject(new Error(`Couldn't loading ${this.xsltFilename}`));
                }
                resolve(xsltProc);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject(`Error loading XSLT: ${errorThrown}`);
            });
        });
    }

    /**
     * Return the records that need to be transformed.
     */
    filterRecordsToUpdate(records) {
        return records.filter((el) => {
            return !(this.xsltFilename in el);
        });
    }

    /**
     * Extract the text from a document fragment.
     */
    fragmentToText(fragment) {
        const div   = document.createElement('div'),
              clone = fragment.cloneNode(true);
        div.appendChild(clone);
        return div.innerHTML;
    }

    /**
     * Update a record.
     */
    updateRecord(record, xsltProcessor) {
        const xml = $.parseXML(record.xml),
              doc = xsltProcessor.transformToFragment(xml, document),
              txt = this.fragmentToText(doc);

        xml2js.parseString(txt, (err, result) => {
            result.TEI.DT_RowId = record.id; // Set DataTables row ID
            record[this.xsltFilename] = result;
        });
        return record;
    }

    /**
     * Return the updated record.
     */
    transform(record) {
        return new Promise((resolve, reject) => {
            this.loadXSLT().then((xsltProcessor) => {
                resolve(this.updateRecord(record, xsltProcessor));
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Return multiple updated records.
     */
    transformMultiple(records) {
        let promises = [];
        return new Promise((resolve, reject) => {
            this.loadXSLT().then((xsltProcessor) => {
                for (let r of records) {
                    promises.push(this.updateRecord(r, xsltProcessor));
                }
                resolve(Promise.all(promises));
            }).catch(function(err) {
                reject(err);
            });
        });
    }
}

export default Transformer;