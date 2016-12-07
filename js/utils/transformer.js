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
                url: `/assets/xslt/${this.xsltFilename}`,
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
        const xml      = $.parseXML(record.xml),
              fragment = this.xsltProc.transformToFragment(xml, document);

        let div = document.createElement('div');
        div.appendChild(fragment.cloneNode(true));
        let json = $.parseJSON(div.innerHTML);

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

export default Transformer;