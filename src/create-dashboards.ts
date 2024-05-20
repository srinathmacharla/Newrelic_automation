import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

// Widget interface
interface Widget {
title: string;
layout: { column: number; row: number; width: number; height: number };
linkedEntityGuids: null;
visualization: { id: string };
rawConfiguration: {
nrqlQueries?: { accountIds: number[]; query: string | string[] }[];
platformOptions?: { ignoreTimeRange: boolean };
facet?: { showOtherSeries: boolean };
thresholds? : {
alertSeverity : string [], value : number[] | string[]
}[];
text?: string;
};
}

// Page interface
interface Page {
name: string;
description: null;
widgets: Widget[];
}

// Dashboard interface
interface Dashboard {
name: string;
description: null;
permissions: string;
pages: Page[];
}

function parameteriseQueries(widgetConfig: any, tags: any): void {
const regex = /\$\{tags\.(\w+)\}/g;
widgetConfig.forEach((widget: any) => {
if (typeof widget.query === 'string') {
widget.query = widget.query.replace(regex, (match: any, key: string) => {
if (key in tags) {
return tags[key];
} else {
return match;
}
});
} else if (Array.isArray(widget.query)) {
widget.query = widget.query.map((query: string) => {
return query.replace(regex, (match, key) => {
if (key in tags) {
return tags[key];
} else {
return match;
}
});
});
}
});

}

function generateWidget(component: string, newrelicConfig: any): Widget[] {
const widgets: Widget[] = [];
const toLower = component.toLowerCase();
const widgetConfigFilePath = path.join('resources/widgets', `${toLower.replace(/\s/g, '_')}.yaml`);
if (fs.existsSync(widgetConfigFilePath)) {
const widgetConfig = yaml.load(fs.readFileSync(widgetConfigFilePath, 'utf8')) as any[];
parameteriseQueries(widgetConfig, newrelicConfig.tags);
widgetConfig.forEach((widget: any) => {
if (widget.query) {
let rawConfiguration:any;
if (widget.visualization === 'viz.line') {
let thresholds: any;
// For viz.line visualization
                    if (widget.thresholds) {
if (widget.thresholds) {
thresholds = {
isLabelVisible:true,
thresholds: widget.thresholds.map((threshold: any) => ({
from: threshold.from,
name: threshold.name,
severity: threshold.severity.toLowerCase(),
to: threshold.to
}))
}
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
} else {
let thresholds= [];
// For viz.billboard visualization
                    if (widget.thresholds) {
thresholds.push(
...(widget.thresholds.map((threshold: any) => ({
alertSeverity: threshold.alertSeverity,
value: threshold.value
})))
);
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

const newWidget: Widget = {
title: widget.name,
layout: { column: widget.layout.column, row: widget.layout.row, width: widget.layout.width, height: widget.layout.height },
linkedEntityGuids: null,
visualization: { id: widget.visualization },
rawConfiguration
};

widgets.push(newWidget);
} else {
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


function generateDashboard(service: any, newrelicConfig: any): Dashboard {
const dashboard: Dashboard = {
name: service.name,
description: service.description,
permissions: service.permissions,
pages: []
};
service.components.forEach((component: any) => {
const page: Page = {
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
    configFiles.forEach((file: any) => {
// read config yaml as object and map
    const config = yaml.load(fs.readFileSync('resources/config/'+file, 'utf8'));
const map = new Map(Object.entries(config));
// parse list of services where each service will be it's own dashboard
        const servicesConfig = map.get('services')
// parse newrelic environment variables
        const newrelicConfig = map.get('newrelic').at(0)
servicesConfig.forEach((service: any) => {
const dashboard = generateDashboard(service, newrelicConfig);
// write dashboard json to /resource/dashboards folder
            fs.writeFileSync('resources/dashboards/'+service.name.replace(" ","_")+'.json', JSON.stringify(dashboard, null, 2));
console.log(service.name+' Dashboard JSON file generated successfully.');
});
});

} catch (error) {
console.error('Error:', error);
}
