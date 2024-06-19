/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-17 03:44:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-17 10:11:43
 * @FilePath: /builder6/steedos-packages/builder6/main/default/objects/b6_tables/buttons/design.button.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {

    designVisible: function(object_name, record_id, record_permissions, data) {
        return Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    }

}