#!/bin/bash

aws cloudformation deploy \ 
 --stack-name github-oidc \ 
 --capabilities CAPABILITY_IAM \ 
 --template-file cf-template.yaml  \ 
 --parameter-overrides GitHubOrg=tarohatu2 RepositoryName=StudyReactBackend \ 
 --profile deploy_role