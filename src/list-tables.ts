import {DynamoDB} from 'aws-sdk';

export function listTables() {
    const dynamodb = new DynamoDB();

    dynamodb.listTables((err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}