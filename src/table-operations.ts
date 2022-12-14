import {dynamodb, tableName} from "./awsConfig";

export function listTables() {
    dynamodb.listTables((err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

export const describeTable = () => {
    dynamodb.describeTable({TableName: tableName}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    });
};

export const createTable = () => {
    dynamodb.createTable({
        TableName: "example_table",
        AttributeDefinitions: [
            {
                AttributeName: "user_id",
                AttributeType: "S"
            },
            {
                AttributeName: "timestamp",
                AttributeType: "N"
            }
        ],
        KeySchema: [
            {
                AttributeName: "user_id",
                KeyType: "HASH" // Partition key
            },
            {
                AttributeName: "timestamp",
                KeyType: "RANGE" // Sort key
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    });
};

export const updateTable = () => {
    dynamodb.updateTable({
        TableName: "example_table",
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 1
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    });
};

export const deleteTable = () => {
    dynamodb.deleteTable({
        TableName: "example_table"
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    });
};