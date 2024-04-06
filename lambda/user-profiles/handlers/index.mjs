import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' })
const tableName = process.env.TABLE_NAME

export const put = async (event) => {
  const { userId, type, name } = event
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      userId,
      type,
      name
    }
  })
  const result = await ddbClient.send(command)
  return result
}
