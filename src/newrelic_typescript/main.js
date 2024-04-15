"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yaml = require("js-yaml");
var path = require("path");
var dashboardPath = '../newrelic_terraform/dashboard.json';
var yamlFolderPath = '../dashboard-yaml';
var yamlPath = 'http://localhost:8080/job/newrelic';
var envPath = '../resources/env_variable.yaml';
function replaceServiceAppNameInQueries(yamlData, envData) {
    var regex = /\$\{service\.(\w+)\}/g;
    yamlData.forEach(function (item) {
        if (typeof item.query === 'string') {
            item.query = item.query.replace(regex, function (match, key) {
                if (key in envData) {
                    return envData[key];
                }
                else {
                    return match;
                }
            });
        }
        else if (Array.isArray(item.query)) {
            item.query = item.query.map(function (query) {
                return query.replace(regex, function (match, key) {
                    if (key in envData) {
                        return envData[key];
                    }
                    else {
                        return match;
                    }
                });
            });
        }
    });
}
function generateWidget(componentName, yamlFolderPath, envData) {
    var widgets = [];
    var converToCapital = componentName.toLowerCase();
    var yamlFileName = "".concat(converToCapital.replace(/\s/g, '_'), ".yaml");
    var yamlFilePath = path.join(yamlFolderPath, yamlFileName);
    if (fs.existsSync(yamlFilePath)) {
        var yamlData = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
        replaceServiceAppNameInQueries(yamlData, envData);
        yamlData.forEach(function (item) {
            widgets.push({
                title: item.name,
                layout: { column: 0, row: 0, width: 3, height: 4 },
                linkedEntityGuids: null,
                visualization: { id: 'viz.billboard' },
                rawConfiguration: {
                    nrqlQueries: [
                        {
                            accountIds: [4339676],
                            query: item.query
                        }
                    ],
                    platformOptions: { ignoreTimeRange: false },
                    facet: { showOtherSeries: false }
                }
            });
        });
    }
    return widgets;
}
function generateDashboard(yamlData, envData) {
    var dashboard = {
        name: yamlData.ServiceName,
        description: null,
        permissions: 'PUBLIC_READ_WRITE',
        pages: []
    };
    yamlData.Componentlist.forEach(function (component) {
        var page = {
            name: component.componentName,
            description: null,
            widgets: generateWidget(component.componentName, yamlFolderPath, envData)
        };
        dashboard.pages.push(page);
    });
    return dashboard;
}
try {
    var yamlData = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    var envData = yaml.load(fs.readFileSync(envPath, 'utf8'));
    var dashboard = generateDashboard(yamlData, envData);
    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
    console.log('Dashboard JSON file generated successfully.');
}
catch (error) {
    console.error('Error:', error);
}
