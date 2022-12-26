#!/bin/bash

echo "Creating EC2 instance"

#Define variables
region="us-east-1"
echo "Region: "$region
instanceType="t2.micro"
echo "Instance Type: "$instanceType

#Create VPC
aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 --region $region \
    --tag-specification 'ResourceType=vpc,Tags=[{Key=Name,Value=TaskBVpc}]'
vpc=$(aws ec2 describe-vpcs --region $region --filters 'Name=tag:Name,Values=TaskBVpc' --query 'Vpcs[*].VpcId')
echo "VPC: "$vpc

#Create subnet
aws ec2 create-subnet \
    --vpc-id $vpc --region $region --availability-zone us-east-1a\
    --cidr-block 10.0.0.0/24 \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=TaskB-Public-Subnet}]'
#Assign subnet id to a variable
subnet=$(aws ec2 describe-subnets --filters 'Name=tag:Name,Values=TaskB-Public-Subnet' --query Subnets[].SubnetId --output text)
echo "VPC: "$vpc

#Create security group
echo "Creating a new security group..."
securityGroup=$(aws ec2 create-security-group --group-name "TaskB Static Web SG" \
--description "TaskB Static Web SG" \
--region $region \
--vpc-id $vpc | grep GroupId | cut -d '"' -f4 )
echo "Security Group: "$securityGroup

#Open port 22 and 80 for the security group
echo "Opening port 22 in the new security group"
aws ec2 authorize-security-group-ingress \
--group-id $securityGroup \
--protocol tcp \
--port 22 \
--cidr 0.0.0.0/0 \
--region $region
echo "Opening port 80 in the new security group"
aws ec2 authorize-security-group-ingress \
--group-id $securityGroup \
--protocol tcp \
--port 80 \
--cidr 0.0.0.0/0 \
--region $region

#Create instance key pair
aws ec2 create-key-pair --key-name taskBKey --key-format ppk

#Create ec2 instance
aws ec2 run-instances \
--count 1 \
--instance-type $instanceType \
--region $region \
--subnet-id $subnet \
--security-group-ids $securityGroup \
--tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=mompopcafeserver}]' \
--associate-public-ip-address \
--user-data file://taskBUserdata.txt
