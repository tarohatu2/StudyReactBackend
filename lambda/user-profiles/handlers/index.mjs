import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' })
const tableName = process.env.TABLE_NAME

export const put = async (event) => {
  const { userId, type, name } = event
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
  return result
}

export const getUserProfile = async (event) => {
  const { userId } = event
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': { 'S': userId }
    }
  })
  const result = await ddbClient.send(command)
  return result.Items
}
