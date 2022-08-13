import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';

export class PrismaLayers extends Construct {
  clientFiles: lambda.LayerVersion;
  migration: lambda.LayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const prismaClientFiles = [
      'index.js',
      'package.json',
      'schema.prisma',
      'libquery_engine-rhel-openssl-1.0.x.so.node'
    ];

    this.clientFiles = new lambda.LayerVersion(this, 'ClientFiles', {
      code: new lambda.AssetCode('node_modules/.prisma/client', {
        exclude: [`/node_modules/.prisma/client/!(${prismaClientFiles.join('|')})`]
      })
    });

    this.migration = new lambda.LayerVersion(this, 'MigrationFiles', {
      code: new lambda.AssetCode('./prisma')
    });
  }
}
