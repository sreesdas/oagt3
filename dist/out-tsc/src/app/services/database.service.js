import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
var DatabaseService = /** @class */ (function () {
    function DatabaseService(sqlite) {
        this.sqlite = sqlite;
        console.log("Inside constructor of Database Service");
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then(function (db) {
            db.executeSql('create table danceMoves(name VARCHAR(32))', [])
                .then(function () { return console.log('Executed SQL'); })
                .catch(function (e) { return console.log(e); });
        })
            .catch(function (e) { return console.log(e); });
    }
    DatabaseService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SQLite])
    ], DatabaseService);
    return DatabaseService;
}());
export { DatabaseService };
//# sourceMappingURL=database.service.js.map