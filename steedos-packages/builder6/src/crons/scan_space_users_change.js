/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-18 16:16:31
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:49:05
 * @Description: 
 */
module.exports = {
    name: "JobScanSpaceUsersChange",
    cronTime: process.env.B6_CRON_TIME || '*/10 * * * *',
    onTick: async function jobScanSpaceUsersChange() {
        const scan = await this.call('objectql.findOne', { objectName: 'b6_scan_object_record', id: 'id_space_users' });
    
        const filter = scan && scan.last_scan_modified ? [['modified', '>=', new Date(scan.last_scan_modified)]] : [];
    
        const changes = await this.call('objectql.find', { objectName: 'space_users', query: { filter, sort: 'modified desc' } });
    
        let lastScanModified = new Date();
        for (const record of changes) {
            this.call('@steedos/builder6.addSendDataToCloudQueue', {
                baseName: process.env.B6_CLOUD_PROJECT_ID,
                tableName: 'space_users',
                data: record
            });
            lastScanModified = new Date(record.modified).getTime();
        }
    
        const doc = { last_scan_modified: lastScanModified, modified: new Date() };
        const action = scan ? 'objectql.update' : 'objectql.insert';
        this.call(action, { objectName: 'b6_scan_object_record', id: 'id_space_users', doc });
    }
}