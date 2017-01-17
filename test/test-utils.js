import test from 'tape';
import getUrlParameter from '../_js/utils/get-url-parameter';

test('get url paramter test', function(t) {

    t.throws(
        function() {
            getUrlParameter('http://example.com?id=sometext', 'id', 'int');
        },
        Error,
        'should throw an error when the required parameter is the wrong type'
    );

    t.equal(
        getUrlParameter('http://example.com?id=1', 'id', 'int'),
        1,
        'should return the parameter as an int'
    );

    t.equal(
        getUrlParameter('http://example.com?msg=hello', 'msg'),
        'hello',
        'should return the parameter as a string'
    );

    t.end();
});
