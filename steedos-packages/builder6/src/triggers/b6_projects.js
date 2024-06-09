const uuid = require("uuid");

export const projectBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_projects', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, id  = uuid.v4(), isInsert} = ctx.params;

        if (isInsert) doc._id = id;

        doc.url = `https://${id}.builder6.app`;

        return  {
            doc
        }
    }   
}
