/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-07 09:25:02
 * @FilePath: /microapps/steedos-packages/micro-app-builder/src/micro.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/mab/schema/:spaceId/apps/:appId"
  }],
  handler: async function (ctx) {
    console.log("=app schema==ctx.params===", ctx.params);
    const {
      spaceId = "",
      appId = ""
    } = ctx.params;

    const apps = await this.getObject('micro_apps').find({
      filters: ['api_name', '=', appId],
    });
    console.log("=app schema==apps===", apps);

    if (!apps || !apps.length) {
      return {
        "status": -1,
        "msg": "未找到微应用",
        "data": {}
      };
    }

    let app = apps[0];

    let appLebel = app.name;

    const schema = {
      type: 'app',
      brandName: appLebel,
      logo: '/public/logo.png',
      // header: {
      //   type: 'tpl',
      //   inline: false,
      //   className: 'w-full',
      //   tpl: '<div class="flex justify-between"><div>顶部区域左侧</div><div>顶部区域右侧</div></div>'
      // },
      // footer: '<div class="p-2 text-center bg-light">底部区域</div>',
      // asideBefore: '<div class="p-2 text-center">菜单前面区域</div>',
      // asideAfter: '<div class="p-2 text-center">菜单后面区域</div>',
      api: `/mab/schema/\${spaceId}/apps/\${appId}/pages`
    };

    return {
      "status": 0,
      "msg": "",
      "data": schema
    };
  }
}