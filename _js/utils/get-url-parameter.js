import URI from 'urijs';

/**
 * Return a URL parameter.
 */
const getUrlParameter = function(url, parameter) {
    const uri   = new URI(url),
          query = URI.parseQuery(uri.query());

    if (!uri.hasQuery(parameter)) {
        return null;
    }

    return query[parameter];
};

export default getUrlParameter;