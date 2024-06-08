const uuid = require("uuid");

export const compileHtml = async (page) => {
    const {html, tailwind, _id} = page

    if (!html) {
        return { error: "html is required" }
    }

    const blockId = _id || uuid.v4()
    const builder = {
        data: {
            cssCode: tailwind,
            blocks: [{
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                id: `builder-${blockId}`,
                component: {
                    name: "Custom Code",
                    options: {
                    code: html || "",
                    scriptsClientOnly: true
                    }
                },
                responsiveStyles: {
                    large: {
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    flexShrink: "0",
                    boxSizing: "border-box"
                    }
                }
            }]
        }
    }

    return builder;
        
}