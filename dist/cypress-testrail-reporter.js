"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var moment = require("moment");
var testrail_1 = require("./testrail");
var shared_1 = require("./shared");
var testrail_interface_1 = require("./testrail.interface");
var chalk = require('chalk');
var CypressTestRailReporter = /** @class */ (function (_super) {
    __extends(CypressTestRailReporter, _super);
    function CypressTestRailReporter(runner, options) {
        var _this = _super.call(this, runner) || this;
        _this.results = [];
        var reporterOptions = options.reporterOptions;
        
        _this.testRail = new testrail_1.TestRail(reporterOptions);
        _this.validate(reporterOptions, 'domain');
        _this.validate(reporterOptions, 'username');
        _this.validate(reporterOptions, 'password');
        _this.validate(reporterOptions, 'projectId');
        _this.validate(reporterOptions, 'suiteId');
        runner.on('start', function () {
            //var executionDateTime = moment().format('MMM Do YYYY, HH:mm (Z)');
            var executionDateTime = moment().format('YYYY/MM/DD, HH:mm (Z)');
            var name = (reporterOptions.runName || 'Automated test run') + " " + executionDateTime;
            var description = 'For the Cypress run visit https://dashboard.cypress.io/#/projects/runs';
            _this.testRail.createRun(name, description);
        });
        runner.on('pass', function (test) {
            var caseIds = shared_1.titleToCaseIds(test.title);
            var formattedTitle = test.title.replace("(example #", "(scenario #");
            if (caseIds.length > 0) {
                var results = caseIds.map(function (caseId) {
                    return {
                        case_id: caseId,
                        status_id: testrail_interface_1.Status.Passed,
                        comment: "Title: " + formattedTitle + ", Execution time: " + test.duration + "ms",
                    };
                });
                (_a = _this.results).push.apply(_a, results);
            }
            var _a;
        });
        runner.on('fail', function (test) {
            var caseIds = shared_1.titleToCaseIds(test.title);
            let locationText = test.parent.invocationDetails.absoluteFile;
            const findText = "/integration/";
            let index = locationText.indexOf(findText) + findText.length;
            let path = locationText.substring(index, locationText.length);
            var formattedTitle = test.title.replace("(example #", "(scenario #");
            if (caseIds.length > 0) {
                var results = caseIds.map(function (caseId) {
                    return {
                        case_id: caseId,
                        status_id: testrail_interface_1.Status.Failed,
                        comment: "Title: " + formattedTitle + ", " + test.err.message,
                        custom_path_files: path + "/",
                    };
                });
                (_a = _this.results).push.apply(_a, results);
            }
            var _a;
        });
        runner.on('end', function () {
            if (_this.results.length == 0) {
                console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                console.warn('\n', 'No testcases were matched. Ensure that your tests are declared correctly and matches Cxxx', '\n');
               // _this.testRail.deleteRun();
                return;
            }

            // Re ordering Test Runs with failed results at the end
            let arrayFailTests = [];
            for (let index = 0; index < _this.results.length; index++) {
                const element = _this.results[index].status_id;
                if (_this.results[index].status_id === 5) {
                    arrayFailTests.push(_this.results[index]);
                    _this.results.splice(index,1);
                }
            }
            var newArrayOrder = _this.results.concat(arrayFailTests);
            _this.testRail.publishResults(newArrayOrder);
        });
        return _this;
    }
    CypressTestRailReporter.prototype.validate = function (options, name) {
        if (options == null) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        if (options[name] == null) {
            throw new Error("Missing " + name + " value. Please update reporterOptions in cypress.json");
        }
    };
    return CypressTestRailReporter;
}(mocha_1.reporters.Spec));
exports.CypressTestRailReporter = CypressTestRailReporter;
//# sourceMappingURL=cypress-testrail-reporter.js.map