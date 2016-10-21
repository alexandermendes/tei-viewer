import editor from './view/editor';
import table from './view/table';
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
    $("[data-animate-in]").each(function() {
        $(this).addClass('animated ' + $(this).data('animate-in'));
        $(this).removeClass('invisible');
    });
    editor.refresh();
});

$('.animate-out').on('click', function(evt) {
    var url = $(this).attr("href");
    $("[data-animate-out]").each(function() {
        $(this).addClass('animated ' + $(this).data('animate-out'));
    });
    setTimeout(function() {
        window.location = url;
    }, 1000);
    evt.preventDefault();
});
