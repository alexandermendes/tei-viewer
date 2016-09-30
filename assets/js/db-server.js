window.dbServer;

/**
 * Global DB server class.
 */
class DBServer {

    /**
     * Initialise with database options.
     */
    constructor() {
        this.server;
        this.options = {
            server: 'tei-viewer',
            version: 3,
            schema: {
                tei: {
                    key: {keyPath: 'id', autoIncrement: true}
                }
            }
        };
    }

    /**
     * Connect to the database.
     */
    connect() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            db.open(_this.options).then(function(server) {
                _this.server = server;
                resolve();
            }).catch(function (err) {
                if (err.type === 'blocked') {
                    oldConnection.close();
                    return err.resume;
                }
                reject(err);
            });
        });
    }

    /**
     * Return a record, ensuring that a connection is established first.
     */
    get(recordID) {
        var _this = this;

        function getRecord(recordID) {
            return new Promise(function(resolve, reject) {
                _this.server.tei.get(recordID).then(function(record) {
                    if (typeof record === 'undefined') {
                        reject(new Error('Record not found'));
                    }
                    resolve(record);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        return new Promise(function(resolve, reject) {
            if (typeof _this.server === 'undefined') {
                _this.connect().then(function(){
                    resolve(getRecord(recordID));
                }).catch(function (err) {
                    reject(err);
                });
            } else {
                resolve(getRecord(recordID));
            }
        });

    }


    /**
     * Update a record, ensuring that a connection is established first.
     */
    update(record) {
        var _this = this;

        function updateRecord(record) {
            return new Promise(function(resolve, reject) {
                _this.server.tei.update(record).then(function(){
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        return new Promise(function(resolve, reject) {
            if (typeof _this.server === 'undefined') {
                _this.connect().then(function(){
                    resolve(updateRecord(record));
                }).catch(function (err) {
                    reject(err);
                });
            } else {
                resolve(updateRecord(record));
            }
        });

    }
}

export default window.dbServer = new DBServer();