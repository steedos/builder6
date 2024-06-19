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
  let fieldsBody = (fields || []).map(function (field) {
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
  let tableFields = (fieldsBody || []).map(function (fieldSchema) {
    const baseFieldProps = getTableFieldBaseProps(fieldSchema);
    let extraProps = getTableFieldExtraProps(fieldSchema);
    const fieldItem = {
      ...baseFieldProps,
      ...extraProps
    };
    return fieldItem;
  });
  return tableFields;
}

/**
 * 把字段清单保存到数据表各个字段中，包括增加、删除和修改字段
 * tableFields: 经过convertAmisSchemaToTableFields函数把的amis schema转为要同步保存的字段清单
 */
export const putTableFields = async (tableFields) => {
  console.log("====putTableFields===", tableFields);
  // TODO: 循环tableFields集合，增加、删除和修改数据表字段
}