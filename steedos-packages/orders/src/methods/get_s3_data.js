const AWS = require('aws-sdk');
module.exports = {
    async handler(params) {
        AWS.config.update({

        });
        const s3 = new AWS.S3();
        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Body);
                }
            });
        });
    }
}