import notify from '../view/notify';
import TEIDropzone from '../utils/tei-dropzone';

let upload;

/** Start the upload. */
$("#start-upload").on('click', function(evt) {
    const dz     =  TEIDropzone.forElement("#upload-form"),
          nFiles = dz.getFilesWithStatus(TEIDropzone.ADDED).length;
    if (nFiles > 0) {
        dz.enqueueFiles(dz.getFilesWithStatus(TEIDropzone.ADDED));
    } else {
        notify('Please choose some files to upload!', 'info');
    }
    evt.preventDefault();
});

if($('#upload-view').length) {
    const previewNode = document.querySelector("#template");
    previewNode.id = "";
    const previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    let addButtons = [];
    $('.add-files').each(function(){
        addButtons.push($(this)[0]);
    });

    $('.add-files').on('click', function(evt) {
        evt.preventDefault();
    });

    let dz = new TEIDropzone("#upload-form", {
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
        const nErrors = dz.files.filter(function(el) {
            return el.status == "error";
        }).length;
        const baseurl = $('#base-url').data('baseurl');

        if (nErrors > 0) {
            $('#total-progress').attr('value', 0);
            notify(nErrors + ' file' + (nErrors == 1 ? '' : 's') +
                   ' could not be uploaded, please correct the errors' +
                   ' and try again', 'warning');

            // Remove successfully uploaded files
            const success = dz.files.filter(function(el) {
                return el.status == "success";
            });
            for (let f in success) {
                dz.removeFile(f);
            }
        } else {
            window.location.href = `${baseurl}/tables`;
        }
    });

    /** Hide form when a file is added. */
    dz.on("addedfile", function() {
        $("#upload-form").hide();
    });

    /** Update progress. */
    dz.on("updateprogress", function() {
        const total     = dz.files.length,
              processed = total - dz.getActiveFiles().length,
              progress  = (100 * processed) / total;
        $('#total-progress').attr('value', progress);
    });
}

export default upload;