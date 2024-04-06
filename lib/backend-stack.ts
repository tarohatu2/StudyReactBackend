import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb'

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

    const ContentsTable = new ddb.Table(this, 'contents-table', {
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
  }
}
