import sqlite3 from 'sqlite3';

export class Database {
    db: sqlite3.Database;

    constructor(fileName: string) {
        this.db = new sqlite3.Database(fileName);
    }

    run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              console.log('Error running sql ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve({ id: this.lastID })
            }
          })
        })
      }

    // createTable() {
    //     const sql = `
    //     CREATE TABLE IF NOT EXISTS projects (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         name TEXT)`
    //     return this.db.run(sql)
    // }
}
