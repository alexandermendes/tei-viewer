import buildTable from '../utils/build-table';

var landing;

/**
 * Create sample records using the sample JSON data.
 */
function createSampleRecords(sampleJson) {
    let records = [];
    let x2js = new X2JS({stripWhitespaces:false});
    $.each(sampleJson, function(i, record) {
        let xml = x2js.js2xml(record);
        records.push({
            id: i + 1,
            filename: `sample-record-${i}.xml`,
            xml: new vkbeautify().xml(xml, 1),
            transformed: {
                title: record.TEI.teiHeader.fileDesc.titleStmt.title,
                author: record.TEI.teiHeader.fileDesc.titleStmt.author,
                pubStmt: record.TEI.teiHeader.fileDesc.publicationStmt.p,
                source: record.TEI.teiHeader.fileDesc.sourceDesc.p
            }
        });
    });
    return records;
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

    // Update the sample data and reload the table
    editor.on('change', function() {
        console.log('changed');
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
    let table = $('#landing-table table').dataTable();
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
    let sampleRecords = createSampleRecords(sampleJson);
    setupDemoEditor(sampleRecords[0]);
    setupDemoTable(sampleRecords)
}

export default landing;