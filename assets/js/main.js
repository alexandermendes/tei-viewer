import loading from './loading';
import notify from './notify';
import parseURL from './parse-url';
import html5Check from './html5-check';
import dbServer from './db-server';
import editor from './editor';
import xml from './xml';
import nav from './nav';

import tableView from './view/table';
import uploadView from './view/upload';


window.onload = function() {
    window.setTimeout(loading.hide, 500);
}