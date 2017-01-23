import 'jsdom-global/register';
import test from 'tape';
import records from "./fixtures/records"
import Transformer from '../_js/utils/transformer';


test('transformer test', function(t) {

    const transformer = new Transformer("example.xsl"),
          text        = "Some text";
    let fragment = document.createDocumentFragment(),
        textNode = document.createTextNode(txt);
    fragment.appendChild(txtNode);

    t.equal(
        transformer.filterRecordsToUpdate(records).length,
        1,
        'records not transformed using the current XSLT should be returned'
    );

    t.equal(
        transformer.fragmentToText(fragment),
        text,
        'text should be extracted from the document fragment'
    );

    'record should be updated'

    t.end();
});
