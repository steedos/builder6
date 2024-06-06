/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-06 07:07:23
 * @Description: 
 */
'use client'

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
// import { amisRender, amisRootClick, getDefaultRenderData } from '@/lib/amis';
import { amisRender, getDefaultRenderData } from '../_lib/amis';
import { defaultsDeep, concat, compact, filter, map, isEmpty } from 'lodash';
import { usePathname, useRouter } from 'next/navigation'

export const AmisRender = ({ id, schema, data = {}, className = "", getModalContainer = null, updateProps = null, session = null }) => {
    const router = useRouter()
    const [amisInstance, setAmisInstance] = useState(null)

    useEffect(() => {
        const defData = defaultsDeep({ data: { $scopeId: id, scopeId: id } }, { data: data }, {
            data: getDefaultRenderData()
        });
        // 如果已存在,则先销毁, 再创建新实例
        if (amisInstance) {
            try {
                amisInstance.unmount()
            } catch (error) {
                console.error(`error`, id)
            }
        }

        const env = {};

        if (getModalContainer) {
            env.getModalContainer = getModalContainer;
        }
        if (session) {
            env.session = session;
        }
        let scope = amisRender(`#${id}`, defaultsDeep(defData, schema), {
            // location: router
        }, env, { router: router });
        setAmisInstance(scope);

        return () => {
            if (amisInstance) {
                try {
                    amisInstance.unmount();
                } catch (error) {
                    console.error(`error`, id)
                }
            }
        }

    }, [JSON.stringify(schema), JSON.stringify(data)]);

    useEffect(() => {
        const amisScope = amisInstance;
        if (amisScope && !isEmpty(updateProps)) {
            if (updateProps.data) {
                updateProps.data = defaultsDeep(updateProps.data, data, getDefaultRenderData());
            }
            amisScope.updateProps(updateProps, () => {
                console.log(`amisScope.updateProps callback.......`)
            });
        }
    }, [JSON.stringify(updateProps)])
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`}></div>
    )
};