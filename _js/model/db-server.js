import db from 'db.js';


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
        return new Promise((resolve, reject)  => {
            if (this.server !== null) {
                resolve();
            }
            db.open(this.options).then((server) => {
                this.server = server;
                resolve();
            }).catch(function(err) {
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
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.add(data);
            }).then(function() {
                resolve();
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Return a record.
     */
    get(id) {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.get(id);
            }).then(function(record) {
                if (typeof record === 'undefined') {
                    reject(new Error('Record not found'));
                }
                resolve(record);
            }).catch(function(err) {
                reject(err);
            });
        });
    }


    /**
     * Update a record.
     */
    update(record) {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.update(record);
            }).then(function(record) {
                resolve(record);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Update multiple records.
     */
    updateAll(records) {
        let updatePromises = [];
        return new Promise((resolve, reject)  => {
            for (let r of records) {
                updatePromises.push(this.update(r));
            }
            resolve(Promise.all(updatePromises));
        });
    }

    /**
     * Return all records.
     */
    getAll() {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.query().all().execute();
            }).then(function(records) {
                resolve(records);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Remove a record.
     */
    remove(id) {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.remove(id);
            }).then(function(record) {
                if (typeof record === 'undefined') {
                    reject(new Error('Record not found'));
                }
                resolve(record);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Clear all records.
     */
    clear(id) {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.clear();
            }).then(function(record) {
                resolve(record);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    /**
     * Count records.
     */
    count(id) {
        return new Promise((resolve, reject)  => {
            this.connect().then(() => {
                return this.server.tei.count();
            }).then(function(n) {
                resolve(n);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

}

export default new DBServer();