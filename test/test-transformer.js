import 'jsdom-global/register';
import sinon from 'sinon';
import test from 'tape';
import records from "./fixtures/records"
import Transformer from '../_js/utils/transformer';


test('transformer test', function(t) {

    const transformer = new Transformer("example.xsl"),
          xmlText     = "<TEI></TEI>";
    let fragment = document.createDocumentFragment(),
        textNode = document.createTextNode(xmlText),
        xsltProc = {transformToFragment: function(x, y) {return fragment;}};
    fragment.appendChild(textNode);

    t.equal(
        transformer.filterRecordsToUpdate(records).length,
        1,
        'records not transformed using the current XSLT should be returned'
    );

    t.equal(
        transformer._fragmentToText(fragment),
        xmlText,
        'text should be extracted from the document fragment'
    );

    t.equal(
        transformer._updateRecord(records[1], xsltProc)["example.xsl"],
        "",
        'the record should be updated for the current XSLT'
    );

    t.end();
});
