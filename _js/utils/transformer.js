/**
 * A class for handing XSLT transformations.
 */
class Transformer {

    /**
     * Initialise.
     */
    constructor(xsltFilename) {
        this.xsltFilename = xsltFilename;
        this.xsltProc = new XSLTProcessor();
    }

    /**
     * Load the XSLT stylesheet.
     */
    loadXSLT() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/assets/xslt/${this.xsltFilename}`,
            }).done((data) => {
                console.log('XSLT loaded');
                this.xsltProc.importStylesheet(data);
                resolve();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject('Error loading XSLT: ' + jqXHR.statusText);
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
     * Update a record.
     */
    updateRecord(record) {
        const xml = $.parseXML(record.xml),
              doc = this.xsltProc.transformToFragment(xml, document);

        const div = document.createElement('div');
        div.appendChild(doc.cloneNode(true));
        const json = $.parseJSON(div.innerHTML);

        json.DT_RowId = record.id;  // Used to set DataTables row ID
        record[this.xsltFilename] = json;
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
                for (let r of records) {
                    promises.push(this.updateRecord(r));
                }
                resolve(Promise.all(promises));
            }).catch(function(err) {
                reject(err);
            });
        });
    }
}

export default Transformer;