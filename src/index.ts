import {config} from 'dotenv';
import {config as awsConfig} from 'aws-sdk';

config();
awsConfig.update({
    region: process.env.AWS_DEFAULT_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID
});
