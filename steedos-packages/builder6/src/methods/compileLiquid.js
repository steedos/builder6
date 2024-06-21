const uuid = require("uuid");

export const compileLiquid = async (page, id) => {
    const {liquid_template, tailwind, _id} = page

    if (!liquid_template) {
        return { error: "template is required" }
    }

    const builder = {
        id,
        data: {
            cssCode: tailwind,
            blocks: [{
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                layerName: "Page",
                id: `builder-${uuid.v4()}`,
                component: {
                    name: "Builder6:Liquid",
                    options: {
                        template: liquid_template,
                        data: {}
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