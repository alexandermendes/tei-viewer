var tableXSLTProcessor, listXSLTProcessor;

/** Handle the add XML files event. */
$( "#add-files" ).change(function(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
            var xml = loadXMLDoc(e.target.result);
            resultDocument = tableXSLTProcessor.transformToFragment(xml);
        }
        if (f.type !== 'text/xml') {
            abort('Invalid XML file detected: ' + f.name, 'danger');
        }
        reader.readAsText(f);
    }
});


/** Abort javascript execution and display a Bootstrap alert. */
function abort(msg, type) {
    $( "#alerts" ).hide();
    $( "#alerts" ).load( "_alerts.html #alert-template" ,function(){
        var template = document.getElementById('alert-template').innerHTML;
        var rendered = Mustache.render(template, {msg: msg, type: type});
        $( "#alerts" ).html(rendered);
    });
    $( "#alerts" ).show();
    throw new Error(msg);
}


/** Clear the views. */
$( "#clear-views" ).click(function() {
    $('#tei-table tbody').html("");
    $('#tei-list').html("");
    $('#tei-form').trigger("reset");
});


/** Load the selected XSL document for tables. */
function loadTableXSLTProcessor() {
    var fn = $('#table-xslt>option:selected').val();
    var promise = Promise.resolve($.ajax({
        url: "assets/xsl/" + fn
    }));
    promise.then(function(result) {
        var doc = loadXMLDoc(result);
        tableXSLTProcessor = new XSLTProcessor();
        tableXSLTProcessor.importStylesheet(doc);
    });
}


/** Return an array containing the text for each table header. */
function getHeaders() {
    var headers = [];
    $('#tei-table th').each(function(k, v) {
        headers.push(v.innerHTML)
    });
    return headers;
}


/** Export the data to CSV. */
$( "#csv-export" ).click(function() {
    var headers = getHeaders().join(",");
    var csvRows = [headers];
    for (var i = 0; i < data.length; i++) {
        var escapedRow = [];
        for (var j = 0; j < data[i].length; j++) {
            escapedRow.push('"' + data[i][j].replace(/"/g, '""') + '"');
        }
        csvRows.push(escapedRow.join(","));
    }
    var bom = "\uFEFF";
    var csvString = bom + csvRows.join("\n");
    var encodedUri = encodeURI('data:attachment/csv;charset=utf-8,' + csvString);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tei_data.csv");
    link.click();
});


/** Load and return an XML document. */
function loadXMLDoc(text) {
    var parseXml;
    if (typeof window.DOMParser != "undefined") {
        parseXml = function(xmlStr) {
            return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        throw new Error("No XML parser found");
    }
    return parseXml(text);
}


/** Load XSL file settings. */
function loadSettings() {
    $.getJSON( "settings.json", function( data ) {
        $.each( data.table, function( key, val ) {
            var html = '<option value="' + val + '">' + key + '</option>';
            $('#table-xslt').append(html);
        });
        $.each( data.list, function( key, val ) {
            var html = '<option value="' + val + '">' + key + '</option>';
            $('#list-xslt').append(html);
        });
    }).then(function() {
        $('.selectpicker').selectpicker('val', 'Default');
        $('.selectpicker').selectpicker('refresh');
        loadTableXSLTProcessor();
    });
}


$(function() {
    loadSettings();
});