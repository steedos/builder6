module.exports = {

    initProductVariants: function(object_name, record_id) {
        let record = Creator.odata.get(object_name, record_id);

        let fields = {};

        if (record.option1) {
            fields.option1 = {
                type: 'textarea',
                is_wide: true,
                require: true,
                label: record.option1
            }
        }

        if (record.option2) {
            fields.option2 = {
                type: 'textarea',
                is_wide: true,
                require: true,
                label: record.option2
            }
        }

        if (record.option3) {
            fields.option3 = {
                type: 'textarea',
                is_wide: true,
                require: true,
                label: record.option3
            }
        }

        if (_.isEmpty(fields)) {
            return toastr.warning('请先配置产品多属性');
        }

        function calcPermutations(transArr) {
            let resultArr = [];

            function get(array, index, val) {
                if (!array[index]) {
                    resultArr.push(val)
                    return
                }
                array[index].forEach((v, i) => {
                    get(array, index + 1, index === 0 ? [v] : [...val, v])
                })
            }
            get(transArr, 0)
            return resultArr
        }

        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: `initProductVariantsForm`,
            title: `初始化产品变量`,
            initialValues: {},
            objectSchema: {
                fields: fields
            },
            onFinish: async function(values) {
                console.log(`onFinish values`, values)
                try {
                    const {
                        option1,
                        option2,
                        option3
                    } = values
                    let option1Arr = [],
                        option2Arr = [],
                        option3Arr = [];
                    if (option1) {
                        option1Arr = option1.split('\n')
                    }

                    if (option2) {
                        option2Arr = option2.split('\n')
                    }

                    if (option3) {
                        option3Arr = option3.split('\n')
                    }

                    let transArr = [];
                    let valuesMap = {};
                    let length = 0;

                    if (option1Arr && option1Arr.length > 0) {
                        transArr.push(option1Arr)
                        valuesMap.option1 = length;
                        length++
                    }

                    if (option2Arr && option2Arr.length > 0) {
                        transArr.push(option2Arr)
                        valuesMap.option2 = length;
                        length++
                    }

                    if (option3Arr && option3Arr.length > 0) {
                        transArr.push(option3Arr)
                        valuesMap.option3 = length;
                        length++
                    }

                    const results = calcPermutations(transArr);

                    const records = [];

                    _.each(results, (result) => {
                        records.push({
                            product: record_id,
                            option1: _.has(valuesMap, 'option1') ? result[valuesMap.option1] : '',
                            option2: _.has(valuesMap, 'option2') ? result[valuesMap.option2] : '',
                            option3: _.has(valuesMap, 'option3') ? result[valuesMap.option3] : ''
                        })
                    })

                    const insertPromiseArray = []
                    for (const record of records) {
                        insertPromiseArray.push(stores.API.insertRecord('shop_product_variants', record))
                    }
                    await Promise.all(insertPromiseArray)
                    FlowRouter.reload();
                    toastr.success('操作已完成');
                    return true;
                } catch (error) {
                    console.log(error)
                    toastr.error(error.message);
                }
            }
        }, null, {
            iconPath: '/assets/icons'
        });
    },
    initProductVariantsVisible: function() {
        //TODO 如果产品变量已经有记录，则不显示此按钮
        return Steedos.isSpaceAdmin()
    }

}