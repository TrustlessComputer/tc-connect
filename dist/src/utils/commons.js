"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueID = exports.sleep = void 0;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const generateUniqueID = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
};
exports.generateUniqueID = generateUniqueID;
//# sourceMappingURL=commons.js.map