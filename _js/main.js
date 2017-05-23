import './view/table';
import './view/upload';
import './view/docs';
import './view/landing';
import checkHTML5 from './utils/check-html5';
import notify from './view/notify';

try {
    checkHTML5();
} catch(err) {
    notify(err.message, 'error');
    throw err;
}