import exportXML from '../utils/export-xml';
import transformer from '../utils/transformer';
import notify from '../view/notify';
import dbServer from '../model/db-server';


var table;

/**
 *
 */
function loadXSLT() {
    return new Promise(function(resolve, reject) {
        transformer.loadXSLT().then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

/**
 *
 */
function filterRecordsToUpdate(records) {
    return records.filter(function(el) {
        return transformer.version !== el.version;
    });
}

/**
 * Update records to use latest transformation.
 */
function updateRecords(records) {
    return new Promise(function(resolve, reject) {
        let updateGen = transformer.updateRecordsGenerator(records);
        let promises = [];
        for (let r of updateGen) {
            promises.push(dbServer.update(r));
        }
        Promise.all(promises).then(function(r) {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

/**
 * Load the table.
 */
function loadTable(records) {
    return new Promise(function(resolve, reject) {

        console.log('concatenating records');
        var rows = records.map(function(el){
            return el.transformed.replace('<tr>', '<tr id="' + el.id + '">');
        }).join();
        $('#table-body').html(rows);
        console.log('and on');

        table = $('table').DataTable({
            "dom": "Bfrtip",
            "colReorder": true,
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
                    "autoClose": true,
                    "buttons": [
                        {
                            "extend": "excelHtml5",
                            "title": "teiviewer-excel-export",
                            "exportOptions": {
                                "columns": function (idx, data, node) {
                                    return idx !== 0 && idx !== 1;
                                }
                            }
                        },
                        {
                            "extend": "csvHtml5",
                            "title": "teiviewer-csv-export",
                            "exportOptions": {
                                "columns": function (idx, data, node) {
                                    return idx !== 0 && idx !== 1;
                                }
                            }
                        },
                        {
                            "text": "XML",
                            "action": function (evt, dt, node, conf) {
                                dbServer.getAll().then(function(records) {
                                    exportXML(records);
                                }).catch(function(err) {
                                    notify(err.message, 'error');
                                    throw err;
                                });
                            }
                        }
                    ]
                },
                {
                    "extend": "collection",
                    "text": "Edit",
                    "autoClose": true,
                    "buttons": [
                        {
                            "text": "Select All",
                            "action": function (evt, dt, node, conf) {
                                dt.rows().select();
                                $('thead tr').addClass('selected');
                            }
                        },
                        {
                            "text": "Deselect",
                            "action": function (evt, dt, node, conf) {
                                dt.rows().deselect();
                                $('thead tr').removeClass('selected');
                            }
                        },
                        {
                            "text": "Delete",
                            "action": function (evt, dt, node, conf) {
                                $('tbody tr.selected').each(function() {
                                    let id = $(this).attr('id');
                                    dbServer.remove(id).then(function() {
                                        dt.rows('#' + id).remove().draw();
                                    }).catch(function(err) {
                                        notify(err.message, 'error');
                                        throw err;
                                    });
                                });
                            }
                        },
                        {
                            "text": "XML Editor",
                            "action": function (evt, dt, node, conf) {
                                if ($('tr.selected').length !== 1) {
                                    notify('Please select a single record to edit',
                                           'warning');
                                } else {
                                    var id = parseInt($('tr.selected').attr('id'));
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
                        {
                            extend: 'colvis',
                            columns: ':gt(1)'
                        }
                    ]
                }
            ],
            "order": [[ 2, 'asc' ]],
            "select": {
                "style":    'os',
                "selector": 'td:nth-child(2)'
            },
            //"keys": true,
            //"processing": true
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
            if (notSelected > 0 || nRows === 0) {
                $('thead tr').removeClass('selected');
            } else {
                $('thead tr').addClass('selected');
            }
        }).on('deselect', function (evt, dt, type, indexes) {
            var nRows = dt.rows().count();
            var notSelected = dt.rows(':not(.selected)').count();
            if (notSelected > 0 || nRows === 0) {
                $('thead tr').removeClass('selected');
            } else {
                $('thead tr').addClass('selected');
            }
        });

        // Fix tbody position
        $('tbody').css('height', 'calc(100% - ' + $('thead').height() + 'px)');
        $('tbody').css('top', $('thead').height() + 'px');

        resolve();
    });
}

if($('#table-view').length) {
    var records = [];
    console.log('retrieving records');
    dbServer.getAll().then(function(recs) {
        console.log('retrieved records');
        records = recs;
        console.log('loading XSLT');
        return loadXSLT();
    }).then(function() {
        console.log('Filtering records to Update');
        return filterRecordsToUpdate(records);
    }).then(function(recordsToUpdate) {
        console.log('Updating records');
        return updateRecords(recordsToUpdate);
    }).then(function() {
        console.log('Loading table');
        return loadTable(records);
    }).catch(function(err) {
        notify(err, 'error');
        throw err;
    });
}

export default table;