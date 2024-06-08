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
            doc.css = await this.compileTailwind(doc.jsx);
        } catch (e) { this.broker.logger.error(e)}

        return  {
            doc
        }
    }   
}