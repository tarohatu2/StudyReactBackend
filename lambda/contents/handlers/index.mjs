import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' })
const tableName = process.env.TABLE_NAME

export const put = async (event) => {
  const { userId, type, datetime } = event.body
  const createdAt = (datetime * 10000) + 1 
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      userIdType: {
        'S': `${userId}-${type}`
      },
      createdAt: {
        'N': `${createdAt}`
      }
    }
  })
  const result = await ddbClient.send(command)
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(result),
  };
  return response
}
