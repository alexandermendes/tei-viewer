function TeiTable() {

    var XSLTProc;
    var hiddenCols = [];

    /** Populate the hide and show menus. */
    function _populateMenus() {
        var headings = []
        $('table th').each(function(i) {
            var h = {'label': $(this).html(),
                     'visible': hiddenCols.indexOf(i) == -1,
                     'index': i}
            headings.push(h);
        });

        function renderPlaceholder(id) {
            var template = $("#table-menu-ph-template").html();
                rendered = Mustache.render(template, {label: "Nothing to " + id});
            $("#" + id + "-menu").html(rendered);
        }

        function renderMenu(id, cls) {
            var template = $("#table-menu-template").html();
                rendered = Mustache.render(template, {cls: cls, headings: headings});
            $("#" + id + "-menu").html(rendered);
        }

        function getHideCls() {
            return (this.visible) ? "hide-column" : "hide-column hidden";
        }

        function getShowCls() {
            return (!this.visible) ? "show-column" : "show-column hidden";
        }

        if (hiddenCols.length !== $('table th').length) {
            renderMenu('hide', getHideCls)
        } else {
            renderPlaceholder('hide');
        }

        if (hiddenCols.length > 0) {
            renderMenu('show', getShowCls)
        } else {
            renderPlaceholder('show');
        }
    }

    /** Hide a table column. */
    this.hideColumn = function(columnIndex) {
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').hide();
        hiddenCols.push(columnIndex);
        _populateMenus();
    }

    /** Show a table column. */
    this.showColumn = function(columnIndex) {
        console.log(columnIndex);
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').show();
        hiddenCols = $.grep(hiddenCols, function(value) {
            return value != columnIndex;
        });
        _populateMenus();
    }

    /** Set the table to fixed or otherwise. */
    function _setTableAsFixed(bool) {
        if (bool) {
            $('#table-scroll').addClass('fixed');
            var tableWidth = $('#table-scroll .table th').length * 300;
            $('#table-scroll .table').css('width', tableWidth);
            $('#table-scroll .table').css('max-width', tableWidth);
        } else {
            $('#table-scroll').removeClass('fixed');
        }
    }

    /** Load TEI data into the table view. */
    this.populate = function(xml) {
        teiTable = this;
        html = XSLTProc.transformToFragment(xml, document);
        $('#table-data').html(html);
        fixedTables = $('#fixed-table').val() == 'True';
        _setTableAsFixed(fixedTables);
        $(hiddenCols).each(function(k, v) {
            teiTable.hideColumn(v);
        });
        _populateMenus();
    }

    this.updateXSLTProc = function(obj) {
        XSLTProc = obj;
    }

    this.XSLTProcLoaded = function() {
        return typeof(XSLTProc) !== 'undefined';
    }
}
