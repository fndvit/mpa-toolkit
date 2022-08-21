import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export interface MaintenanceBoxProps {
  vpc: ec2.IVpc;
}

export class MaintenanceBox extends Construct {
  securityGroup: ec2.SecurityGroup;
  instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: MaintenanceBoxProps) {
    super(scope, id);

    const { vpc } = props;

    // need to manually add ssh keys and allow inbound from ip address
    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });

    this.instance = new ec2.Instance(this, 'Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: ec2.AmazonLinuxEdition.STANDARD
      }),
      securityGroup: this.securityGroup,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    });
  }
}
