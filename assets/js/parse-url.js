window.parseURL = {getIntParameter: null}

parseURL.getIntParameter = function(parameter, required=false) {
    var uri   = new URI(document.location.href),
        query = URI.parseQuery(uri.query()),
        param = parseInt(query[parameter]);

    if (isNaN(param) && required) {
        throw new Error('Invalid parameters in URL');
    }

    if (isNaN(param)) {
        return null;
    }

    return parseInt(query[parameter]);
}

export default window.parseURL;