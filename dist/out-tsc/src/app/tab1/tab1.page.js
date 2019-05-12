import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
var Tab1Page = /** @class */ (function () {
    function Tab1Page(database, nativeStorage) {
        this.database = database;
        this.nativeStorage = nativeStorage;
        this.nativeStorage.setItem('myitem', { property: 'value', anotherProperty: 'anotherValue' })
            .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
        this.nativeStorage.getItem('myitem')
            .then(function (data) { return console.log(data); }, function (error) { return console.error(error); });
    }
    Tab1Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab1',
            templateUrl: 'tab1.page.html',
            styleUrls: ['tab1.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [DatabaseService,
            NativeStorage])
    ], Tab1Page);
    return Tab1Page;
}());
export { Tab1Page };
//# sourceMappingURL=tab1.page.js.map