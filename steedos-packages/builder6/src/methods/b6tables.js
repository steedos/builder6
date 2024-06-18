const uuid = require("uuid");
const _ = require("lodash");


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

const getAmisType = (type) => {
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

const getFieldAmis = (field) => {
  let fieldAmis = field.amis || {};
  if (typeof fieldAmis === "string") {
    fieldAmis = JSON.parse(fieldAmis);
  }
  switch (field.type) {
    case 'select':
      fieldAmis = Object.assign({}, {
        options: field.options
      }, fieldAmis);
      break;
  }
  if (['select', 'lookup', 'image', 'file'].indexOf(field.type) > -1) {
      fieldAmis = Object.assign({}, {
        multiple: field.multiple
      }, fieldAmis);
  }
  return fieldAmis;
}

export const convertTableFieldsToAmisSchema = (table, fields) => {
  console.log("====convertTableFieldsToAmisSchema===", table, fields);
  let fieldsBody = (fields || []).map(function (field) {
    let fieldAmis = getFieldAmis(field);
    const fieldItem = {
      "type": getAmisType(field.type),
      "label": field.label,
      "name": field.name,
      "description": field.description,
      ...fieldAmis
    };
    return fieldItem;
  });
  return {
    "type": "page",
    "title": "Welcome to Builder6",
    "body": fieldsBody
  };
}

export const convertAmisSchemaToTableFields = async (amisSchema) => {
}