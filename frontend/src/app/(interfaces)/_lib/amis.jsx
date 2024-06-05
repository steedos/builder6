'use client'

import { each, find, isArray, isEmpty } from 'lodash';

const normalizeLink = (to, location = window.location) => {
    to = to || "";

    if (to && to[0] === "#") {
        to = location.pathname + location.search + to;
    } else if (to && to[0] === "?") {
        to = location.pathname + to;
    }

    const idx = to.indexOf("?");
    const idx2 = to.indexOf("#");
    let pathname = ~idx
        ? to.substring(0, idx)
        : ~idx2
            ? to.substring(0, idx2)
            : to;
    let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
    let hash = ~idx2 ? to.substring(idx2) : location.hash;

    if (!pathname) {
        pathname = location.pathname;
    } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
        let relativeBase = location.pathname;
        const paths = relativeBase.split("/");
        paths.pop();
        let m;
        while ((m = /^\.\.?\//.exec(pathname))) {
            if (m[0] === "../") {
                paths.pop();
            }
            pathname = pathname.substring(m[0].length);
        }
        pathname = paths.concat(pathname).join("/");
    }

    return pathname + search + hash;
};
function isCurrentUrl(to, ctx) {
    try {
        if (!to) {
            return false;
        }
        const pathname = window.location.pathname;
        const link = normalizeLink(to, {
            ...location,
            pathname,
            hash: ''
        });

        if (!~link.indexOf('http') && ~link.indexOf(':')) {
            let strict = ctx && ctx.strict;
            return match(link, {
                decode: decodeURIComponent,
                strict: typeof strict !== 'undefined' ? strict : true
            })(pathname);
        }
        return decodeURI(pathname) === link || decodeURI(pathname).startsWith(`${link}/`);
    } catch (error) {
        console.error(`error`, error)
    }
}

// export const amisRootClick = (router, e) => {
//   if (e.target.nodeName.toLocaleLowerCase() === "a" && e.target.href && e.target.target != '_blank') {
//     e.preventDefault();
//     router.push(e.target.href);
//     return ;
//   }

//   if(e.target.parentNode.nodeName.toLocaleLowerCase() === "a" && e.target.parentNode.href && e.target.parentNode.target != '_blank'){
//     e.preventDefault();
//     router.push(e.target.parentNode.href);
//     return ;
//   }

// };

export const getEvn = (router) => {
    return {
        theme: "antd",
        getModalContainer: (props) => {
            // let div = document.querySelector("#amisModalContainer");
            //   if(!div){
            //       div = document.createElement('div');
            //       div.className="amis-scope";
            //       div.style.height='0px';
            //       div.id="amisModalContainer";
            //       document.body.appendChild(div)
            //   }
            //   return div;
            return document.body;
        },
        jumpTo: (to, action) => {
            if (to === "goBack") {
                return window.history.back();
            }

            to = normalizeLink(to);

            if (action && action.actionType === "url") {
                action.blank === true ? window.open(to) : router.push(to);
                return;
            }

            // 主要是支持 nav 中的跳转
            if (action && to && action.target) {
                window.open(to, action.target);
                return;
            }
            if (/^https?:\/\//.test(to)) {
                window.location.replace(to);
            } else {
                router.push(to);
            }
        },
        isCurrentUrl: isCurrentUrl
    }
}

export const getDefaultRenderData = () => {
    return {
        context: {
            
        }
    }
}


export const amisRender = (root, schema, props = {}, env = {}, options) => {
    let amis = amisRequire("amis/embed");
    const { router, assets } = options;
    return amis.embed(root, schema, props, Object.assign(getEvn(router), env));
};