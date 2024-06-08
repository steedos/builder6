export const pagesBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_pages', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        this.broker.logger.info('b6_pages', ctx)
    }   
}