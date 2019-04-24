"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function Controller(path) {
    return function (constructor) {
        return (function (_super) {
            tslib_1.__extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.controllerBasePath = '/' + path;
                return _this;
            }
            return class_1;
        }(constructor));
    };
}
exports.Controller = Controller;
//# sourceMappingURL=ClassDecorators.js.map