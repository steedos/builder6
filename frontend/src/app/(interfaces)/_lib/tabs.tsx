/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 10:03:32
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-05 06:56:12
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/lib/data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getRecord } from "./data";
import {
    SidebarSection,
    SidebarItem,
    SidebarLabel
} from '@/components/sidebar';
import {
    TicketIcon,
    HomeIcon
} from '@heroicons/react/20/solid'

const convertTabItemForSidebarItem = async function (tab: any) {
    if (tab.type === "url") {
        // 显示为name，链接到url，不用处理
        return tab;
    } else if (tab.type === "page") {
        // 显示为对应的page的name，链接到page的url
        try {
            const result = await getRecord("b6_pages", tab.page);
            const page = result?.data?.data;
            if (page) {
                return {
                    ...tab,
                    name: page.name,
                    url: `/interfaces/${page.project_id}/${page._id}`
                }
            }
            else {
                return tab;
            }
        } catch (error) {
            return tab;
        }
    }
}

export async function getSidebarItemsSection(project: any) {
    const tabs: any = project.tabs;
    const tabsConverted: any = [];
    for (var i = 0; i < tabs.length; i++) {
        tabsConverted.push(await convertTabItemForSidebarItem(tabs[i]));
    }
    return (
        <SidebarSection>
            {
                tabsConverted.map((tab: any, tabIndex: number) => (
                    <SidebarItem href={tab.url} key={tabIndex} target={tab.is_new_window ? "_blank" : ""}>
                        <TicketIcon />
                        <SidebarLabel>{tab.name}</SidebarLabel>
                    </SidebarItem>
                ))
            }
        </SidebarSection>
    );
}

export async function getSidebarHomeSection(project: any) {
    const url = `/interfaces/${project._id}`;
    return (
        <SidebarSection className="max-lg:hidden">
            <SidebarItem href={url}>
                <HomeIcon />
                <SidebarLabel>{project.name}</SidebarLabel>
            </SidebarItem>
        </SidebarSection>
    );
}