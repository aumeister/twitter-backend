require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(req) {
    buf = Buffer.from(req.body.img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const data = {
        Bucket: bucketName,
        Key: req.body.postKey,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    s3.putObject(data, (err, data) => {
        if (err) {
            console.log(err);
            console.log('Error uploading data: ', data);
        } else {
            console.log('successfully uploaded the image!');
        }
    })
}

module.exports.uploadFile = uploadFile;


function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}
module.exports.getFileStream = getFileStream;