import { PutItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { putHandler } from '../contents/handlers/index.mjs'

const ddbClient = mockClient(DynamoDBClient)

describe('putHandlerのテスト', () => {
  beforeEach(() => {
    ddbClient.reset()
  })

  it.todo('正しいパラメータを渡した場合にputメソッドが実行できること')
  it.todo('userIdが不足している時に400エラーになること')
  it.todo('typeが不足している時に400エラーになること')
  it.todo('datetimeの方が違う場合に400エラーになること')
})