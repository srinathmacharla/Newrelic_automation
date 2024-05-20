"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yaml = require("js-yaml");
var path = require("path");
function parameteriseQueries(widgetConfig, tags) {
    var regex = /\$\{tags\.(\w+)\}/g;
    widgetConfig.forEach(function (widget) {
        if (typeof widget.query === 'string') {
            widget.query = widget.query.replace(regex, function (match, key) {
                if (key in tags) {
                    return tags[key];
                }
                else {
                    return match;
                }
            });
        }
        else if (Array.isArray(widget.query)) {
            widget.query = widget.query.map(function (query) {
                return query.replace(regex, function (match, key) {
                    if (key in tags) {
                        return tags[key];
                    }
                    else {
                        return match;
                    }
                });
            });
        }
    });
}
function generateWidget(component, newrelicConfig) {
    var widgets = [];
    var toLower = component.toLowerCase();
    var widgetConfigFilePath = path.join('resources/widgets', "".concat(toLower.replace(/\s/g, '_'), ".yaml"));
    if (fs.existsSync(widgetConfigFilePath)) {
        var widgetConfig = yaml.load(fs.readFileSync(widgetConfigFilePath, 'utf8'));
        parameteriseQueries(widgetConfig, newrelicConfig.tags);
        widgetConfig.forEach(function (widget) {
            if (widget.query) {
                var rawConfiguration = void 0;
                if (widget.visualization === 'viz.line') {
                    var thresholds = void 0;
                    // For viz.line visualization
                    if (widget.thresholds) {
                        if (widget.thresholds) {
                            thresholds = {
                                isLabelVisible: true,
                                thresholds: widget.thresholds.map(function (threshold) { return ({
                                    from: threshold.from,
                                    name: threshold.name,
                                    severity: threshold.severity.toLowerCase(),
                                    to: threshold.to
                                }); })
                            };
                        }
                    }
                    rawConfiguration = {
                        nrqlQueries: [{
                                accountIds: [newrelicConfig.account],
                                query: widget.query
                            }],
                        platformOptions: { ignoreTimeRange: false },
                        facet: { showOtherSeries: false },
                        thresholds: thresholds
                    };
                    // Additional configurations for viz.line visualization
                    if (widget.visualization === 'viz.line') {
                        rawConfiguration.legend = { enabled: true };
                        rawConfiguration.yAxisLeft = { zero: true };
                        rawConfiguration.yAxisRight = { zero: true };
                    }
                }
                else {
                    var thresholds = [];
                    // For viz.billboard visualization
                    if (widget.thresholds) {
                        thresholds.push.apply(thresholds, (widget.thresholds.map(function (threshold) { return ({
                            alertSeverity: threshold.alertSeverity,
                            value: threshold.value
                        }); })));
                    }
                    rawConfiguration = {
                        nrqlQueries: [{
                                accountIds: [newrelicConfig.account],
                                query: widget.query
                            }],
                        platformOptions: { ignoreTimeRange: false },
                        facet: { showOtherSeries: false },
                        thresholds: thresholds
                    };
                }
                var newWidget = {
                    title: widget.name,
                    layout: { column: widget.layout.column, row: widget.layout.row, width: widget.layout.width, height: widget.layout.height },
                    linkedEntityGuids: null,
                    visualization: { id: widget.visualization },
                    rawConfiguration: rawConfiguration
                };
                widgets.push(newWidget);
            }
            else {
                widgets.push({
                    title: widget.name,
                    layout: { column: widget.layout.column, row: widget.layout.row, width: widget.layout.width, height: widget.layout.height },
                    linkedEntityGuids: null,
                    visualization: { id: widget.visualization },
                    rawConfiguration: {
                        text: widget.text // Set text directly
                    }
                });
            }
        });
    }
    return widgets;
}
function generateDashboard(service, newrelicConfig) {
    var dashboard = {
        name: service.name,
        description: service.description,
        permissions: service.permissions,
        pages: []
    };
    service.components.forEach(function (component) {
        var page = {
            name: component,
            description: null,
            widgets: generateWidget(component, newrelicConfig)
        };
        dashboard.pages.push(page);
    });
    return dashboard;
}
try {
    // list all files in config dir - where each YAML represents a group of dashboards and services to apply
    var configFiles = fs.readdirSync('resources/config/');
    // for each config file generate multiple dashboard json files
    configFiles.forEach(function (file) {
        // read config yaml as object and map
        var config = yaml.load(fs.readFileSync('resources/config/' + file, 'utf8'));
        var map = new Map(Object.entries(config));
        // parse list of services where each service will be it's own dashboard
        var servicesConfig = map.get('services');
        // parse newrelic environment variables
        var newrelicConfig = map.get('newrelic').at(0);
        servicesConfig.forEach(function (service) {
            var dashboard = generateDashboard(service, newrelicConfig);
            // write dashboard json to /resource/dashboards folder
            fs.writeFileSync('resources/dashboards/' + service.name.replace(" ", "_") + '.json', JSON.stringify(dashboard, null, 2));
            console.log(service.name + ' Dashboard JSON file generated successfully.');
        });
    });
}
catch (error) {
    console.error('Error:', error);
}
