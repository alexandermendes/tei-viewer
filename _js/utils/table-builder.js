import he from 'he';

import dbServer from '../model/db-server';
import exportXML from '../utils/export-xml';
import exportJSON from '../utils/export-json';
import Transformer from '../utils/transformer';
import notify from '../view/notify';


class TableBuilder {

    /**
     * Initialise.
     */
    constructor(tableElem, xsltFilename) {
        this.tableElem = tableElem;
        this.xsltFilename = xsltFilename;
    }

    /**
     * Return the dataset.
     */
    getDataset(records) {
        return records.map((el) => {
            return el[this.xsltFilename].TEI;
        });
    }

    /**
     * Return the table columns.
     */
    getColumns() {
        let columns = [{data: null}];
        $('th:not(:first-child)').each(function() {
            columns.push({data: $(this).text().replace(/\s/g, "")});
        });
        return columns;
    }

    /**
     * Build the table.
     */
    build(dataSet) {
        return new Promise((resolve, reject) => {
            const columns = this.getColumns(),
                  table   = this.tableElem.DataTable({
                "data": dataSet,
                "dom": "Bfrtip",
                "deferRender": true,
                "colReorder": {
                    "fixedColumnsLeft": 1,
                },
                "columnDefs": [
                    {
                        "targets": "_all",
                        "render": function (data, type, full, meta) {
                            return he.decode(data.toString());  // Decode HTML entities
                        }
                    },
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
                                "className": "buttons-excel-export",
                                "exportOptions": {
                                    "columns": function (idx, data, node) {
                                        return idx !== 0;
                                    }
                                }
                            },
                            {
                                "extend": "csvHtml5",
                                "title": "teiviewer-csv-export",
                                "className": "buttons-csv-export",
                                "exportOptions": {
                                    "columns": function (idx, data, node) {
                                        return idx !== 0;
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
                            },
                            {
                                "text": "JSON",
                                "className": "buttons-json-export",
                                "action": function (evt, dt, node, conf) {
                                    dbServer.getAll().then(function(records) {
                                        exportJSON(dataSet, false);
                                    }).catch(function(err) {
                                        notify(err.message, 'error');
                                        throw err;
                                    });
                                }
                            },
                            {
                                "text": "JSONP",
                                "className": "buttons-jsonp-export",
                                "action": function (evt, dt, node, conf) {
                                    dbServer.getAll().then(function(records) {
                                        exportJSON(dataSet, true);
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
                                        const id = parseInt($(this).attr('id'));
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
                                "text": "Delete All",
                                "className": "buttons-delete-all",
                                "action": function (evt, dt, node, conf) {
                                    $('tbody tr').each(function() {
                                        const id = $(this).attr('id');
                                        dbServer.clear().then(function() {
                                            dt.rows().remove().draw();
                                        }).catch(function(err) {
                                            notify(err.message, 'error');
                                            throw err;
                                        });
                                    });
                                }
                            }
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
            $('.navbar-nav').append($('.dt-buttons'));

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

    downloadDataset(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                jsonp: 'callback',
                jsonpCallback: 'callback',
                dataType: 'jsonp',
            }).done((dataSet) => {
                resolve(dataSet);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject(`Error loading dataset: ${errorThrown}`);
            });
        });
    }

    buildFromDB() {
        let transformer = new Transformer(this.xsltFilename),
            allRecords  = [];

        return new Promise((resolve, reject) => {
            dbServer.getAll().then((records) => {
                allRecords = records;
                return transformer.filterRecordsToUpdate(allRecords);
            }).then((recordsToUpdate) => {
                if(recordsToUpdate.length) {
                    notify(`Transforming ${recordsToUpdate.length} records,
                           please wait...`, 'info');
                }
                return transformer.transformMultiple(recordsToUpdate);
            }).then((transformedRecords) => {
                return dbServer.updateAll(transformedRecords);
            }).then(() => {
                return this.build(this.getDataset(allRecords));
            }).then(function(table) {
                resolve(table);
            }).catch(function(err) {
                notify(err, 'error');
                throw err;
            });
        });
    }

    /** Build the table with data loaded from a JSONP URL. */
    buildFromJSONP(url) {
        return new Promise((resolve, reject) => {
            this.downloadDataset(url).then((dataset) => {
                return this.build(dataset);
            }).then(function(table) {
                table.buttons('.buttons-xml-export').disable();
                table.buttons('.buttons-delete').disable();
                table.buttons('.buttons-delete-all').disable();
                resolve(table);
            }).catch(function(err) {
                throw err;
            });
        });
    }
}

export default TableBuilder;