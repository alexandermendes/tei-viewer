window.notify = function(msg, type) {

    var opts = {
        text: msg,
        type: type,
        hide : false,
        buttons: {
            closer: true,
            sticker: false
        }
    };

    switch (type) {
        case "success":
            opts.title = 'Success';
            opts.icon = 'fa fa-thumbs-up';
            opts.delay = 3000;
            opts.hide = true;
            break;
        case "error":
            opts.title = 'Error';
            opts.icon = 'fa fa-exclamation-circle';
            break;
        case "warning":
            opts.title = 'Warning';
            opts.icon = 'fa fa-exclamation-circle';
            break;
        default:
            opts.title = 'Info';
            opts.icon = 'fa fa-info-circle';
            break;
    }

    opts.text = msg;
    new PNotify(opts);
};

export default notify;