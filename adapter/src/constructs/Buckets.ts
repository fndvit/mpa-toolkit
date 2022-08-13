import { Construct } from 'constructs';
import { aws_ec2 as ec2, aws_s3 as s3, RemovalPolicy } from 'aws-cdk-lib';

export interface BucketsProps {
  vpc: ec2.IVpc;
}

export class Buckets extends Construct {
  static: s3.Bucket;
  upload: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.static = new s3.Bucket(this, 'Static', {
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: true
    });

    this.upload = new s3.Bucket(this, 'Upload', {
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: true
    });
  }
}
