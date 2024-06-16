module.exports = {
    "b6_chatbots_knowledge_source.update": function(payload, sender, eventName, ctx){
        const { objectApiName, id, knowledgeSource} = ctx.params;
        if(knowledgeSource){
            this.b6comChatbotKnowledgeSourceUpdate(objectApiName, id, knowledgeSource)
        }
    },
    "b6_chatbots_knowledge_source.delete": function(payload, sender, eventName, ctx){
        const { objectApiName, id, knowledgeSource} = ctx.params;
        if(knowledgeSource){
            this.b6comChatbotKnowledgeSourceDelete(objectApiName, id, knowledgeSource)
        }
    },
}