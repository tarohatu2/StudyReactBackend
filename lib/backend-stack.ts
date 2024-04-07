import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userTable = new ddb.Table(this, 'user-table', {
      tableName: 'UserProfileTable',
      partitionKey: {
        name: "userId",
        type: ddb.AttributeType.STRING
      },
      sortKey: {
        name: "type",
        type: ddb.AttributeType.STRING
      },
      billingMode: ddb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    })

    const putUserProfileLambda = new lambda.Function(this, 'put-user-profile-lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.put',
      code: lambda.Code.fromAsset('./lambda/user-profiles/handlers'),
      memorySize: 256,
      environment: {
        TABLE_NAME: userTable.tableName
      }
    })

    const getUserProfileLambda = new lambda.Function(this, 'get-user-profile-lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.getUserProfile',
      code: lambda.Code.fromAsset('./lambda/user-profiles/handlers'),
      memorySize: 256,
      environment: {
        TABLE_NAME: userTable.tableName
      }
    })

    userTable.grantWriteData(putUserProfileLambda)
    userTable.grantReadData(getUserProfileLambda)

    const contentsTable = new ddb.Table(this, 'contents-table', {
      tableName: 'ContentsTable',
      partitionKey: {
        name: "userIdType",
        type: ddb.AttributeType.STRING
      },
      sortKey: {
        name: "createdAt",
        type: ddb.AttributeType.NUMBER
      },
      billingMode: ddb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    })

    const putUseContentsLambda = new lambda.Function(this, 'put-contents-lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.put',
      code: lambda.Code.fromAsset('./lambda/contents/handlers'),
      memorySize: 256,
      environment: {
        TABLE_NAME: contentsTable.tableName
      }
    })

    contentsTable.grantWriteData(putUseContentsLambda)
  }
}
