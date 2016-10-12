window.notify = function(msg, type, timeout=0) {

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
            opts.delay = 2500;
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
            opts.delay = 2500;
            opts.hide = true;
            break;
    }

    setTimeout(function() {
        var notice = new PNotify(opts);
        notice.get().click(function(){
            notice.remove();
        });
    }, timeout);
};

export default notify;