const AWS = require("aws-sdk")
const fs = require('fs')

const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION

const s3 = new AWS.S3({ accessKeyId, secretAccessKey, region })

//upload file to s3

function uploadFile(file) {
    try {
        const fileStream = fs.createReadStream(file.path)

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename
        }

        return s3.upload(uploadParams).promise()
    } catch (error) {
        res.send(error)
    }
}

exports.uploadFile = uploadFile
