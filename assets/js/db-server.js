window.dbServer = undefined;

db.open({
    server: 'tei-viewer',
    version: 3,
    schema: {
        tei: {
            key: {keyPath: 'id', autoIncrement: true}
        }
    }
}).then(function(server) {
    window.dbServer = server;
}).catch(function (err) {
    notify(err.message, 'error');
    throw err;
});

export default window.dbServer;