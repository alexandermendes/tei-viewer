import checkHTML5 from './utils/check-html5';

import nav from './view/nav';
import editor from './view/editor';
import table from './view/table';
import upload from './view/upload';
import notify from './view/notify';

// HTML5 check
try {
    checkHTML5();
} catch(err) {
    notify(err.message, 'error');
    throw err;
}

// Show page once loaded
Pace.on('done', function() {
    $("nav, main, footer").css('visibility', 'visible');
    $("nav, footer").addClass('animated slideInLeft');
    $("main").addClass('animated slideInRight');
    editor.refresh();
});