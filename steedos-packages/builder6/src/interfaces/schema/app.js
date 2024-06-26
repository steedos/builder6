/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 10:55:33
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const iconsSourceAdaptor = `
  if (payload && payload.length) {
    let data = {};
    let sldsStandardIcons = _.find(payload, { name: "standard" });
    sldsStandardIcons = sldsStandardIcons && sldsStandardIcons.icons;
    data.options = sldsStandardIcons.map(function(item){return{label: item.symbol, value: item.symbol, icon: item.symbol}});
    payload.data = data;
  }
  return payload;
`;

const iconsSource = {
  "method": "get",
  "url": "${context.rootUrl}/ui.icons.json",
  "requestAdaptor": "",
  "adaptor": iconsSourceAdaptor,
  "headers": {
      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
  }
}
 
module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/mab/schema/:spaceId/apps/:appId"
  }],
  handler: async function (ctx) {
    // console.log("=app schema==ctx.params===", ctx.params);
    const {
      spaceId = "",
      appId = ""
    } = ctx.params;

    const apps = await this.getObject('interfaces').find({
      filters: [['space', '=', spaceId],['_id', '=', appId]],
    });
    // console.log("=app schema==apps===", apps);

    if (!apps || !apps.length) {
      return {
        "status": 0,
        "msg": "",
        "data": {
          "type": "page",
          "title": "404",
          "body": "未找到应用" + appId
        }
      }
    }

    let app = apps[0];

    let appLebel = app.label;
    let appIcon = app.icon;
    let appLogo = app.logo;

    let svgLogo;
    if (appLogo) {
      svgLogo = `/api/files/images/${appLogo}`;
    }
    else if (appIcon) {
      svgLogo = `
        <svg class="slds-icon slds-icon_container slds-icon-standard-${appIcon.replace(/_/g, "-")}" aria-hidden="true">
          <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${appIcon}"></use>
        </svg>
      `;
    }

    const schema = {
      type: 'app',
      brandName: appLebel,
      logo: svgLogo,
      // header: {
      //   type: 'tpl',
      //   inline: false,
      //   className: 'w-full',
      //   tpl: '<div class="flex justify-between"><div>顶部区域左侧</div><div>顶部区域右侧</div></div>'
      // },
      // footer: '<div class="p-2 text-center bg-light">底部区域</div>',
      // asideBefore: '<div class="p-2 text-center">菜单前面区域</div>',
      // asideAfter: {
      //   "label": "设置应用",
      //   "type": "button",
      //   "actionType": "dialog",
      //   "icon": "fa fa-cog",
      //   "level": "dark",
      //   "className": "absolute bottom-0 left-0 right-0 rounded-none justify-start",
      //   "dialog": {
      //     "title": "设置应用",
      //     "size": "lg",
      //     "body": 
      //     {
      //       "type": "steedos-object-form",
      //       "label": "对象表单",
      //       "objectApiName": "interfaces",
      //       "recordId": app._id,
      //       "mode": "edit",
      //       "fieldsExtend": {
      //         "name":{
      //           "amis": {
      //             "visible": false
      //           }
      //         },
      //         "icon":{
      //           "amis": {
      //             "source": iconsSource
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      api: `/mab/schema/\${spaceId}/apps/\${appId}/pages`
    };

    return {
      "status": 0,
      "msg": "",
      "data": schema
    };
  }
}