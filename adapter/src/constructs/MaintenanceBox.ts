import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
// import pgdgRepo from '../assets/pgdg.repo';

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
      // init: ec2.CloudFormationInit.fromElements(
      // ec2.InitPackage.rpm(
      //   'https://yum.postgresql.org/14/redhat/rhel-7-x86_64/postgresql14-libs-14.5-1PGDG.rhel7.x86_64.rpm'
      // ),
      // ec2.InitPackage.rpm(
      //   'https://yum.postgresql.org/14/redhat/rhel-7-x86_64/postgresql14-14.5-1PGDG.rhel7.x86_64.rpm'
      // )
      //     // ec2.InitFile.fromString('/etc/yum.repos.d/pgdg.repo', pgdgRepo)
      //     // ec2.InitCommand.shellCommand('yum makecache'),
      //     // ec2.InitPackage.yum('postgresql14')
      // )
    });
  }
}
