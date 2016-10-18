/**
 * Return a URL parameter.
 */
var getUrlParameter = function(url, param, type) {
    var uri   = new URI(url),
        query = URI.parseQuery(uri.query());

    if (!uri.hasQuery(param)) {
        throw new Error(`Parameter "${param}" missing from URL`);
    }

    if (type == 'int') {
        if (isNaN(parseInt(query[param]))) {
            throw new Error(`Parameter "${param}" must be an integer`);
        }
        return parseInt(query[param]);
    }

    return query[param];
}

export default getUrlParameter;