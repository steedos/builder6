module.exports = {

    designVisible: function(object_name, record_id, record_permissions) {
        return Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    }

}