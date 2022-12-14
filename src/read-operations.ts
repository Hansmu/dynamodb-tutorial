import {documentClient, tableName} from "./awsConfig";
import {Key} from "aws-sdk/clients/dynamodb";
import {AWSError} from "aws-sdk";

export const getSingleItem = () => {
    documentClient.get({
        TableName: tableName,
        Key: {
            user_id: 'bb',
            timestamp: 1
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const queryTable = () => {
    documentClient.query({
        TableName: tableName,
        KeyConditionExpression: "user_id = :uid",
        ExpressionAttributeValues: {
            ":uid": "bb"
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const scanTable = () => {
    documentClient.scan({
        TableName: tableName,
        FilterExpression: "cat = :cat",
        ExpressionAttributeValues: {
            ":cat": "general"
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const batchGet = () => {
    documentClient.batchGet({
        RequestItems: {
            [tableName]: { // Can use multiple different tables in here.
                Keys: [
                    {
                        user_id: 'A',
                        timestamp: 1
                    },
                    {
                        user_id: 'B',
                        timestamp: 2
                    }
                ]
            },
            // [`${tableName}_other`]: {
            //     Keys: [
            //         {
            //             user_id: '11',
            //             timestamp: 1
            //         }
            //     ]
            // }
        }
    }, (err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    });
};

export const paginatedRead = async (paginationStartKey: Key | undefined): Promise<Key | AWSError | undefined> => {
    return new Promise((resolve, reject) => {
        documentClient.scan({
            TableName: tableName,
            Limit: 1,
            ExclusiveStartKey: paginationStartKey
        }, (err, data)=>{
            if(err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                resolve(data.LastEvaluatedKey);
            }
        });
    });
};