// TEI table js

function TeiTable() {

    var XSLTProc    = {},
        hiddenCols  = [];

    /** Populate the hide and show menus. */
    function _populateMenus() {

        // Get heading, index and visibility for each column
        var columns = []
        $('table thead th').each(function(i) {
            var h = {'heading': $(this).html(),
                     'visible': hiddenCols.indexOf(i) == -1,
                     'index': i}
            columns.push(h);
        });

        /** Render menu with placeholder. */
        function renderPlaceholder(id) {
            var template = $("#table-menu-ph-template").html();
                rendered = Mustache.render(template,
                                           {heading: "Nothing to " + id});
            $("#" + id + "-menu").html(rendered);
        }

        /** Render menu. */
        function renderMenu(id, cls) {
            var template = $("#table-menu-template").html();
                rendered = Mustache.render(template,
                                           {cls: cls, columns: columns});
            $("#" + id + "-menu").html(rendered);
        }

        /** Determine whether or not to display a hide menu item. */
        function getHideCls() {
            return (this.visible) ? "hide-column" : "hide-column hidden";
        }

        /** Determine whether or not to display a show menu item. */
        function getShowCls() {
            return (!this.visible) ? "show-column" : "show-column hidden";
        }

        // Render the hide menu or a placeholder
        if (hiddenCols.length !== $('table th').length) {
            renderMenu('hide', getHideCls)
        } else {
            renderPlaceholder('hide');
        }

        // Render the show menu or a placeholder
        if (hiddenCols.length > 0) {
            renderMenu('show', getShowCls)
        } else {
            renderPlaceholder('show');
        }
    }


    /**
     * Add an index column to the table.
     * @param {number} firstIndex - Index from which to start row numbering.
     */
    function _addIndexColumn(firstIndex) {
        $('table thead tr th').eq(0).before('<th class="index-column">#</th>');
        $('table tbody').find('tr').each(function(i){
            var index = firstIndex + i + 1;
            $(this).find('td').eq(0).before('<td class="index-column">' +
                                            index + '</td>');
        });
    }


    /** Remove the index column from the table. */
    function _removeIndexColumn() {
        $('table .index-column').remove();
    }


    /** Populate tooltips. */
    function _populateTooltips() {
        var tooltips = [{'tag': 'name', 'attr': 'role'},
                        {'tag': 'date', 'attr': 'calendar'}]

        $(tooltips).each(function(i, tooltip){
            var attr = tooltip.attr;
            $(tooltip.tag + '[' + attr + ']').each(function() {
                var title = attr.capitalise()  + ': ' + $(this).attr(attr);
                $(this).attr('data-toggle', 'tooltip');
                $(this).attr('title', title);
            });
        });
        $("body").tooltip({selector: '[data-toggle="tooltip"]'});
    }


    /**
     * Hide a table column.
     * @param {number} columnIndex - The index of the column to hide.
     * @param {number} firstIndex - Index from which to start row numbering.
     */
    this.hideColumn = function(columnIndex, firstIndex) {
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').hide();
        hiddenCols.push(columnIndex);
        _removeIndexColumn();
        _populateMenus();
        _addIndexColumn(firstIndex);
    }


    /**
     * Show a table column.
     * @param {number} columnIndex - The index of the column to show.
     * @param {number} firstIndex - Index from which to start row numbering.
     */
    this.showColumn = function(columnIndex, firstIndex) {
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').show();
        hiddenCols = $.grep(hiddenCols, function(value) {
            return value != columnIndex;
        });
        _removeIndexColumn();
        _populateMenus();
        _addIndexColumn(firstIndex);
    }


    /** Fixes for frozen table header. */
    this.fixFrozenTable = function() {

        // Resize header cells
        $('#tei-view.fixed tbody tr:first-child td').each(function(i) {
            var colWidth = $(this).width();
            $('table thead tr th:nth-child(' + (i + 1) + ')').width(colWidth);
        });

        // Resize tbody to always show vertical scroll bar
        var offset = $('#tei-view').scrollLeft();
            width  = $('#tei-view').width();
        $('#tei-view.fixed tbody').css('width', offset + width);

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

        // Update height and margins of table body
        var headerHeight = $('#tei-view thead').height(),
            footerHeight = $('footer').height(),
            offset       = 100 + scrollBarWidth + footerHeight;
        $('#tei-view.fixed tbody').css('margin-top', headerHeight);
        $('#tei-view.fixed tbody').css('max-height',
                                       'calc(100vh - ' + offset + 'px)');
    }


    /**
     * Load TEI data into the table view.
     * @param {string} xml - The XML files to load.
     * @param {number} firstIndex - Index from which to start row numbering.
     */
    this.populate = function(xml, firstIndex) {
        teiTable = this;
        html = XSLTProc.transformToFragment(xml, document);
        $('#tei-view').html(html);
        $(hiddenCols).each(function(k, v) {
            teiTable.hideColumn(v);
        });
        _removeIndexColumn();
        _populateMenus();
        _addIndexColumn(firstIndex);
    }


    /**
     * Update the XSLT processor.
     * @param {Object} xsltProc - The XSLT processor.
     */
    this.updateXSLTProc = function(xsltProc) {
        XSLTProc = xsltProc;
    }


    /** Check if an XSLT processor has been loaded. */
    this.XSLTProcLoaded = function() {
        return typeof(XSLTProc) !== 'undefined';
    }


    /**
     * Show or hide table borders.
     * @param {boolean} bool - True to display borders, false otherwise.
     */
    this.showBorders = function(bool) {
        if (bool) {
            $('table').addClass('table-bordered');
        } else {
            $('table').removeClass('table-bordered');
        }
    }


    /**
     * Show or hide tooltips.
     * @param {boolean} bool - True to display tooltips, false otherwise.
     */
    this.showTooltips = function(bool) {
        if (bool) {
            _populateTooltips();
        } else {
            $('[data-toggle="tooltip"]').removeAttr('data-toggle');
        }
    }


    /**
     * Freeze or unfreeze table header.
     * @param {boolean} bool - True to freeze header, false otherwise.
     */
    this.freezeHeader = function(bool) {
        if (bool) {
            $('#tei-view').addClass('fixed');
        } else {
            $('#tei-view').removeClass('fixed');
        }
    }

    // String function to capitalise first letter
    String.prototype.capitalise = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
