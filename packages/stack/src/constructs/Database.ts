import { Construct } from 'constructs';
import { aws_ec2 as ec2, aws_rds as rds, Duration, RemovalPolicy } from 'aws-cdk-lib';

export interface DatabaseProps {
  vpc: ec2.IVpc;
  port: number;
  databaseName: string;
  stage: string;
}

export class Database extends Construct {
  securityGroup: ec2.SecurityGroup;
  instance: rds.DatabaseInstance;
  url: string;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const { vpc, port, databaseName, stage } = props;

    const instanceIdentifier = `mpath-${stage}`;

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      allowAllOutbound: false
    });

    const credsSecretName = `/${id}/rds/creds/${instanceIdentifier}`.toLowerCase();
    const dbSecret = new rds.DatabaseSecret(this, 'PostgresRdsCredentials', {
      secretName: credsSecretName,
      username: 'mpa'
    });
    const credentials = rds.Credentials.fromSecret(dbSecret);

    if (!credentials.password) throw new Error(`No password in credentials`); // can this happen?

    this.instance = new rds.DatabaseInstance(this, 'PostgresInstance', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceIdentifier,
      databaseName,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [this.securityGroup],
      port,
      credentials,
      removalPolicy: RemovalPolicy.SNAPSHOT,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
      backupRetention: Duration.days(7)
    });

    const { username } = credentials;
    const password = credentials.password.toString();
    const { hostname } = this.instance.instanceEndpoint;

    this.url = `postgresql://${username}:${password}@${hostname}:${port}/${databaseName}?schema=public`;
  }
}
