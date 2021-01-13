"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const label_1 = require("./entity/label");
const core = __importStar(require("@actions/core"));
class main {
    constructor(lable) {
        this.l = lable;
    }
    getL() {
        return this.l;
    }
}
const campfire = new label_1.Label('campfire', 'red');
const demo = new main(campfire);
const time = new Date().toTimeString();
core.setOutput('time', time);
const payload = JSON.stringify(demo.getL(), undefined, 2);
console.log(`The event payload: ${payload}`);
