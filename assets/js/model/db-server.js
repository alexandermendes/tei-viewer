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

}

export default new DBServer();