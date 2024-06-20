const uuid = require("uuid");
const _ = require("lodash");

const BASE_FIELD_PROPS = ['type', 'label', 'name', 'description']; // amis field和table field都有的基础属性

const AmisFormInputs = [
  'text',
  'date',
  'file',
  "avatar",
  'image',
  'datetime',
  'time',
  'number',
  'currency',
  'percent',
  'password',
  'url',
  "color",
  'email',
  'signature'
]

/**
 * 把table字段类型转为amis字段类型
 * @param {*} type: table字段类型
 * @returns amis字段类型
 */
const getAmisFieldType = (type) => {
  let amisType = "";
  if (_.includes(AmisFormInputs, type)) {
    amisType = `input-${type}`;
  }
  else {
    switch (type) {
      case 'boolean':
        amisType = 'checkbox';
        break;
      case 'location':
        amisType = 'location-picker';
        break;
      default:
        amisType = type;
    }

  }
  return amisType;
}

/**
 * 把amis字段类型转为table字段类型
 * @param {*} type: amis字段类型
 * @returns table字段类型
 */
const getTableFieldType = (type) => {
  let tableType = "";
  if (_.includes(AmisFormInputs.map(function (item) {
    return `input-${item}`;
  }), type)) {
    tableType = type.replace(/^input-/, "");
  }
  else {
    switch (type) {
      case 'checkbox':
        tableType = 'boolean';
        break;
      case 'location-picker':
        tableType = 'location';
        break;
      default:
        tableType = type;
    }

  }
  return tableType;
}

/**
 * 把table field转为amis field时，根据传入的table field，获取amis field在 BASE_FIELD_PROPS 中包含的基本属性
 * @param {*} field: table字段
 * @returns 转换后得到的基本amis field属性
 */
const getAmisFieldBaseProps = (field) => {
  const baseFieldProps = {};
  BASE_FIELD_PROPS.forEach((item) => {
    const fieldItem = field[item];
    if (typeof fieldItem === "undefined") {
      return;
    }
    if (item === "type") {
      baseFieldProps[item] = getAmisFieldType(fieldItem);
    }
    else {
      baseFieldProps[item] = fieldItem;
    }
  });
  return baseFieldProps;
}

/**
 * 把amis field转为table field时，根据传入的amis field，获取table field在 BASE_FIELD_PROPS 中包含的基本属性
 * @param {*} field: table字段
 * @returns 转换后得到的基本table field属性
 */
const getTableFieldBaseProps = (fieldSchema) => {
  const baseFieldProps = {};
  BASE_FIELD_PROPS.forEach((item) => {
    const fieldSchemaItem = fieldSchema[item];
    if (typeof fieldSchemaItem === "undefined") {
      return;
    }
    if (item === "type") {
      baseFieldProps[item] = getTableFieldType(fieldSchemaItem);
    }
    else {
      baseFieldProps[item] = fieldSchemaItem;
    }
  });
  return baseFieldProps;
}

/**
 * 把table field转为amis field时，根据传入的table field，获取额外的amis field属性
 * 主要包括两方面：
 * - 把传入的table field的amis属性拼接到最终生成的amis field schema中
 * - 根据各种字段类型，生成额外需要添加到amis field schema中的属性
 * @param {*} field: table字段
 * @returns 转换后得到的额外amis field属性
 */
const getAmisFieldExtraProps = (field) => {
  let fieldAmis = field.amis || {};
  if (typeof fieldAmis === "string") {
    fieldAmis = JSON.parse(fieldAmis);
  }
  switch (field.type) {
    case 'select':
      // options非必填，存在时才有必要合并
      if (field.options) {
        fieldAmis = Object.assign({}, {
          options: field.options
        }, fieldAmis);
      }
      break;
  }
  if (['select', 'lookup', 'image', 'file'].indexOf(field.type) > -1) {
    // multiple是必填属性
    fieldAmis = Object.assign({}, {
      multiple: !!field.multiple
    }, fieldAmis);
  }
  return fieldAmis;
}

/**
 * 把amis field转为table field时，根据传入的amis field，获取table field的amis属性
 * 主要包括两方面：
 * - 把传入的amis field schema不在 BASE_FIELD_PROPS 中包含的其它所有属性加到要返回的table field amis属性中
 * - 根据各种字段类型，把传入的field schema中同名属性添加到table field中
 * @param {*} fieldSchema: amis字段 schema
 * @returns 转换后得到的额外table field属性，其中包括amis属性
 */
