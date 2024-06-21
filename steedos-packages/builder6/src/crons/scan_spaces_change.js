module.exports = {
    name: "JobScanSpacesChange",
    cronTime: process.env.B6_CRON_TIME || '*/10 * * * *',
    onTick: async function jobScanSpacesChange() {
        const scan = await this.call('objectql.findOne', { objectName: 'b6_scan_object_record', id: 'id_spaces' });
    
        const filter = scan && scan.last_scan_modified ? [['modified', '>=', new Date(scan.last_scan_modified)]] : [];
    
        const changes = await this.call('objectql.find', { objectName: 'spaces', query: { filter } });
    
        let lastScanModified = new Date();
        for (const record of changes) {
            this.call('@steedos/builder6.addSendDataToCloudQueue', {
                baseName: process.env.B6_CLOUD_PROJECT_ID,
                tableName: 'spaces',
                data: record
            });
            lastScanModified = new Date(record.modified).getTime();
        }
    
        const doc = { last_scan_modified: lastScanModified, modified: new Date() };
        const action = scan ? 'objectql.update' : 'objectql.insert';
        this.call(action, { objectName: 'b6_scan_object_record', id: 'id_spaces', doc });
    }
}