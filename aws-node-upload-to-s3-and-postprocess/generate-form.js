#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

const aws_access_key_id = '<your access key id>';
const aws_secret_access_key = '<your secret access key>';
const bucket_name = '<your bucket name>';

const ms_per_day = 24 * 60 * 60 * 1000;
const expiration = new Date(Date.now() + ms_per_day).toISOString();
const bucket_url = `https://${bucket_name}.s3.amazonaws.com`;

const policy = {
  'expiration': expiration,
  'conditions': [
    ['starts-with', '$key', 'uploads/'],
    {'bucket': bucket_name},
    {'acl': 'public-read'},
    ['starts-with', '$Content-Type', 'image/png'],
    {'success_action_status': '201'},
  ]
};

const policy_b64 = Buffer(JSON.stringify(policy), 'utf-8').toString('base64');

const hmac = crypto.createHmac('sha1', aws_secret_access_key);
hmac.update(new Buffer(policy_b64, 'utf-8'));

const signature = hmac.digest('base64');

fs.readFile('frontend/index.template.html', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  data = data.replace(/%BUCKET_URL%/g, bucket_url);
  data = data.replace(/%AWS_ACCESS_KEY%/g, aws_access_key_id);
  data = data.replace(/%POLICY_BASE64%/g, policy_b64);
  data = data.replace(/%SIGNATURE%/g, signature);

  fs.writeFile('frontend/index.html', data, 'utf8', (err) => {
     if (err) {
       return console.log(err);
     }
  });
});
