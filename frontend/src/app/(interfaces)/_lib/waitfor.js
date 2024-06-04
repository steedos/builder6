/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 22:53:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-04 00:57:50
 * @FilePath: /builder6/frontend/src/app/(interfaces)/_lib/waitfor.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import lodash from "lodash";

function _innerWaitForThing(obj, path, func) {
    const timeGap = 100;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let thing = null;
            if (lodash.isFunction(func)) {
                thing = func(obj, path);
            } else {
                thing = lodash.get(obj, path);
            }
            if (thing) {
                return resolve(thing);
            }
            reject();
        }, timeGap);
    }).catch(() => {
        return _innerWaitForThing(obj, path, func);
    });
}

export function waitForThing(obj, path, func){
    let thing = null;
    if (lodash.isFunction(func)) {
        thing = func(obj, path);
    } else {
        thing = lodash.get(obj, path);
    }
    if (thing) {
        return Promise.resolve(thing);
    }
    return _innerWaitForThing(obj, path, func);
};

if(typeof window != 'undefined'){
    window.waitForThing = waitForThing;
}