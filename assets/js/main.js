import dbServer from './model/db-server';

import parseURL from './utils/get-url-parameter';
import checkHTML5 from './utils/check-html5';
import exportXML from './utils/export-xml';
import transformer from './utils/transformer';

import nav from './view/nav';
import loading from './view/loading';
import editorView from './view/editor';
import tableView from './view/table';
import uploadView from './view/upload';
import notify from './view/notify';

try {
    checkHTML5();
} catch(err) {
    notify(err.message, 'error');
}
