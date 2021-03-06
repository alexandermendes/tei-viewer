/**
 * Check for requried HTML5 features.
 */
const checkHTML5 = function() {
    const required = [
        Modernizr.filereader,
        Modernizr.promises,
        Modernizr.indexeddb,
        Modernizr.blobconstructor,
        Modernizr.flexbox
    ];

    for (let feature of required) {
        if (!feature) {
            throw new Error('Your browser does not support the required ' +
                            'HTML5 features, please upgrade.');
        }
    }
};

export default checkHTML5;