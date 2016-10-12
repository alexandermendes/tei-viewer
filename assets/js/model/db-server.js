/**
 * Database server class.
 */
class DBServer {

    /**
     * Initialise with database options.
     */
    constructor() {
        this.server = null;
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
            if (_this.server !== null) {
                resolve();
            }
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
     * Add a record.
     */
    add(data) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.connect().then(function() {
                return _this.server.tei.add(data);
            }).then(function() {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    /**
     * Return a record.
     */
    get(id) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.connect().then(function() {
                return _this.server.tei.get(id);
            }).then(function(record) {
                if (typeof record === 'undefined') {
                    reject(new Error('Record not found'));
                }
                resolve(record);
            }).catch(function (err) {
                reject(err);
            });
        });
    }


    /**
     * Update a record.
     */
    update(record) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.connect().then(function() {
                return _this.server.tei.update(record);
            }).then(function(record) {
                resolve(record);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    /**
     * Return all records.
     */
    getAll() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.connect().then(function() {
                return _this.server.tei.query().all().execute();
            }).then(function(records) {
                resolve(records);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    /**
     * Remove a record.
     */
    remove(id) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.connect().then(function() {
                return _this.server.tei.remove(id);
            }).then(function(record) {
                if (typeof record === 'undefined') {
                    reject(new Error('Record not found'));
                }
                resolve(record);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

}

export default new DBServer();