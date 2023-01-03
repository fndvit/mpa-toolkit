import AWS from 'aws-sdk';
import type { IterableElement } from 'type-fest';
import type { Payload, SqlDump } from '@mpa/migration-runner';

export { Payload, SqlDump };

AWS.config = new AWS.Config({
  credentials: new AWS.SharedIniFileCredentials({ profile: 'mpath' }),
  region: 'eu-west-1'
});

const tag = new AWS.ResourceGroupsTaggingAPI();
const s3 = new AWS.S3();
const cf = new AWS.CloudFormation();

export interface Stack {
  name: string;
  environment: string;
}

export interface Stacks {
  shared: Stack;
  environment: Stack[];
}

const lambda = new AWS.Lambda();

export async function getStackOutputs(stackName: string) {
  const descs = await cf.describeStacks({ StackName: stackName }).promise();

  if (!descs.Stacks || descs.Stacks.length === 0) throw new Error(`Couldn't find stack: ${stackName}`);

  const [{ Outputs }] = descs.Stacks;

  const outputs = Outputs as Required<IterableElement<typeof Outputs>>[];

  return outputs?.reduce<Record<string, string>>((acc, o) => ({ ...acc, [o.OutputKey]: o.OutputValue }), {}) || [];
}

const isShared = (shared: boolean) => (s: AWS.ResourceGroupsTaggingAPI.ResourceTagMapping) =>
  !!s.Tags?.find(t => t.Key === 'Environment' && (t.Value === 'shared') === shared);

const isAdminBucket = (r: AWS.CloudFormation.StackResourceSummary) =>
  r.LogicalResourceId.startsWith('AdminBucket') && r.ResourceType === 'AWS::S3::Bucket';

export const getStackResources = async (stackName: string) =>
  cf
    .listStackResources({ StackName: stackName })
    .promise()
    .then(({ StackResourceSummaries }) => {
      if (!StackResourceSummaries) throw new Error('No shared resources found');
      return StackResourceSummaries;
    });

export const getStacks = async () => {
  const resources = await tag
    .getResources({
      TagFilters: [{ Key: 'Project', Values: ['mpath'] }],
      ResourceTypeFilters: ['cloudformation:stack']
    })
    .promise()
    .then(({ ResourceTagMappingList: resources }) => {
      if (!resources) throw new Error('No stacks found');
      return resources;
    });
  const sharedStackName = resources.find(isShared(true))?.ResourceARN?.split('/')[1];
  if (!sharedStackName) throw new Error('No shared stack found');

  return {
    shared: {
      name: sharedStackName,
      environment: 'shared'
    },
    environment: resources
      .filter(isShared(false))
      .map(s => ({
        name: s.ResourceARN?.split('/')[1],
        environment: s.Tags?.find(t => t.Key === 'Environment')?.Value
      }))
      .filter(s => s.name && s.environment) as Stack[]
  } as Stacks;
};

export async function getAdminBucket(stackName: string) {
  const sharedStackResources = await getStackResources(stackName);
  const adminBucketName = sharedStackResources.find(isAdminBucket)?.PhysicalResourceId;
  if (!adminBucketName) throw new Error(`No admin bucket found\n\n${JSON.stringify(sharedStackResources, null, 2)}}`);
  return adminBucketName;
}

export async function getMigrationRunnerArn(stackName: string) {
  const outputs = await getStackOutputs(stackName);

  if (!outputs.MigrationRunnerLambdaArn)
    throw new Error(`Couldn't find MigrationRunner ARN in stack outputs (MigrationRunnerLambdaArn)`);

  const match = /function:(?<fnName>.*)/.exec(outputs.MigrationRunnerLambdaArn);
  if (!match?.groups) throw new Error(`Couldn't find function name in ARN: ${outputs.MigrationRunnerLambdaArn}`);

  return match.groups.fnName;
}

export class InvocationError extends Error {
  constructor(public readonly response: AWS.Lambda.InvocationResponse) {
    super('Error invoking lambda');
  }

  get payload() {
    return this.response.Payload && typeof this.response.Payload === 'string'
      ? JSON.parse(this.response.Payload)
      : this.response.Payload;
  }

  get trace() {
    return this.payload?.trace?.join('\n');
  }
}

export async function invokeFunction(fnName: string, payload: Payload) {
  const response = await lambda
    .invoke({
      FunctionName: fnName,
      Payload: JSON.stringify(payload)
    })
    .promise();

  if (response.FunctionError) throw new InvocationError(response);

  return response;
}

export const getDumps = async (bucketName: string) =>
  s3
    .listObjectsV2({ Bucket: bucketName, Prefix: 'dumps/' })
    .promise()
    .then(({ Contents: dumps }) => dumps || [])
    .then(dumps =>
      dumps.map(d => ({
        key: d.Key!,
        lastModified: d.LastModified!,
        size: d.Size!
      }))
    );
export type Dump = Awaited<ReturnType<typeof getDumps>>[number];
