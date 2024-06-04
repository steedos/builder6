/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-31 04:16:36
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-04 02:09:12
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/[interface_id]/[page_id]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Script from 'next/script';

import React, { Fragment } from 'react';
import { getPageSchema } from "../../../_lib/index";

const getEmbedAmisJs = (schema: any) => {
  return <Fragment>
      <Script dangerouslySetInnerHTML={{ __html: `
          (function () {
            Promise.all([
              waitForThing(window, 'renderAmisPage'),
            ]).then(() => {
              window.renderAmisPage(${JSON.stringify(schema)}, {});
            });
          })();
      ` }} strategy="lazyOnload" />
  </Fragment>
}

export default async function Home({ params }: { params: { interface_id: string, page_id: string } }) {
  let pageSchema = await getPageSchema(params.page_id);

  return (
    <>
      Interfaces Page {params.interface_id} / {params.page_id}
      <div id="root_interface_page" className="app-wrapper"></div>
      {getEmbedAmisJs(pageSchema)}
    </>
  )
}
