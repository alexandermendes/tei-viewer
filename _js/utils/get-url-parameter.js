import URI from 'urijs';

/**
 * Return a URL parameter.
 */
const getUrlParameter = function(url, param, type) {
    const uri   = new URI(url),
        query = URI.parseQuery(uri.query());

    if (!uri.hasQuery(param)) {
        return null;
    }

    if (type == 'int') {
        if (isNaN(parseInt(query[param]))) {
            throw new Error(`Parameter "${param}" must be an integer`);
        }
        return parseInt(query[param]);
    }

    return query[param];
};

export default getUrlParameter;