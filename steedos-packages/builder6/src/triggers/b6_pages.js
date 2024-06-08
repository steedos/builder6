export const pagesBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_pages', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc} = ctx.params;
        this.broker.logger.info('b6_pages', ctx)

        if (doc.type === 'jsx' && doc.jsx) {
            try {
                const builder = await this.compileJsx(doc.jsx);
                doc.builder = builder;
            } catch (e) { this.broker.logger.error(e)}
        }
            
        try {
            let content = "";
            if (doc.type === 'jsx') content = doc.jsx
            if (doc.type === 'html') content = doc.html
            if (doc.type === 'amis') content = JSON.parse(doc.amis_schema)
            doc.css = await this.compileTailwind(content);
        } catch (e) { this.broker.logger.error(e)}

        return  {
            doc
        }
    }   
}