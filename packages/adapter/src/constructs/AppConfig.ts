import { Construct } from 'constructs';
import { aws_appconfig as appconfig } from 'aws-cdk-lib';

export interface AppConfigProps {
  app: string;
  name: string;
}

const defaultProps: AppConfigProps = {
  app: 'mpa',
  name: 'features'
};

export class AppConfig extends Construct {
  constructor(scope: Construct, id: string, props: AppConfigProps = defaultProps) {
    super(scope, id);

    const appConfig = new appconfig.CfnApplication(this, 'App', {
      name: props.app,
      description: 'Configuration for MPA application'
    });

    new appconfig.CfnEnvironment(this, 'ProductionEnv', {
      applicationId: appConfig.ref,
      name: 'prod'
    });

    const profile = new appconfig.CfnConfigurationProfile(this, 'Profile', {
      applicationId: appConfig.ref,
      type: 'AWS.AppConfig.FeatureFlags',
      name: props.name,
      locationUri: 'hosted',
      description: 'MPA Application feature flags'
    });

    const initialConfig = {
      flags: {
        readonly: {
          name: 'readonly'
        }
      },
      values: {
        readonly: {
          enabled: false
        }
      },
      version: '1'
    };

    new appconfig.CfnHostedConfigurationVersion(this, 'Version', {
      applicationId: appConfig.ref,
      configurationProfileId: profile.ref,
      contentType: 'application/json',
      content: JSON.stringify(initialConfig)
    });

    new appconfig.CfnDeploymentStrategy(this, 'DeployStrategy', {
      name: 'AppConfig-DeployStrategy',
      deploymentDurationInMinutes: 0,
      finalBakeTimeInMinutes: 0,
      growthFactor: 20,
      replicateTo: 'NONE'
    });
  }
}