const getTableFieldExtraProps = (fieldSchema) => {
  if (!fieldSchema) {
    fieldSchema = {};
  }
  delete fieldSchema.id;//amis自动生成的id不需要保存
  let fieldAmis = _.pickBy(fieldSchema, function (n, k) {
    return !_.includes(BASE_FIELD_PROPS, k);
  });
  const fieldType = getTableFieldType(fieldSchema.type);
  const tableFieldExtraProps = {};
  switch (fieldType) {
    case 'select':
      // options非必填，没配置options时，要删除原来字段上的options属性
      Object.assign(tableFieldExtraProps, {
        options: fieldAmis.options
      });
      // options作为字段属性同步合并到table field中了，最终为table field的amis属性输出的内容中不需要再带
      delete fieldAmis.options;
      break;
  }
  if (['select', 'lookup', 'image', 'file'].indexOf(fieldType) > -1) {
    // multiple是必填属性
    Object.assign(tableFieldExtraProps, {
      multiple: !!fieldAmis.multiple
    });
    // multiple作为字段属性同步合并到table field中了，最终为table field的amis属性输出的内容中不需要再带
    delete fieldAmis.multiple;
  }
  tableFieldExtraProps.amis = JSON.stringify(fieldAmis);
  return tableFieldExtraProps;
}

export const convertTableFieldsToAmisSchema = (table, fields) => {
  console.log("====convertTableFieldsToAmisSchema===", table, fields);
  let sortedFields = _.sortBy((fields || []), 'sort_no');
  let fieldsBody = sortedFields.map(function (field) {
    const baseFieldProps = getAmisFieldBaseProps(field);
    let extraProps = getAmisFieldExtraProps(field);
    const fieldItem = {
      ...baseFieldProps,
      ...extraProps
    };
    return fieldItem;
  });
  return {
    "type": "page",
    "title": "Welcome to Builder6",
    "body": fieldsBody
  };
}

export const convertAmisSchemaToTableFields = (amisSchema) => {
  console.log("====convertAmisSchemaToTableFields===", amisSchema);
  if (typeof amisSchema === "string") {
    amisSchema = JSON.parse(amisSchema);
  }
  const fieldsBody = amisSchema?.body;
  if (!fieldsBody?.length) {
    return [];
  }
  let tableFields = (fieldsBody || []).map(function (fieldSchema, index) {
    const baseFieldProps = getTableFieldBaseProps(fieldSchema);
    let extraProps = getTableFieldExtraProps(fieldSchema);
    const fieldItem = {
      ...baseFieldProps,
      ...extraProps,
      sort_no: (index + 1) * 10
    };
    return fieldItem;
  });
  return tableFields;
}

export async function validateTableFieldsBeforeSave(fieldsArray) {
  // Step 1: 查询 object_fields 对象，获取 options 字段
  const filterConditions = [
    ["object", "=", "b6_fields"],
    ["name", "=", "type"]
  ];

  const result = await this.getObject('object_fields').find({
    filters: filterConditions,
    fields: ['options']
  });

  if (!result || result.length === 0 || !result[0].options) {
    throw new Error('Failed to retrieve valid types for b6_fields from object_fields.');
  }

  // Step 2: 提取 options 字段中的 type 属性集合
  const validTypes = result[0].options.map(option => option.value);

  // Step 3: 校验 fieldsArray
  fieldsArray.forEach((field, index) => {
    if (!field.type || !field.label || !field.name) {
      throw new Error(`Field at index ${index} is missing required properties (type, label, name).`);
    }

    if (!validTypes.includes(field.type)) {
      throw new Error(`Field at index ${index} has an invalid type '${field.type}'. Valid types are: ${validTypes.join(', ')}.`);
    }
  });
}

/**
 * 把字段清单保存到数据表各个字段中，包括增加、删除和修改字段，保存前先进行合法性校验
 * tableFields: 经过convertAmisSchemaToTableFields函数把的amis schema转为要同步保存的字段清单
 * 保存分两步：
 * - 删除所有旧字段
 * - 循环传入的tableFields集合，依次把每个字段添加到数据表中
 */
export async function saveTableFields(tableId, tableFields, userSession) {
  // 先校验传入的字段集合是否符合规范
  await this.validateTableFieldsBeforeSave(tableFields);

  let b6FieldsObject;

  try {
    b6FieldsObject = this.getObject('b6_fields');
  } catch (getObjectError) {
    console.error('An error occurred while getting b6_fields object:', getObjectError);
    throw new Error('An error occurred while getting b6_fields object:', getObjectError);
  }

  try {
    const records = await b6FieldsObject.find({ filters: [['table_id', '=', tableId]] });

    // 分批删除所有记录
    const batchSize = 10; // 每批处理的记录数
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await Promise.all(batch.map(async (record) => {
        await b6FieldsObject.delete(record._id);
      }));
    }

  } catch (deleteError) {
    console.error('An error occurred while deleting records:', deleteError);
    throw new Error('An error occurred while deleting records:', deleteError);
  }

  try {
    // 分批插入新记录
    const batchSize = 10; // 每批处理的记录数
    for (let i = 0; i < tableFields.length; i += batchSize) {
      const batch = tableFields.slice(i, i + batchSize);
      await Promise.all(batch.map(async (field) => {
        // 设置新记录的 table_id 属性值为原始 tableId
        field.table_id = tableId;
        // 插入新记录到 b6_fields 表
        await b6FieldsObject.insert(field, userSession);
      }));
    }
  } catch (insertError) {
    console.error('An error occurred while inserting records:', insertError);
    throw new Error('An error occurred while inserting records:', insertError);
  }
}
