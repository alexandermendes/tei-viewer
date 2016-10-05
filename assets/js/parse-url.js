window.parseURL = {getIntParameter: null}

parseURL.getIntParameter = function(parameter, required=false) {
    var uri   = new URI(document.location.href),
        query = URI.parseQuery(uri.query());

    if (typeof query[parameter] === 'undefined' && !required) {
        return null;
    }

    if (isNaN(query[parameter])) {
        notify('Invalid parameters in URL', 'error');
        throw new Error('Invalid parameters in URL');
    }

    return parseInt(query[parameter]);
}

export default window.parseURL;