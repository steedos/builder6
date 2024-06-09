const uuid = require("uuid");

export const componentBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_components', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, id  = uuid.v4(), isInsert} = ctx.params;
        this.broker.logger.info('b6_components', ctx)

        
        if (isInsert) doc._id = id;
        console.log(doc)

        try {
            let content = "";
            if (doc.type === 'jsx') {content = doc.jsx;}
            if (doc.type === 'html') {content = doc.html;}
            if (doc.type === 'amis') {content = JSON.parse(doc.amis_schema);}
            doc.tailwind = await this.compileTailwind(content, id);
        } catch (e) { this.broker.logger.error(e)}

        if (doc.type === 'jsx' && doc.jsx) {
            try {
                const builder = await this.compileJsx(doc);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'html' && doc.html) {
            try {
                const builder = await this.compileHtml(doc);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'amis' && doc.amis_schema) {
            try {
                const builder = await this.compileAmis(doc);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        return  {
            doc
        }
    }   
}
