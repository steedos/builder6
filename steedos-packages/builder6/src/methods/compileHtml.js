const uuid = require("uuid");

export const compileHtml = async (html, tailwind, id) => {

    if (!html) {
        return { error: "html is required" }
    }

    const builder = {
        id,
        data: {
            cssCode: tailwind,
            blocks: [{
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                id: `builder-${uuid.v4()}`,
                component: {
                    name: "Custom Code",
                    options: {
                        code: html || "",
                        scriptsClientOnly: true,
                    },
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