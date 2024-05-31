/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-31 04:16:36
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 06:00:19
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/[interface_id]/[page_id]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


export default function Home({ params }: { params: { interface_id: string, page_id: string } })  {
    return (
      <>          
        Interfaces Page {params.interface_id} / {params.page_id}
      </>
    )
  }
  