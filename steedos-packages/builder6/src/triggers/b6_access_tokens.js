const uuid = require("uuid");

export const tokensBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_access_tokens', 
        when: ['beforeInsert']
    },
    async handler(ctx) {
        const {doc, isInsert} = ctx.params;

        if (isInsert) {
            const token  = 'ak-' + uuid.v4();
            doc.token = token;
            doc._id = token;
        }

        return  {
            doc
        }
    }   
}
