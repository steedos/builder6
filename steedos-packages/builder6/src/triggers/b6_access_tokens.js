const uuid = require("uuid");

export const tokensBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_access_tokens', 
        when: ['beforeInsert']
    },
    async handler(ctx) {
        const {doc, id  = 'ak-' + uuid.v4(), isInsert} = ctx.params;

        if (isInsert) doc.token = id;

        return  {
            doc
        }
    }   
}
