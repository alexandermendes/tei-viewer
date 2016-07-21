// TEI table js

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


    /** Number table rows. */
    function _numberRows() {
        $('table').find('tr').each(function(i){
            $(this).find('th').eq(0).before('<th>#</th>');
            $(this).find('td').eq(0).before('<td>' + i + '</td>');
        });
    }


    /** Populate tooltips. */
    function _populateTooltips() {
        $('name[role]').each(function() {
            $(this).attr('data-toggle', 'tooltip');
            $(this).attr('title', $(this).attr('role'));
        });
        $('date[calendar]').each(function() {
            $(this).attr('data-toggle', 'tooltip');
            $(this).attr('title', $(this).attr('calendar'));
        });
        $("body").tooltip({
            selector: '[data-toggle="tooltip"]'
        });
    }


    /** Get the width of a scroll bar. */
    function _getScrollBarWidth () {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };


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
        $('#tei-table.fixed tbody tr:first-child td').each(function(i) {
            var colWidth = $(this).width();
            $('table thead tr th:nth-child(' + (i + 1) + ')').width(colWidth);
        });

        // Resize tbody to always show vertical scroll bar
        var offset = $('#tei-table').scrollLeft();
            width  = $('#tei-table').width();
        $('#tei-table.fixed tbody').css('width', offset + width);

        // Add margins
        var headerHeight = $('#tei-table thead').height();
            scrollWidth  = _getScrollBarWidth();
            footerHeight = $('footer').height();
            offset = 100 + scrollWidth + footerHeight;
        $('#tei-table.fixed tbody').css('margin-top', headerHeight);
        $('#tei-table.fixed tbody').css('max-height', 'calc(100vh - ' + offset + 'px)')
    }


    /** Load TEI data into the table view. */
    this.populate = function(xml) {
        teiTable = this;
        html = XSLTProc.transformToFragment(xml, document);
        $('#tei-table').html(html);
        this.fixFrozenTable();
        $(hiddenCols).each(function(k, v) {
            teiTable.hideColumn(v);
        });
        _populateMenus();
        _numberRows();
        _populateTooltips();
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
        this.fixFrozenTable();
    }


    /** Hide table borders. */
    this.hideBorders = function() {
        $('table').removeClass('table-bordered');
        this.fixFrozenTable();
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
        $('#tei-table').addClass('fixed');
        this.fixFrozenTable();
    }


    /** Unfreeze header. */
    this.unfreezeHeader = function() {
        $('#tei-table').removeClass('fixed');
        this.fixFrozenTable();
    }
}
