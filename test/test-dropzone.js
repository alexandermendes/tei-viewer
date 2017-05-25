import sinon from 'sinon';
import 'jsdom-global/register';
import test from 'tape';
import TEIDropzone from '../_js/utils/tei-dropzone';
import dbServer from '../_js/model/db-server';


test('dropzone test', function(t) {

    const dz        = new TEIDropzone(document.body, {url: "/upload"}),
          spyDbAdd  = sinon.spy(dbServer, "add"),
          spyError  = sinon.spy(dz, "_errorProcessing"),
          file      = {"name": "example.xml"},
          data      = {valid: "<?xml version='1.0'?><_/>", invalid: "_"};

    dz._save(file)({"target": {"result": data.valid }});
    dz._save(file)({"target": {"result": data.invalid }});

    t.assert(
        spyDbAdd.calledOnce,
        'only one attempt should be made to save a valid XML file'
    );

    t.equal(
        spyDbAdd.firstCall.args[0].xml,
        data.valid,
        'file should be saved with the correct XML'
    );

    t.equal(
        spyDbAdd.firstCall.args[0].filename,
        file.name,
        'file should be saved with the correct filename'
    );

    t.equal(
        spyError.firstCall.args[0][0],
        file,
        'invalid XML file should be identified'
    );

    t.end();
});
