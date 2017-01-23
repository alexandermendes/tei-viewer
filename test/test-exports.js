import test from 'tape';
import records from "./fixtures/records"
import dataset from "./fixtures/dataset"
import exportXML from '../_js/utils/export-xml';
import exportJSON from '../_js/utils/export-json';


test('export xml test', function(t) {

    t.equal(
        Object.keys(exportXML(records).files).length,
        2,
        'all records should be added to the zip file'
    );

    t.end();
});


test('export json test', function(t) {

    exportJSON(dataset).file("data.json").async("string").then(function (data) {

        t.equal(
            data,
            JSON.stringify(dataset, null, 2),
            'the complete dataset should be added to the json file'
        );

        return exportJSON(dataset, true).file("data.json").async("string");
    }).then(function (data) {

        t.equal(
            data,
            `callback(${JSON.stringify(dataset, null, 2)})`,
            'the json data should be padded'
        );

        t.end();
    });
});
