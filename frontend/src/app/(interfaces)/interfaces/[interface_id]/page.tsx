/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-31 04:16:36
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-04 09:09:38
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/[interface_id]/[page_id]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { redirect } from 'next/navigation';
import { getInterface } from "../../_lib/tabs";

export default async function Home({ params }: { params: { interface_id: string } }) {
  let record = await getInterface(params.interface_id);
  let homePage = record.home;
  let homeUrl = "";
  if (homePage) {
    homeUrl = `/interfaces/${params.interface_id}/${homePage}`;
  }
  else {
    let tabs = record.tabs;
    let firstTab = tabs && tabs[0];
    if (firstTab) {
      if (firstTab.type === "url") {
        homeUrl = firstTab.url;
      }
      else if (firstTab.type === "page") {
        homeUrl = `/interfaces/${params.interface_id}/${firstTab.page}`;
      }
    }
    else {
      // 没配置首页和选项卡，是否要取第一个page作为首页？
      return (
        <div>请为该项目配置首页或选项卡</div>
      );
    }
  }
  redirect(homeUrl);
}
