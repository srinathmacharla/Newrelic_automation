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
        nrqlQueries: { accountIds: number[]; query: string | string[] }[];
        platformOptions: { ignoreTimeRange: boolean };
        facet: { showOtherSeries: boolean };
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

const dashboardPath = '../newrelic_terraform/dashboard.json';
const yamlFolderPath = '../dashboard-yaml';
const yamlPath = '../resources/file.yaml';
const envPath = '../resources/env_variable.yaml'; 

function replaceServiceAppNameInQueries(yamlData: any, envData: any): void {
    const regex = /\$\{service\.(\w+)\}/g;
    yamlData.forEach((item: any) => {
        if (typeof item.query === 'string') {
            item.query = item.query.replace(regex, (match: any, key: string) => {
                if (key in envData) {
                    return envData[key];
                } else {
                    return match;
                }
            });
        } else if (Array.isArray(item.query)) {
            item.query = item.query.map((query: string) => {
                return query.replace(regex, (match, key) => {
                    if (key in envData) {
                        return envData[key];
                    } else {
                        return match;
                    }
                });
            });
        }
    });
}

function generateWidget(componentName: string, yamlFolderPath: string, envData: any): Widget[] {
    const widgets: Widget[] = [];
    const converToCapital = componentName.toLowerCase();
    const yamlFileName = `${converToCapital.replace(/\s/g, '_')}.yaml`;
    const yamlFilePath = path.join(yamlFolderPath, yamlFileName);
    if (fs.existsSync(yamlFilePath)) {
        const yamlData = yaml.load(fs.readFileSync(yamlFilePath, 'utf8')) as any[];
        replaceServiceAppNameInQueries(yamlData, envData);
        yamlData.forEach((item: any) => {
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

function generateDashboard(yamlData: any, envData: any): Dashboard {
    const dashboard: Dashboard = {
        name: yamlData.ServiceName,
        description: null,
        permissions: 'PUBLIC_READ_WRITE',
        pages: []
    };
    yamlData.Componentlist.forEach((component: any) => {
        const page: Page = {
            name: component.componentName,
            description: null,
            widgets: generateWidget(component.componentName, yamlFolderPath, envData)
        };
        dashboard.pages.push(page);
    });

    return dashboard;
}

try {
    const yamlData = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    const envData = yaml.load(fs.readFileSync(envPath, 'utf8'));
    const dashboard = generateDashboard(yamlData, envData);
    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
    console.log('Dashboard JSON file generated successfully.');
} catch (error) {
    console.error('Error:', error);
}
