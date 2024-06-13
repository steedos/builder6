商城
===

本项目参考 shopify, 实现商城功能。

[Developer Docs](https://shopify.dev/apps/getting-started/create)
[API](https://shopify.dev/api/admin/rest/reference/products/product)

shop 依赖于 site

shop 本身没有 store。一个site 就是一个 store

store 基于 产品系列 浏览商品

## shopify
- collection：slug， 默认等于name
- product：slug， 默认等于name，如果重复则加-1、-2、...