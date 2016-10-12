import exportXML from '../utils/export-xml'
import transformer from '../utils/transformer'
import dbServer from '../model/db-server'

var tableView;

function editCode() {
    // Get selected row and go to editor
}

function loadXSLT() {
    return new Promise(function(resolve, reject) {
        transformer.loadXSLT().then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

function filterRecordsToUpdate(records) {
    return records.filter(function(el) {
        return transformer.version !== el.version;
    });
}

function updateRecords(records) {
    loading.text('Updating records');
    return new Promise(function(resolve, reject) {
        var updateGen = transformer.updateRecordsGenerator(records);
        var promises = [];
        for (var r of updateGen) {
            promises.push(dbServer.update(r));
        }
        Promise.all(promises).then(function(r) {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

/** Load the table. */
function loadTable(records) {
    loading.text('Building table');
    return new Promise(function(resolve, reject) {

        var rows = records.map(function(el){
            return el.transformed.replace('<tr>', '<tr id="' + el.id + '">');
        }).join();
        $('#table-body').html(rows);

        var table = $('table').DataTable({
            "dom": "Bfrtip",
            "columnDefs": [
                {
                    "searchable": false,
                    "orderable": false,
                    "targets": 0
                },
                {
                    "searchable": false,
                    "orderable": false,
                    "className": "select-checkbox",
                    "targets": 1
                }
            ],
            "buttons": [
                {
                    "extend": "collection",
                    "text": "Export",
                    "buttons": [
                        {
                            "extend": "excelHtml5",
                            "title": "teiviewer-excel-export",
                            "exportOptions": {
                                columns: function (idx, data, node) {
                                    return idx !== 0 && idx !== 1;
                                }
                            }
                        },
                        {
                            "extend": "csvHtml5",
                            "title": "teiviewer-csv-export",
                            "exportOptions": {
                                columns: function (idx, data, node) {
                                    return idx !== 0 && idx !== 1;
                                }
                            }
                        },
                        {
                            "text": "XML",
                            "action": function (evt, dt, node, conf) {
                                dbServer.getAll().then(function(records) {
                                    exportXML(records);
                                });
                            }
                        }
                    ]
                },
                {
                    "extend": "collection",
                    "text": "Edit",
                    "buttons": [
                        {
                            "text": "Select All",
                            "action": function (evt, dt, node, conf) {
                                dt.rows().select();
                                $('thead tr').addClass('selected');
                                $('nav').click();
                            }
                        },
                        {
                            "text": "Deselect",
                            "action": function (evt, dt, node, conf) {
                                dt.rows().deselect();
                                $('thead tr').removeClass('selected');
                                $('nav').click();
                            }
                        },
                        {
                            "text": "Delete",
                            "action": function (evt, dt, node, conf) {
                                $.each($('tr.selected'), function(i, v) {
                                    var id = parseInt($(this).attr('id'));
                                    dbServer.remove(id).then(function() {
                                        dt.rows('.selected').remove().draw();
                                    })
                                });
                                $('nav').click();
                            }
                        },
                        {
                            "text": "XML Editor",
                            "action": function (evt, dt, node, conf) {
                                if ($('tr.selected').length !== 1) {
                                    notify('Please select a single record to edit', 'warning');
                                    $('nav').click();
                                } else {
                                    var id = parseInt($('tr.selected').eq(0).attr('id'));
                                    window.location = 'editor?id=' + id;
                                }
                            }
                        },
                    ]
                },
                {
                    "extend": "collection",
                    "text": "View",
                    "buttons": [
                        "pageLength",
                        "colvis"
                    ]
                }
            ],
            "order": [[ 2, 'asc' ]],
            "select": {
                "style":    'os',
                "selector": 'td:nth-child(2)'
            },
            //"keys": true,
            //"processing": true,
            "fixedHeader": true
        });

        // Add index column
        table.on('order.dt search.dt', function () {
            table.column(0, {search:'applied', order:'applied'})
                 .nodes()
                 .each(function (cell, i) {
                    cell.innerHTML = i+1;
                    cell.className += ' bg-faded';
            });
        }).draw();

        // Move table elements
        $("#table-pagination").html($(".dataTables_paginate"));
        $("#table-info").append($(".dataTables_info"));
        $(".dataTables_filter").remove();
        $('.navbar-nav').prepend($('.dt-buttons'));

        // Fix styles
        $('.dt-buttons>.buttons-collection').removeClass('btn-secondary');
        $('.dt-buttons>.buttons-collection').addClass('nav-link');
        $('.dt-buttons.btn-group').addClass('nav-item');

        // Handle search
        $("#table-search").on("keyup search input paste cut", function() {
            table.search(this.value).draw();
         });

        // Handle select checkboxes
        $('thead .select-checkbox').on('click', function() {
            var selected = $(this).parent().hasClass('selected');
            if (selected) {
                $(this).parent().removeClass('selected');
                table.rows().deselect();
            } else {
                $(this).parent().addClass('selected');
                table.rows().select();
            }
        });
        table.on('select', function (evt, dt, type, indexes) {
            var nRows = dt.rows().count();
            var notSelected = dt.rows(':not(.selected)').count();
            if (notSelected > 0 || nRows == 0) {
                $('thead tr').removeClass('selected');
            } else {
                $('thead tr').addClass('selected');
            }
        }).on('deselect', function (evt, dt, type, indexes) {
            var nRows = dt.rows().count();
            var notSelected = dt.rows(':not(.selected)').count();
            if (notSelected > 0 || nRows == 0) {
                $('thead tr').removeClass('selected');
            } else {
                $('thead tr').addClass('selected');
            }
        });

        // Apply fixes when table redrawn
        table.on('draw.dt', function () {
            console.log('page changed');
            applyFixedHeaderFixes();
        });

        resolve();
    });
}

function applyFixedHeaderFixes() {

    // Resize Columns
    $('tbody tr:first-child td').each(function(i) {
        var idx = i + 1;
        var hWidth = $('thead th:nth-child(' + (i + 1) + ')').width();
        var cWidth = $(this).width();
        console.log(hWidth, cWidth);
        if (cWidth > hWidth) {
            $('thead th:nth-child(' + idx + ')').css('min-width', cWidth);
        } else {
            $('tbody td:nth-child(' + idx + ')').css('min-width', hWidth);
        }
    });

    // Resize tbody to always show vertical scroll bar
    var offset = $('.dataTables_wrapper').scrollLeft(),
        width  = $('.dataTables_wrapper').width();
    $('tbody').css('min-width', offset + width);

    // Get the width of a scroll bar.
    var $outer = $('<div>').css({
        visibility: 'hidden',
        width: 100,
        overflow: 'scroll'
    }).appendTo('body');
    var widthWithScroll = $('<div>').css({
        width: '100%'
    }).appendTo($outer).outerWidth();
    $outer.remove();
    var scrollBarWidth = 100 - widthWithScroll;

    var headerHeight = $('thead').height(),
        footerHeight = $('footer').height();
    offset = 100 + scrollBarWidth + footerHeight;
    $('tbody').css('margin-top', headerHeight);
    $('tbody').css('height', 'calc(100vh - ' + offset + 'px)');
}


$(document).ready(function() {
    if($('#table-view').length) {
        var records = [];

        loading.text('Loading records');
        dbServer.getAll().then(function(recs) {
            records = recs;
            return loadXSLT();
        }).then(function() {
            return filterRecordsToUpdate(records);
        }).then(function(recordsToUpdate) {
            return updateRecords(recordsToUpdate);
        }).then(function() {
            return loadTable(records);
        }).then(function() {
            loading.hide();
            setTimeout(function() {
                applyFixedHeaderFixes();
            }, 500)
        }).catch(function(err) {
            loading.hide();
            notify(err, 'error');
            throw err;
        });
    }
});

export default tableView;