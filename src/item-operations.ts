import {documentClient, tableName} from "./awsConfig";

export const insertItem = () => {
    documentClient.put({
        TableName: tableName,
        Item: {
            user_id: 'bb',
            timestamp: 1,
            title: 'New Title Beans',
            content: 'changed content'
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const updateItem = () => {
    documentClient.update({
        TableName: tableName,
        Key: {
            user_id: 'bb',
            timestamp: 1
        },
        UpdateExpression: 'set #t = :t',
        ExpressionAttributeNames: {
            '#t': 'title'
        },
        ExpressionAttributeValues: {
            ':t': "Updated title"
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const deleteItem = () => {
    documentClient.delete({
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

export const batchWrite = () => {
    documentClient.batchWrite({
        RequestItems: {
            [tableName]: [
                {
                    DeleteRequest: {
                        Key: {
                            user_id: 'bb',
                            timestamp: 2
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            user_id: '11',
                            timestamp: 1,
                            title: 'Title 11',
                            content: 'Content 11'
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            user_id: '22',
                            timestamp: 2,
                            title: 'Title 22',
                            content: 'Content 22'
                        }
                    }
                }
            ]
        }
    }, (err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const conditionalWrite = () => {
    documentClient.put({
        TableName: tableName,
        Item: {
            user_id: 'ABC',
            timestamp: 1,
            title: 'New Title',
            content: 'New Content'
        },
        ConditionExpression: '#t <> :t', // Do this, if the attribute t does not equal value t
        ExpressionAttributeNames: {
            '#t': 'timestamp' // The attribute t refers to attribute timestamp
        },
        ExpressionAttributeValues: {
            ':t': 1 // The value of t is equal to 1
        }
    }, (err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

export const atomicCounter = () => {
    documentClient.update({
        TableName: tableName,
        Key: {
            user_id: 'ABC',
            timestamp: 1
        },
        UpdateExpression: 'set #v = #v + :incr',
        ExpressionAttributeNames: {
            '#v': 'views'
        },
        ExpressionAttributeValues: {
            ':incr': 1
        }
    }, (err, data)=> {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
};