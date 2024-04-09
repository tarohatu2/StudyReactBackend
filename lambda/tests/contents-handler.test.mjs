import { PutItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { put, putHandler } from '../contents/handlers/index.mjs'

const ddbClient = mockClient(DynamoDBClient)

describe('putのテスト', () => {
  beforeEach(() => {
    ddbClient.reset()
  })

  it('正しいパラメータを渡した場合にputメソッドが実行できること', async () => {
    const event = {
      body: {
        userId: '1001',
        type: 'profile',
        datetime: 17000
      }
    }
    const expected = {
      userId: '1001',
      type: 'profile',
      createdAt: 170000001
    }

    ddbClient.on(PutItemCommand).resolves(expected)

    const result = await put(event)
    const resultBody = JSON.parse(result.body)
    expect(resultBody.userId).toBe(expected.userId)
  })

  it.todo('userIdが不足している時に400エラーになること')
  it.todo('typeが不足している時に400エラーになること')
  it.todo('datetimeの方が違う場合に400エラーになること')
})