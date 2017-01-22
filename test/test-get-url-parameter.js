import test from 'tape';
import getUrlParameter from '../_js/utils/get-url-parameter';

test('get url parameter test', function(t) {

    t.equal(
        getUrlParameter('http://example.com', 'param'),
        null,
        'null should be returned when the parameter does not exist'
    );

    t.equal(
        getUrlParameter('http://example.com?param=hello', 'param'),
        'hello',
        'the value for the parameter should be returned'
    );

    t.end();
});
