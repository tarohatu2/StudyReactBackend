import middy from '@middy/core'
import errorLogger from '@middy/error-logger'
import inputOutputLogger from '@middy/input-output-logger'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpSecurityHeaders from '@middy/http-security-headers'

import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' })
const tableName = process.env.TABLE_NAME

export const put = async (event) => {
  const { userId, type, datetime } = event.body
  if (!userId || !type || !datetime) {
    return {
      statusCode: 400
    }
  }
  const createdAt = (datetime * 10000) + 1
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      userIdType: {
        S: `${userId}-${type}`
      },
      createdAt: {
        N: `${createdAt}`
      }
    }
  })
  const result = await ddbClient.send(command)
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  }
  return response
}

export const putHandler = middy()
  .use(httpSecurityHeaders())
  .use(httpJsonBodyParser())
  .use(inputOutputLogger())
  .use(errorLogger())
  .handler(put)

const getItems = async (event) => {
  const { userId, type } = event.queryStringParameters
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'userIdType = :pk',
    ExpressionAttributeValues: {
      ':pk': { S: `${userId}-${type}` }
    }
  })
  const result = await ddbClient.send(command)
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items: result })
  }
  return response
}

export const getItemsHandler = middy()
  .use(httpSecurityHeaders())
  .use(httpJsonBodyParser())
  .use(inputOutputLogger())
  .use(errorLogger())
  .handler(getItems)
