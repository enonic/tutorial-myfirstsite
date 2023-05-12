const projectLib = require('/lib/xp/project');
const contextLib = require('/lib/xp/context');
const clusterLib = require('/lib/xp/cluster');
const exportLib = require('/lib/xp/export');

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
            repository: 'com.enonic.cms.' + projectData.id
        }, callback);
    } catch (e) {
        log.info('Error: ' + e.message);
    }

    return result;
}

function createProject() {
    return projectLib.create(projectData);
}

function getProject() {
    return projectLib.get({
        id: projectData.id
    });
}

function initializeProject() {
    let project = runInContext(getProject);

    if (!project) {
        log.info('Project "' + projectData.id + '" not found. Creating...');
        project = runInContext(createProject);

        if (project) {
            log.info('Project "' + projectData.id + '" successfully created');

            log.info('Importing "' + projectData.id + '" data');
            runInContext(createContent);
        } else {
            log.error('Project "' + projectData.id + '" failed to import');
        }
    }
}

function createContent() {
    let importNodes = exportLib.importNodes({
        source: resolve('/import'),
        targetNodePath: '/content',
        xslt: resolve('/import/replace_app.xsl'),
        xsltParams: {
            applicationId: app.name
        },
        includeNodeIds: true
    });
    if (importNodes.importErrors.length > 0) {
        log.warning('Errors:');
        importNodes.importErrors.forEach(element => log.warning(element.message));
    }
}

if (clusterLib.isMaster()) {
    initializeProject();
}
