import checkHTML5 from './utils/check-html5';
import notify from './view/notify';

try {
    checkHTML5();
} catch(err) {
    notify(err.message, 'error');
    throw err;
}

import table from './view/table';
import upload from './view/upload';
import docs from './view/docs';
import landing from './view/landing';