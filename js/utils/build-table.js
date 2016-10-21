import dbServer from '../model/db-server';
import exportXML from '../utils/export-xml';
import notify from '../view/notify';

/**
 * Load the table.
 */
var buildTable = function(tableElem, records) {
    return new Promise(function(resolve, reject) {
        let dataSet = records.map(function(el) {
            el.transformed.DT_RowId = el.id;  // Add database ID to tr
            return el.transformed;
        });

        let columns = [{"data": null}];
        $('thead th:not(:first-child)').each(function() {
            columns.push({"data": $(this).data('tag')});
        });

        let table = tableElem.DataTable({
            "data": dataSet,
            "dom": "Bfrtip",
            "deferRender": true,
            "colReorder": {
                "fixedColumnsLeft": 1,
            },
            "columnDefs": [
                {
                    "searchable": false,
                    "orderable": false,
                    "targets": 0,
                    "className": "bg-faded",
                }
            ],
            "columns": columns,
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
                            "className": "buttons-xml-export",
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
                            "extend": "selectAll"
                        },
                        {
                            "text": "Deselect",
                            "extend": "selectNone"
                        },
                        {
                            "text": "Delete",
                            "className": "buttons-delete",
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
                            "className": "buttons-xml-editor",
                            "action": function (evt, dt, node, conf) {
                                if ($('tr.selected').length !== 1) {
                                    notify('Please select a single row to edit', 'info');
                                } else {
                                    let id = parseInt($('tr.selected').attr('id'));
                                    window.location = `http://${window.location.host}/editor?id=${id}`;
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
                            "extend": "colvis",
                            "columns": ":gt(0)"
                        }
                    ]
                }
            ],
            "order": [[ 1, 'asc' ]],
            "select": {
                "style": "os",
                "selector": "td:first-child"
            }
        });

        // Add index column
        table.on('order.dt search.dt', function () {
            table.column(0, {search:'applied', order:'applied'})
                 .nodes()
                 .each(function (cell, i) {
                    cell.innerHTML = i+1;
            });
        }).draw();

        // Move table elements
        $("footer #table-pagination").html($(".dataTables_paginate"));
        $("footer #table-info").append($(".dataTables_info"));
        $(".dataTables_filter").remove();
        $('.navbar-nav').prepend($('.dt-buttons'));

        // Fix styles
        $('.dt-buttons>.buttons-collection').removeClass('btn-secondary');
        $('.dt-buttons>.buttons-collection').addClass('nav-link');
        $('.dt-buttons.btn-group').addClass('nav-item');

        // Fix tbody position
        $('.dataTable tbody').css('height', 'calc(100% - ' + $('thead').height() + 'px)');
        $('.dataTable tbody').css('top', $('thead').height() + 'px');

        // Handle search
        $("#table-search").on("keyup search input paste cut", function() {
            table.search(this.value).draw();
         });

        // Handle select all
        $('.select-all').on('click', table.rows().select);

        resolve(table);
    });
}

export default buildTable;