import PNotify from 'pnotify';
import 'pnotify/src/pnotify.buttons';
import 'pnotify/src/pnotify.mobile';

/*
 * Display a notification.
 */
const notify = function(msg, type) {

    const opts = {
        title: type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Info',
        text: msg,
        type: type || 'info',
        hide : false,
        buttons: {
            closer: true,
            sticker: false
        }
    };

    switch (type) {
        case "error":
        case "warning":
            opts.icon = 'fa fa-exclamation-circle';
            break;
        case "success":
            opts.icon = 'fa fa-thumbs-up';
            opts.delay = 2500;
            opts.hide = true;
            break;
        default:
            opts.icon = 'fa fa-info-circle';
            opts.delay = 2500;
            opts.hide = true;
            break;
    }

    return new PNotify(opts);
};

export default notify;