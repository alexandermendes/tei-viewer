// TEI table js

function TeiTable() {

    var XSLTProc;
    var hiddenCols = [];

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
            console.log(this, this.visible);
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
     *  Number the table rows.
     *  @param {number} firstIndex - The index from which to start numbering rows.
     */
    function _numberRows(firstIndex) {
        $('table thead tr th').eq(0).before('<th>#</th>');
        $('table tbody').find('tr').each(function(i){
            var index = firstIndex + i + 1;
            $(this).find('td').eq(0).before('<td>' + index + '</td>');
        });
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

        // Initialise
        $("body").tooltip({selector: '[data-toggle="tooltip"]'});
    }


    /** Hide a table column. */
    this.hideColumn = function(columnIndex) {
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').hide();
        hiddenCols.push(columnIndex);
        _populateMenus();
    }


    /** Show a table column. */
    this.showColumn = function(columnIndex) {
        $('table tr > *:nth-child(' + (columnIndex + 1) + ')').show();
        hiddenCols = $.grep(hiddenCols, function(value) {
            return value != columnIndex;
        });
        _populateMenus();
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
     * @param {number} firstIndex - The index from which to start numbering rows.
     */
    this.populate = function(xml, firstIndex) {
        teiTable = this;
        html = XSLTProc.transformToFragment(xml, document);
        $('#tei-view').html(html);
        $(hiddenCols).each(function(k, v) {
            teiTable.hideColumn(v);
        });
        _populateMenus();

        // Number rows after show/hide menus populated
        _numberRows(firstIndex);
    }


    /** Update the XSLT processor. */
    this.updateXSLTProc = function(obj) {
        XSLTProc = obj;
    }


    /** Check if the XSLT processor has been loaded. */
    this.XSLTProcLoaded = function() {
        return typeof(XSLTProc) !== 'undefined';
    }


    /** Show table borders. */
    this.showBorders = function() {
        $('table').addClass('table-bordered');
    }


    /** Hide table borders. */
    this.hideBorders = function() {
        $('table').removeClass('table-bordered');
    }


    /** Show tooltips. */
    this.showTooltips = function() {
        _populateTooltips();
    }


    /** Hide tooltips. */
    this.hideTooltips = function() {
        $('[data-toggle="tooltip"]').removeAttr('data-toggle');
    }


    /** Freeze header. */
    this.freezeHeader = function() {
        $('#tei-view').addClass('fixed');
    }


    /** Unfreeze header. */
    this.unfreezeHeader = function() {
        $('#tei-view').removeClass('fixed');
    }

    // String function to capitalise first letter
    String.prototype.capitalise = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
