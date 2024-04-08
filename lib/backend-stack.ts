import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ユーザ情報管理テーブルの設定
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
      handler: 'user-profiles/handlers/index.putHandler',
      code: lambda.Code.fromAsset('./lambda'),
      memorySize: 256,
      environment: {
        TABLE_NAME: userTable.tableName
      }
    })

    const getUserProfileLambda = new lambda.Function(this, 'get-user-profile-lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'user-profiles/handlers/index.getUserProfile',
      code: lambda.Code.fromAsset('./lambda'),
      memorySize: 256,
      environment: {
        TABLE_NAME: userTable.tableName
      }
    })

    userTable.grantWriteData(putUserProfileLambda)
    userTable.grantReadData(getUserProfileLambda)

    // コンテンツ管理テーブルの設定
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
      handler: 'contents/handlers/index.putHandler',
      code: lambda.Code.fromAsset('./lambda'),
      memorySize: 256,
      environment: {
        TABLE_NAME: contentsTable.tableName
      }
    })

    const getContentsLambda = new lambda.Function(this, 'get-contents-lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'contents/handlers/index.getItemsHander',
      code: lambda.Code.fromAsset('./lambda'),
      memorySize: 256,
      environment: {
        TABLE_NAME: contentsTable.tableName
      }
    })
    
    contentsTable.grantWriteData(putUseContentsLambda)
    contentsTable.grantReadData(getContentsLambda)

    // API Gatewayの設定
    const gateway = new apiGateway.RestApi(this, 'user-api-gateway', {
      deployOptions: {
        stageName: 'v1'
      },
      restApiName: 'user-api'
    })

    const resourceUserProfile = gateway.root.addResource('profile')
    resourceUserProfile.addMethod('POST', new apiGateway.LambdaIntegration(putUserProfileLambda))
    resourceUserProfile.addMethod('GET', new apiGateway.LambdaIntegration(getUserProfileLambda))

    const resourceContents = gateway.root.addResource('contents')
    resourceContents.addMethod('POST', new apiGateway.LambdaIntegration(putUseContentsLambda))
    resourceContents.addMethod('GET', new apiGateway.LambdaIntegration(getContentsLambda))
    
    new cdk.CfnOutput(this, 'api-gateway-url', {
      description: 'apigateway endpoint',
      value: gateway.url
    })
  }
}
