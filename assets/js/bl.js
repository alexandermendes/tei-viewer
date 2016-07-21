// Custom British Library js

$(function() {

    // Add custom CSS
    $.get("assets/css/bl.css", function(data){
        $("<style type=\"text/css\">" + data + "</style>").appendTo(document.head);
    });

    /** Pad the left of a string. */
    function pad(pad, str) {
        if (typeof str === 'undefined') {
            return pad;
        }
        return (pad + str).slice(-pad.length);
    }

    /** Return a link to the Digitised Manuscripts full display. */
    function renderDMLink(sm) {
        var escStr = sm.replace(/\s+/g, '_'),
            url    = 'http://www.bl.uk/manuscripts/FullDisplay.aspx?ref=' + escStr,
            templ  = $("#link-template").html(),
            rend   = Mustache.render(templ, {url: url, text: sm});
        return rend;
    }

    /** Return a link to the Digitised Manuscripts viewer.  */
    function renderFolioLink(sm, folio) {
        var escStr = sm.replace(/\s+/g, '_').toLowerCase() + '_f' + pad('0000', folio);
            url    = 'http://www.bl.uk/manuscripts/Viewer.aspx?ref=' + escStr,
            templ  = $("#link-template").html(),
            rend   = Mustache.render(templ, {url: url, text: folio});
        return rend;
    }

    /** Format rows. */
    $('#tei-table tr').each(function(i) {
        var sm;

        var shelfmarks = $(this).find('.shelfmark'),
            loci       = $(this).find('locus'),
            refs       = $(this).find('ref'),
            dimensions = $(this).find('dimensions'),
            layout     = $(this).find('layout'),
            hands      = $(this).find('handDesc'),
            extent     = $(this).find('extent'),
            addons     = $(this).find('[data-addon]');

        // Add shelfmark links
        $(shelfmarks).each(function() {
            sm = $(this).text();
            var link = renderDMLink(sm);
            $(this).html(link);
        });

        // Add loci links
        if (typeof(sm) !== 'undefined') {
            $(loci).each(function() {
                var n    = $(this).attr('n') || "",
                    to   = $(this).attr('to') || "",
                    from = $(this).attr('from') || "",
                    lStr = n;
                if (to.length > 0 && from.length > 0) {
                    lStr = lStr + to + "-" + from;
                } else if (n.length < 1) {
                    lStr = lStr + to + from;
                }
                lStr = lStr.replace(/[0-9]{1,3}[rv]/g, function (match, capture) {
                    return renderFolioLink(sm, match);
                });
                lStr = lStr.replace(/<\/a>[\n\r\s]+/g, '</a>');
                lStr = lStr.replace(/-[\n\r\s]+<a/g, '-<a');
                $(this).html(lStr);
            });
        }

        // Format refs
        $(refs).each(function() {
            var type = $(this).attr('type') || "",
                text = $(this).text() || "",
                str  = (type + " " + text).trim();
            if (text.length > 0) {
                $(this).html(str);
            }
        });

        // Format extent
        $(extent).each(function() {
            var node = $(this).contents().filter(function() {
                    return this.nodeType == 3;
            })[0];
            node.nodeValue = $.trim(node.nodeValue) + "; ";
        });

        // Format dimensions
        $(dimensions).each(function() {
            var type   = $(this).attr('type') || "",
                unit   = $(this).attr('unit') || "",
                height = $(this).find('height').text() || "",
                width  = $(this).find('width').text() || "",
                str    = height + unit + " x " + width + unit;
            if (type.length > 0) {
                str = str + ' (' + type + '); ';
            }
            $(this).html(str);
        });

        // Format layout
        $(layout).each(function() {
            var layout = $(this);
            $.each(this.attributes, function(i, attr){
                if (attr.name == 'columns') {
                    layout.append('Columns: ' + attr.value + '<br/>');
                } else if (attr.name == 'ruledlines') {
                    layout.append('Ruled lines: ' + attr.value + '<br/>');
                } else if (attr.name == 'writtenlines') {
                    layout.append('Written lines: ' + attr.value + '<br/>');
                }
             });
        });

        // Format hand description
        $(hands).each(function() {
            var n = $(this).attr('hands') || "";
            $(this).append('Hands: ' + n + '<br/><br/>');
        });

        // Format addons
        $(addons).each(function() {
            var attr     = $(this).data('addon'),
                children = $(this).find('[' + attr + ']');
            $(children).each(function() {
                var text  = $(this).text() || "",
                    addon = $(this).attr(attr) || "",
                    str   = (text + " (" + addon + ")");
                if (addon.length > 0) {
                    $(this).html(str);
                }
            });
        });
    });
});