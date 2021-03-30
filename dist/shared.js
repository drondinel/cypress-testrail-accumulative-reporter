"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Search for all applicable test cases
 * @param title
 * @returns {any}
 */
function titleToCaseIds(title) {
    var caseIds = [];
    var testCaseIdRegExp = /\bT?C(\d+)\b/g;
    var m;
    while ((m = testCaseIdRegExp.exec(title)) !== null) {
        var caseId = parseInt(m[1]);
        caseIds.push(caseId);
    }
    return caseIds;
}

/**
 * Search for suit
 * @param title
 * @returns {any}
 */
function titleToSuiteId(title) {
    var testSuiteIdRegExp = /\bT?S(\d+)\b/g;
    var m;
    while ((m = testSuiteIdRegExp.exec(title)) !== null) {
        var suiteId = parseInt(m[1]);
    }
    return suiteId ? suiteId : null;
}

exports.titleToCaseIds = titleToCaseIds;
exports.titleToSuiteId = titleToSuiteId;
//# sourceMappingURL=shared.js.map