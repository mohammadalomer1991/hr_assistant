#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { S3Stack } from '../lib/s3-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  
});
new S3Stack(app,"mystack",{});