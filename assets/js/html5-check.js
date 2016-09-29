var html5Check;

var required = [
    Modernizr.filereader,
    Modernizr.promises,
    Modernizr.indexeddb
];

$.each(required, function(i, v){
    if (!v) {
        notify('Your browser does not support the required HTML5 features, ' +
               'please upgrade.', 'error');
    }
});

export default html5Check;