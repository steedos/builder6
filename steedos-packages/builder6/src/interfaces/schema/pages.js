/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 11:00:18
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const _ = require('lodash');

const getChildrenPages = function(page, pages){
  return pages.filter(function(item){
    return item.parent === page._id;
  });
}

const convertPageSchema = function(page, pages){
  let pageSchema = page.amis_schema;
  if(pageSchema && typeof pageSchema === "string"){
    pageSchema = JSON.parse(pageSchema);
  }
  let pageItem = {
    "label": page.label
  };
  let isSchemaEmpty = _.isEmpty(pageSchema);
  if(isSchemaEmpty){
    // page 404界面，没有children且没有配置pageSchema时才需要显示404
    pageSchema = {
      "type": "alert",
      "body": "未找到页面的amis Schema配置，请点击右上角设计器按钮来设计该页面！",
      "level": "warning"
    };
  }
  Object.assign(pageItem, {
    "url": page._id,
    "schema": {
      "type": "page",
      "title": page.label,
      "body": pageSchema
    }
  });
  // let childrenPages = getChildrenPages(page, pages);
  // if(childrenPages && childrenPages.length){
  //   pageItem.children = childrenPages.map(function(item){
  //     return convertPageSchema(item, pages);
  //   });

  //   if(isSchemaEmpty){
  //     // 有children且未找到页面的amis Schema配置，单独作为选项卡分组存在，右侧不显示page 404界面
  //     delete pageItem.url;
  //     delete pageItem.schema;
  //   }
  // }
  return pageItem;
}

const convertPageSchemaByTab = function(tab, pagesByName){
  let pageItem;
  if(tab.type === "page"){
    let page = pagesByName[tab.interface_page]
    if(page){
      pageItem = convertPageSchema(page);
      if(tab.is_new_window){
        pageItem.link = pageItem.url;
      }
    }
    else{
      pageItem = {
        "label": tab._id,
        "url": tab._id,
        "schema": {
          "type": "page",
          "title": "404",
          "body": {
            "type": "alert",
            "body": "未找到该选项卡绑定的页面，请为该选项卡指定页面！",
            "level": "warning"
          }
        }
      };
    }
  }
  else if(tab.type === "url"){
    pageItem = {
      "label": tab.label,
      "link": tab.url
    };
  }
  return pageItem;
}

