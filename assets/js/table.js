function TeiTable() {

    /** Populate the hide and show menus. */
    function _populateMenus() {
        var headings = []
        $('table th').each(function(i) {
            var h = {'label': $(this).html(), 'visible': $(this).is(':visible'),
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

        if ($('table th:visible').length > 0) {
            renderMenu('hide', getHideCls)
        } else {
            renderPlaceholder('hide');
        }

        if ($('table th:hidden').length > 0) {
            renderMenu('show', getShowCls)
        } else {
            renderPlaceholder('show');
        }
    }

    /** Hide a table column. */
    this.hideColumn = function(columnIndex) {
        $('table tr > *:nth-child(' + columnIndex + ')').hide();
        _populateMenus();
    }

    /** Show a table column. */
    this.showColumn = function(columnIndex) {
        $('table tr > *:nth-child(' + columnIndex + ')').show();
        _populateMenus();
    }

    /** Return an array of currently hidden column indexes. */
    function _getHiddenColumns(){
        var hiddenCols = [];
        $('table th').each(function(k, v) {
            if ($(this).is(':hidden')) {
                hiddenCols.push(k + 1);
            }
        });
        return hiddenCols;
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

    /** Load HTML data into the table view. */
    this.populate = function(html) {
        teiTable = this;
        var hiddenCols = _getHiddenColumns();
        $('#table-data').html(html);
        fixedTables = $('#fixed-table').val() == 'True';
        _setTableAsFixed(fixedTables);
        $(hiddenCols).each(function(k, v) {
            teiTable.hideColumn(v);
        });
        _populateMenus();
    }
}
