import * as projectLib from '/lib/xp/project';
import * as contextLib from '/lib/xp/context';
import * as clusterLib from '/lib/xp/cluster';
import * as exportLib from '/lib/xp/export';
import {DEBUG_MODE} from '/constants'; // Using relative, so it will be inlined (and tree-shaken).

const projectData = {
    id: 'myfirstsite',
    displayName: 'My First Site',
    description: 'Intro to building websites with the Enonic framework',
    readAccess: {
        public: true
    }
}

function runInContext(callback) {
    let result;
    try {
        result = contextLib.run({
            principals: ["role:system.admin"],
            repository: 'com.enonic.cms.' + projectData.id,
        }, callback);
    } catch (e) {
        DEBUG_MODE && log.info('Error: ' + e.message);
    }

    return result;
}

function createProject() {
    return projectLib.create(projectData);
}

function getProject() {
    return projectLib.get({ id: projectData.id });
}

function initializeProject() {
    let project = runInContext(getProject);

    if (!project) {
        DEBUG_MODE && log.info('Project "' + projectData.id + '" not found. Creating...');
        project = runInContext(createProject);

        if (project) {
            DEBUG_MODE && log.info('Project "' + projectData.id + '" successfully created');
            DEBUG_MODE && log.info('Importing "' + projectData.id + '" data');

            runInContext(createContent);
        } else {
            DEBUG_MODE && log.error('Project "' + projectData.id + '" failed to import');
        }
    }
}

function createContent() {
    const importNodes = exportLib.importNodes({
        source: resolve('/import'),
		targetNodePath: '/content',
		xslt: resolve('/import/replace_app.xsl'),
		xsltParams: { applicationId: app.name },
        includeNodeIds: true,
        nodeImported: () => {},
        nodeResolved: () => {}
    });

    if (importNodes.importErrors.length > 0) {
        DEBUG_MODE && log.warning('Errors:');
        importNodes.importErrors.forEach(element => DEBUG_MODE && log.warning(element.message));
    }
}

if (clusterLib.isMaster()) {
    initializeProject();
}

