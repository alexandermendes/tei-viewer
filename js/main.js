import editor from './view/editor';
import tableView from './view/table';
import upload from './view/upload';
import notify from './view/notify';
import docs from './view/docs';
import landing from './view/landing';

import checkHTML5 from './utils/check-html5';

try {
    checkHTML5();
} catch(err) {
    notify(err.message, 'error');
    throw err;
}

Pace.on('done', function() {
    editor.refresh();
});
