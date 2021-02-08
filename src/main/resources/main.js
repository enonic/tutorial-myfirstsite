const contextLib = require('/lib/xp/context');
const clusterLib = require('/lib/xp/cluster');

function runInContext(callback) {
    let result;
    try {
        result = contextLib.run({
            principals: ["role:system.admin"]
        }, callback);
    } catch (e) {
        log.info('Error: ' + e.message);
    }

    return result;
}


function createContent() {
    const bean = __.newBean('com.enonic.xp.demo.initializer.DemoInitializer');
    return __.toNativeObject(bean.execute());
}

if (clusterLib.isMaster()) {
    runInContext(createContent);
}
