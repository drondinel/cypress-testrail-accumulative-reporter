"use strict";
var globalRunId = null;
var testId = null;
Object.defineProperty(exports, "__esModule", {value: true});
var axios = require('axios');
var chalk = require('chalk');
var TestRail = /** @class */ (function () {
    function TestRail(options) {
        this.options = options;
        this.base = "https://" + options.domain + "/index.php?/api/v2";
    }

    TestRail.prototype.createRun = function (name, description) {
        if (globalRunId == null) {
            var _this = this;
            axios({
                method: 'post',
                url: this.base + "/add_run/" + this.options.projectId,
                headers: {'Content-Type': 'application/json'},
                auth: {
                    username: this.options.username,
                    password: this.options.password,
                },
                data: JSON.stringify({
                    suite_id: this.options.suiteId,
                    name: name,
                    description: description,
                    include_all: true,
                }),
            })
                .then(function (response) {
                    _this.runId = response.data.id;
                    globalRunId = response.data.id
                })
                .catch(function (error) {
                    return console.error(error);
                });
        };
    };
    TestRail.prototype.deleteRun = function () {
        axios({
            method: 'post',
            url: this.base + "/delete_run/" + globalRunId,
            headers: {'Content-Type': 'application/json'},
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
        }).catch(function (error) {
            return console.error(error);
        });
    };
    TestRail.prototype.publishResults = function (results) {
        var _this = this;
        axios({
            method: 'post',
            url: this.base + "/add_results_for_cases/" + globalRunId,
            headers: {'Content-Type': 'application/json'},
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({results: results}),
        })
            .then(function (response) {
                console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                console.log('\n', " - Results are published to " + chalk.magenta("https://" + _this.options.domain + "/index.php?/runs/view/" + globalRunId), '\n');
                for (let index = 0; index < response.data.length; index++) {
                    if (results[index].custom_comment) {
                        testId = response.data[index].id;
                        const filesFolder = './cypress/screenshots/' + results[index].custom_path_files;
                        fs.readdirSync(filesFolder).forEach(file => {
                            var screenshotPath = path.parse(filesFolder + file);
                            let formData = new FormData();
                            formData.append('attachment', fs.createReadStream(screenshotPath.dir + "/" + screenshotPath.base));
                            axios.post(_this.base + "/add_attachment_to_result/" + testId, formData, { headers: formData.getHeaders(), auth: {
                                username: _this.options.username,
                                password: _this.options.password,
                            }});
                        });
                    }
                }
            })
            .catch(function (error) {
                return console.error(error);
            });
    };
    return TestRail;
}());
exports.TestRail = TestRail;
//# sourceMappingURL=testrail.js.map