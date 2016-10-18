import dbServer from '../model/db-server';
import notify from '../view/notify';
import TEIDropzone from '../utils/tei-dropzone';

var upload;

/** Start the upload. */
$("#start-upload").on('click', function(evt) {
    let nFiles = dz.getFilesWithStatus(Dropzone.ADDED).length;
    if (nFiles > 0) {
        dz.enqueueFiles(dz.getFilesWithStatus(Dropzone.ADDED));
    } else {
        notify('Please choose some files to upload!', 'info');
    }
    evt.preventDefault();
});

if($('#upload-view').length) {
    var previewNode = document.querySelector("#template");
    previewNode.id = "";
    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    var addButtons = [];
    $('.add-files').each(function(){
        addButtons.push($(this)[0]);
    });

    $('.add-files').on('click', function(evt) {
        evt.preventDefault();
    });

    var dz = new TEIDropzone("#upload-form", {
        url: '/upload',
        acceptedFiles: 'text/xml',
        createImageThumbnails: false,
        accept: function(file, done) {
            if (file.type !== 'text/xml') {
                done('Invalid XML file');
            }
            done();
        },
        clickable: addButtons,
        autoQueue: false,
        previewsContainer: "#previews",
        previewTemplate: previewTemplate,
        parallelUploads: 1
    });

    /** Handle completed upload. */
    dz.on("queuecomplete", function() {
        var nErrors = dz.files.filter(function(el) {
            return el.status == "error";
        }).length;

        if (nErrors > 0) {
            $('#total-progress').attr('value', 0);
            notify(nErrors + ' file' + (nErrors == 1 ? '' : 's') +
                   ' could not be uploaded, please correct the errors' +
                   ' and try again', 'warning');

            // Remove successfully uploaded files
            var success = dz.files.filter(function(el) {
                return el.status == "success";
            });
            for (var i = 0; i < success.length; i++) {
                dz.removeFile(success[i]);
            }
        } else {
            window.location.href = '/';
        }
    });

    /** Hide form when a file is added. */
    dz.on("addedfile", function(file) {
        $("#upload-form").hide();
    });

    /** Update progress. */
    dz.on("updateprogress", function() {
        var total     = dz.files.length,
            processed = total - dz.getActiveFiles().length,
            progress  = (100 * processed) / total;
        $('#total-progress').attr('value', progress);
    });
}

export default upload;