import buildTable from '../utils/build-table';
import transformer from '../utils/transformer';

var jsxml = require('jsxml');

var landing;
var sampleRecords = [];

/**
 * Create records using the sample JSON data.
 */
function createSampleRecords(sampleJson) {
    let records = [];

    $.each(sampleJson, function(i, record) {
        let json_string = JSON.stringify(record);
        let xml = jsxml.toXml(json_string);
        records.push({
            id: i + 1,
            filename: `sample-record-${i}.xml`,
            xml: xml
        });
    });

    return new Promise(function(resolve, reject) {
        transformer.transformMultiple(records).then(function() {
            resolve(records);
        }).catch(function(err) {
            reject(err);
        });
    });
}

/**
 * Setup the demo editor.
 */
function setupDemoEditor(record) {
    let editor = CodeMirror(document.getElementById('landing-editor'), {
        value: record.xml,
        mode:'text/xml',
        lineNumbers: true,
        autofocus: true,
        lineWrapping: true,
    });
    editor.record = record;

    // Update the sample data and reload the table
    editor.on('change', function() {
        record.xml = editor.getValue();
        transformer.transform(record).then(function() {
            updateTable(sampleRecords);
        });
    });
}

/**
 * Setup the demo table.
 */
function setupDemoTable(records) {
    let tableElem = $('#landing-table table');
    buildTable(tableElem, records).then(function(table) {
        table.rows(0).select();
        table.buttons('.buttons-xml-export').disable();
        table.buttons('.buttons-delete').disable();
        table.buttons('.buttons-xml-editor').disable();

        table.on('select', function (e, dt, type, indexes) {
            let record = setSelectedRecord(records);
        });
        table.on('deselect', function (e, dt, type, indexes) {
            let record = setSelectedRecord(records);
        });

        $('.loading-overlay').hide();
    });
}

/**
 * Update the table.
 */
function updateTable(dataSet) {
    let table = $('#landing-table table').DataTable();
    table.clear();
    table.rows.add(dataSet);
    table.draw();
}

/**
 * Populate the code editor with the record related to the selected table row.
 */
function setSelectedRecord(sampleRecords) {
    if ($('tr.selected').length === 1) {
        let id = $('tr.selected').attr('id');
        for (let record of sampleRecords) {
            if (record.id == id) {
                let editor = $('.CodeMirror')[0].CodeMirror;
                editor.setValue(record.xml);
            }
        }
    } else {

    }
}

if ($('#landing-view').length) {
    let sampleJson = JSON.parse($('#sample-data').html());
    createSampleRecords(sampleJson).then(function(records) {
        sampleRecords = records;
        setupDemoEditor(sampleRecords[0]);
        setupDemoTable(sampleRecords)
    }).catch(function(err) {
        notify(err.message, 'error');
        throw err;
    });
}

export default landing;