import { isMaster } from '/lib/xp/cluster';
import { publish } from '/lib/xp/content';
import { run } from '/lib/xp/context';
import { importNodes } from '/lib/xp/export';
import { create as createProject, get as getProject } from '/lib/xp/project';

const PROJECT_ID = 'siteframework';

function runAsAdmin<T>(callback: () => T): T {
  return run({
    principals: ['role:system.admin'],
    repository: `com.enonic.cms.${PROJECT_ID}`,
    branch: 'draft',
  }, callback);
}

function importContent(): void {
  const result = importNodes({
    source: resolve('/import'),
    targetNodePath: '/content',
    xslt: resolve('/import/replace_app.xsl'),
    xsltParams: { applicationId: app.name },
    includeNodeIds: true,
  });

  result.importErrors.forEach((error) => log.warning(`Import error: ${error.message}`));
  log.info(`Imported ${result.addedNodes.length} content items into project "${PROJECT_ID}"`);

  publish({ keys: ['/hello-world'] });
  log.info('Published the "Hello World" site');
}

function initialize(): void {
  if (runAsAdmin(() => getProject({ id: PROJECT_ID }))) {
    log.info(`Project "${PROJECT_ID}" already exists, skipping the content import`);
    return;
  }

  runAsAdmin(() => createProject({
    id: PROJECT_ID,
    displayName: 'Site Framework',
    description: 'Content for the Enonic Site Framework tutorial',
    publicRead: true,
  }));
  log.info(`Project "${PROJECT_ID}" created`);

  runAsAdmin(importContent);
}

if (isMaster()) {
  initialize();
}
