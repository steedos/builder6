export async function getLatestPageVersion(pageId, type) {
  try {
    const results = await this.getObject('b6_page_versions').find({
      filters: [['page_id', '=', pageId], ['type', '=', type]],
      sort: 'version desc',
      top: 1
    });

    if (results && results.length > 0) {
      return results[0];
    } else {
      // 兼容没有版本管理前page中已有设计内容
      let pgfields = ["type"];
      switch(type){
        case "amis":
          pgfields.push('amis_schema');
          break;
        case "html":
          pgfields.push('html');
          break;
        case "liquid":
          pgfields.push('liquid_template');
          break;
      }
      const page =  await this.getObject('b6_pages').findOne(pageId, {
        fields: pgfields
      });
      if(page && page.type === type){
        delete page._id;
        //按已发版本处理，以让进savePageVersion函数保存时新增b6_page_versions记录
        page.is_active = true;
        return page;
      }
      else{
        return null;
      }
    }
  } catch (error) {
    throw new Error(`Error fetching latest page version for pageId: ${pageId}, type: ${type} - ${error.message}`);
  }
}

export async function savePageVersion(pageId, type, schema, userSession) {
  try {
    const pageVersion = await this.getLatestPageVersion(pageId, type);
    let version = pageVersion?.version || 0;
    if (pageVersion && !pageVersion.is_active) {
      return await this.getObject('b6_page_versions').update(pageVersion._id, {
        ...schema
      }, userSession);
    } else {
      return await this.getObject('b6_page_versions').insert({
        page_id: pageId,
        type,
        is_active: false,
        ...schema,
        version: ++version,
        space: userSession.spaceId
      }, userSession)
    }
  } catch (error) {
    throw new Error(`Error saving page version for pageId: ${pageId}, type: ${type} - ${error.message}`);
  }
}