module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/mab/schema/:spaceId/apps/:appId/pages"
  }
  ],
  handler: async function (ctx) {
    // console.log("=pages schema==ctx.params===", ctx.params);
    const {
      spaceId = "",
      appId = ""
    } = ctx.params;

    const apps = await this.getObject('interfaces').find({
      filters: [['space', '=', spaceId],['_id', '=', appId]],
    });

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

    const pages = await this.getObject('interface_pages').find({
      filters: [['space', '=', spaceId],['interface_app', '=', app._id]],
    });
    // console.log("=app schema==pages===", pages);

    if (!pages || !pages.length) {
      return {
        "status": -1,
        "msg": "未找到微页面",
        "data": {}
      };
    }

    const tabs = await this.getObject('interface_tabs').find({
      filters: [['space', '=', spaceId],['interface_app', '=', appId]],
      sort: "sort_no, created"
    });
    // console.log("=app schema==tabs===", tabs);
    const isTabsEmpty = _.isEmpty(tabs);

    const schema = {
      "pages": []
    };
    let firstPage = pages[0];
    if(app.home){
      firstPage = _.find(pages, function(item){
        return item._id === app.home;
      });
    }
    // 自动跳转到第一个page
    schema.pages.push({
      "label": "Home",
      "url": "/",
      "redirect": firstPage._id || "NOT_FOUND"
    });

    // 顶层不加分组，直接循环显示pages菜单显示不出来
    schema.pages.push({
      "label": "",//设置为空不显示出来，以后要增加分组能力再放开
      "children": []
    });

    const rootPage = schema.pages[1];

    if (isTabsEmpty) {
      pages.forEach((item) => {
        const pageItem = convertPageSchema(item);
        rootPage.children.push(pageItem);
      });
    }
    else {
      const pagesByName = _.keyBy(pages, '_id');
      tabs.forEach((item) => {
        const pageItem = convertPageSchemaByTab(item, pagesByName);
        rootPage.children.push(pageItem);
      });
      const tabsByPage = _.keyBy(tabs, 'interface_page');
      // 没配置到微菜单中的页面也要加到页面清单中，并且配置其visible属性为false以达到隐藏菜单效果
      const pagesWithoutTab = pages.filter(function (item) {
        if (tabsByPage[item._id] && tabsByPage[item._id].type === "page") {
          // tabsByPage中存在类型为page，且绑定到当前page item的tab
          return false;
        }
        else {
          return true;
        }
      });
      pagesWithoutTab.forEach((item) => {
        const pageItem = convertPageSchema(item);
        Object.assign(pageItem, {
          "visible": false
        });
        rootPage.children.push(pageItem);
      });
    }
    // console.log("=app schema==rootPage.children===", rootPage.children);

    const pages__ = [
      {
        "label": "Home",
        "url": "/",
        "redirect": "/index/1"
      },
      {
        "label": "示例",
        "children": [
          {
            "label": "页面A",
            "url": "index",
            "schema": {
              "type": "page",
              "title": "页面A",
              "body": "页面A"
            },
            "children": [
              {
                "label": "页面A-1",
                "url": "1",
                "schema": {
                  "type": "page",
                  "title": "页面A-1",
                  "body": "页面A-1"
                }
              },
              {
                "label": "页面A-2",
                "url": "2",
                "schema": {
                  "type": "page",
                  "title": "页面A-2",
                  "body": "页面A-2"
                }
              },
              {
                "label": "页面A-3",
                "url": "3",
                "schema": {
                  "type": "page",
                  "title": "页面A-3",
                  "body": "页面A-3"
                }
              }
            ]
          },
          {
            "label": "页面B",
            "badge": 3,
            "badgeClassName": "bg-info",
            "schema": {
              "type": "page",
              "title": "页面B",
              "body": "页面B"
            }
          },
          {
            "label": "页面C",
            "schema": {
              "type": "page",
              "title": "页面C",
              "body": "页面C"
            }
          },
          {
            "label": "列表示例",
            "url": "/crud",
            "rewrite": "/crud/list",
            "icon": "fa fa-cube",
            "children": [
              {
                "label": "列表",
                "url": "/crud/list",
                "icon": "fa fa-list",
                "schemaApi": "get:/pages/crud-list.json"
              },
              {
                "label": "新增",
                "url": "/crud/new",
                "icon": "fa fa-plus",
                "schemaApi": "get:/pages/crud-new.json"
              },
              {
                "label": "查看",
                "url": "/crud/:id",
                "schemaApi": "get:/pages/crud-view.json"
              },
              {
                "label": "修改",
                "url": "/crud/:id/edit",
                "schemaApi": "get:/pages/crud-edit.json"
              }
            ]
          }
        ]
      },
      {
        "label": "分组2",
        "children": [
          {
            "label": "用户管理",
            "schema": {
              "type": "page",
              "title": "用户管理",
              "body": "页面C"
            }
          },
          {
            "label": "外部链接",
            "link": "http://baidu.gitee.io/amis"
          },
          {
            "label": "部门管理",
            "schemaApi": "${API_HOST}/api/amis-mock/mock2/service/form?tpl=tpl3"
          },
          {
            "label": "jsonp 返回示例",
            "schemaApi": "jsonp:/pages/jsonp.js?callback=jsonpCallback"
          }
        ]
      }
    ];
    // schema.pages = pages__;
    return {
      "status": 0,
      "msg": "",
      "data": schema
    }
  }
}