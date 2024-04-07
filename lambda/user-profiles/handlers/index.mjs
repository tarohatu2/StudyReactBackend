import middy from '@middy/core'
import errorLogger from '@middy/error-logger'
import inputOutputLogger from '@middy/input-output-logger'
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' })
const tableName = process.env.TABLE_NAME

export const put = async (event) => {
  const body = JSON.parse(event.body)
  const { userId, type, name } = body
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      userId: {
        'S': userId
      },
      type: {
        'S': type
      },
      name: {
        'S': name
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

export const putHandler = middy()
  .use(inputOutputLogger())
  .use(errorLogger())
  .handler(put)

export const getUserProfile = async (event) => {
  const { userId } = event.queryStringParameters
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'userId = :pk',
    ExpressionAttributeValues: {
      ':pk': { 'S': userId }
    }
  })
  const result = await ddbClient.send(command)
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: result }),
  };
  return response
}
