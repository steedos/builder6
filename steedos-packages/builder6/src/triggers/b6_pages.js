const uuid = require("uuid");
const { marked } = require("marked");


export const pagesBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_pages', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, id = uuid.v4(), isInsert} = ctx.params;

        if (isInsert) doc._id = id;

        doc.tailwind = "";

        // 生成 html
        if (doc.type === 'markdown' && doc.markdown) {
            try {
                const html = marked.parse(doc.markdown);
                // const coverHtml = doc.cover ? `<div className="relative not-prose [a:not(:first-child)>&amp;]:mt-12 [a:not(:last-child)>&amp;]:mb-12 my-12 first:mt-0 last:mb-0 rounded-2xl overflow-hidden [figure>&amp;]:my-0">
                //     <img src="${process.env.ROOT_URL}/api/files/images/${doc.cover}" alt="${doc.name}" />
                //     <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10"></div>
                // </div>`:'';

                doc.html = `
                    <div class="max-w-3xl mx-auto pt-16 pb-10 px-4">
                        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 md:text-4xl ">${doc.name}</h1>
                        <div class="prose py-10">
                            ${html}
                        </div>
                    </div>
                `
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'richtext' && doc.richtext) {
            try {
                const html = doc.richtext;
                doc.html = `<div class="prose max-w-3xl mx-auto py-10 px-4">${html}</div>`
            } catch (e) { this.broker.logger.error(e)}
        }


        if (doc.type === 'chatbot' && doc.chatbot_id) {
            try {
                doc.html = `
<style>
.builder-component.builder-component-${id} .builder-custom-code {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    min-height:600px;
    height: 100%;
    width: 100%;
}
.builder-component.builder-component-${id} .chatbot-iframe {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    min-height:600px;
    height: 100%;
    width: 100%;
}
</style>
<iframe src="${process.env.B6_FRONTEND_URL}/chatbots/${doc.chatbot_id}" class="chatbot-iframe"></iframe>
`
            } catch (e) { this.broker.logger.error(e)}
        }

        // 生成 tailwind
        try {
            let content = "";
            if (doc.type === 'jsx') {content = doc.jsx;}
            if (doc.type === 'html') {content = doc.html;}
            if (doc.type === 'markdown') {content = doc.html;}
            if (doc.type === 'richtext') {content = doc.html;}
            if (doc.type === 'chatbot') {content = doc.html;}
            if (doc.type === 'amis') {content = JSON.parse(doc.amis_schema);}
            if (doc.type === 'liquid') {content = doc.liquid_template}
            doc.tailwind = await this.compileTailwind(content, id);
        } catch (e) { this.broker.logger.error(e)}

        // 生成 builder block
        if (
            (doc.type === 'html' && doc.html) ||
            (doc.type === 'markdown' && doc.markdown) ||
            (doc.type === 'richtext' && doc.richtext)||
            (doc.type === 'chatbot' && doc.chatbot_id)
        ){
            try {
                const builder = await this.compileHtml(doc.html, doc.tailwind, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'jsx' && doc.jsx) {
            try {
                const builder = await this.compileJsx(doc, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }

        if (doc.type === 'amis' && doc.amis_schema) {
            try {
                const builder = await this.compileAmis(doc, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }
        
        if (doc.type === 'liquid' && doc.liquid_template){
            try {
                const builder = await this.compileLiquid(doc, id);
                doc.builder = JSON.stringify(builder);
            } catch (e) { this.broker.logger.error(e)}
        }


        return  {
            doc
        }
    }   
}
