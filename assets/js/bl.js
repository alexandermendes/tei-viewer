// Custom British Library js


/** Add custom BL CSS. */
function addCustomCSS() {
    $.get("assets/css/bl.css", function(data){
        var cssStr = "<style type=\"text/css\">" + data + "</style>";
        $(cssStr).appendTo(document.head);
    });
}


/**
 * Pad the left of a string if shorter than the specified padding.
 * @param {string} padding - The string used for padding.
 * @param {string} str - The string to be padded.
 */
function padLeft(padding, str) {
    if (typeof str === 'undefined') {
        return pad;
    }
    return (padding + str).slice(-padding.length);
}


/**
 * Return a link to the Digitised Manuscripts full display for a shelfmark.
 * @param {object} shelfmark - The shelfmark element.
 */
function renderDMLink(shelfmark) {
    var sStr  = shelfmark.trim().replace(/\s+/g, '_').toLowerCase(),
        url    = 'http://www.bl.uk/manuscripts/FullDisplay.aspx?ref=' + sStr,
        templ  = $("#link-template").html(),
        rend   = Mustache.render(templ, {url: url, text: shelfmark});
    return rend;
}


/**
 * Return a link to a folio in the Digitised Manuscripts viewer.
 * @param {object} shelfmark - The shelfmark element.
 */
function renderFolioLink(shelfmark, folio) {
    var sStr  = shelfmark.trim().replace(/\s+/g, '_').toLowerCase(),
        fStr  = '_f' + padLeft('0000', folio),
        url   = 'http://www.bl.uk/manuscripts/Viewer.aspx?ref=' + sStr + fStr,
        templ = $("#link-template").html(),
        rend  = Mustache.render(templ, {url: url, text: folio});
    return rend;
}


/**
 * Add a shelfmark link.
 * @param {object} shelfmark - The shelfmark element.
 */
function addShelfmarkLink(shelfmark) {
    var url = renderDMLink(shelfmark.text());
    shelfmark.html(url);
}


/**
 * Format a locus element.
 * @param {string} shelfmark - The shelfmark of the item.
 * @param {object} locus - The locus element.
 */
function formatLocus(shelfmark, locus) {
    var n    = locus.attr('n') || "",
        to   = locus.attr('to') || "",
        from = locus.attr('from') || "",
        lStr = n;
    if (to.length > 0 && from.length > 0) {
        lStr = lStr + to + "-" + from;
    } else if (n.length < 1) {
        lStr = lStr + to + from;
    }
    lStr = lStr.replace(/[0-9]{1,3}[rv]/g, function (match, capture) {
        return renderFolioLink(shelfmark, match);
    });
    lStr = lStr.replace(/<\/a>[\n\r\s]+/g, '</a>');
    lStr = lStr.replace(/-[\n\r\s]+<a/g, '-<a');
    locus.html(lStr);
}


/**
 * Format a reference element.
 * @param {object} ref - The ref element.
 */
function formatReference(ref) {
    var target = ref.attr('target') || "",
        type   = ref.attr('type') || "",
        text   = ref.text() || "",
        str    = (target + ": " + type + " " + text).trim();
    ref.html(str);
}


/**
 * Format an extent element.
 * @param {object} extent - The extent element.
 */
function formatExtent(extent) {
    var node = extent.contents().filter(function() {
        return this.nodeType == 3;
    })[0];
    node.nodeValue = $.trim(node.nodeValue) + "; ";
}


/**
 * Format a dimensions element.
 * @param {object} dimensions - The dimensions element.
 */
function formatDimensions(dimensions) {
    var type   = dimensions.attr('type') || "",
        unit   = dimensions.attr('unit') || "",
        height = dimensions.find('height').text() || "",
        width  = dimensions.find('width').text() || "",
        str    = height + unit + " x " + width + unit;
    if (type.length > 0) {
        str = str + ' (' + type + '); ';
    }
    dimensions.html(str);
}


/**
 * Format a layout element.
 * @param {object} dimensions - The layout element.
 */
function formatLayout(layout) {
    $.each(layout.context.attributes, function(i, attr){
        if (attr.name == 'columns') {
            layout.append('Columns: ' +
                          attr.value.replace(/\s+/g, '-') +
                          '<br>');
        } else if (attr.name == 'ruledlines') {
            layout.append('Ruled lines: ' +
                          attr.value.replace(/\s+/g, '-')  +
                          '<br>');
        } else if (attr.name == 'writtenlines') {
            layout.append('Written lines: ' +
                          attr.value.replace(/\s+/g, '-')  +
                          '<br>');
        }
    });
}


/**
 * Format an element with the data-addon attribute.
 * @param {object} dimensions - The element.
 */
function formatAddon(addon) {
    var attr     = addon.data('addon'),
        children = addon.find('[' + attr + ']');
    $(children).each(function() {
        if (typeof($(this).attr(attr) !== 'undefined')) {
            $(this).html($(this).text() + " (" + $(this).attr(attr) + ")");
        }
    });
}


$(function() {
    addCustomCSS();

    // Format each row
    $('#tei-view table tr').each(function() {
        var shelfmark  = $(this).find('.shelfmark').first();

        // Add Digitised Manuscript links
        if (typeof(shelfmark) !== 'undefined') {
            addShelfmarkLink(shelfmark);
            $(this).find('locus').each(function() {
                formatLocus(shelfmark.text(), $(this));
            });
        }

        // Format references
        $(this).find('ref').each(function() {
            formatReference($(this));
        });

        // Format extent
        $(this).find('extent').each(function() {
            formatExtent($(this));
        });

        // Format dimensions
        $(this).find('dimensions').each(function() {
            formatDimensions($(this));
        });

        // Format layout
        $(this).find('layout').each(function() {
            formatLayout($(this));
        });

        // Format hand description
        $(this).find('handDesc').each(function() {
            var n = $(this).attr('hands') || "";
            $(this).append('<br>Hands: ' + n + '<br>');
        });

        // Format addons
        $(this).find('[data-addon]').each(function() {
            formatAddon($(this));
        });
    });
});