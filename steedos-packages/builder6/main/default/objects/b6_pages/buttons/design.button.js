module.exports = {

    designVisible: function(object_name, record_id, record_permissions, data) {
        if(data && data.type !== "amis"){
            return false;
        }
        return Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    }

}