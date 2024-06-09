const uuid = require("uuid");

export const compileAmis = async (page, id) => {
    const {amis_schema, tailwind, _id} = page

    if (!amis_schema) {
        return { error: "amis is required" }
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
                    name: "Core:Amis",
                    options: {
                        schema: JSON.parse(amis_schema),
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