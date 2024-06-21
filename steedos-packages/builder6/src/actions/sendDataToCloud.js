const BuilderJS = require("@builder6/builder6.js");

const endpointUrl = process.env.B6_CLOUD_API;//NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET;//NEXT_PUBLIC_B6_API_KEY

const bjs = new BuilderJS({ endpointUrl, apiKey })

export const sendDataToCloud = {
    queue: true,
    async handler(ctx) {
        const { baseName, tableName, data } = ctx.params;
        const base = bjs.base(baseName);
        const result = await base.table(tableName).update(data.doc._id, data.doc)
        ctx.locals.job.updateProgress(100)
        return { result, job: ctx.locals.job.id }
    }
}