const uuid = require("uuid");

export const pagesBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_pages', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, id = uuid.v4(), isInsert} = ctx.params;

        if (isInsert) doc._id = id;

        try {
            let content = "";
            if (doc.type === 'jsx') {content = doc.jsx;}
            if (doc.type === 'html') {content = doc.html;}
            if (doc.type === 'richtext') {content = `<div class="prose max-w-3xl mx-auto py-10 px-4">${doc.richtext}</div>`;}
            if (doc.type === 'amis') {content = JSON.parse(doc.amis_schema);}
            doc.tailwind = await this.compileTailwind(content, id);
        } catch (e) { this.broker.logger.error(e)}

        if (doc.type === 'jsx' && doc.jsx) {
            try {
                const builder = await this.compileJsx(doc, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'html' && doc.html) {
            try {
                const builder = await this.compileHtml(doc.html, doc.tailwind, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'richtext' && doc.richtext) {
            try {
                const builder = await this.compileHtml(`<div class="prose max-w-3xl mx-auto py-10 px-4">${doc.richtext}</div>`, doc.tailwind, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'amis' && doc.amis_schema) {
            try {
                const builder = await this.compileAmis(doc, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'chatbot' && doc.chatbot_id) {
            try {
                doc.html = `
<style>
.builder-custom-code {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    min-height:600px;
    height: 100%;
    width: 100%;
}
.chatbot-iframe {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    min-height:600px;
    height: 100%;
    width: 100%;
}
</style>
<iframe src="${process.env.B6_FRONTEND_URL}/chatbots/${doc.chatbot_id}"
        class="chatbot-iframe"></iframe>
                `
                doc.tailwind = "";
                const builder = await this.compileHtml(doc.html, doc.tailwind, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }


        return  {
            doc
        }
    }   
}
