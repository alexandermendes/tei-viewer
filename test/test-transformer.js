import test from 'tape';
import records from "./fixtures/records"
import Transformer from '../_js/utils/transformer';

test('transformer test', function(t) {

    const transformer = new Transformer("example.xsl");

    t.equal(
        JSON.stringify(transformer.filterRecordsToUpdate(records)),
        JSON.stringify([records[1]]),
        'records not transformed using the current XSLT should be returned'
    );

    t.end();
});
