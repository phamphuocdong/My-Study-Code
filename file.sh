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
vpc=$(aws ec2 describe-vpcs --region $region --filters 'Name=tag:Name,Values=TaskBVpc' --query 'Vpcs[*].VpcId' --output text)
echo "VPC: "$vpc

#Create subnet
aws ec2 create-subnet \
    --vpc-id $vpc --region $region --availability-zone us-east-1a\
    --cidr-block 10.0.0.0/24 \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=TaskB-Public-Subnet}]'
#Assign subnet id to a variable
subnet=$(aws ec2 describe-subnets --filters 'Name=tag:Name,Values=TaskB-Public-Subnet' --query Subnets[].SubnetId --output text)
echo "Subnet: "$subnet

#Create internet gateway
aws ec2 create-internet-gateway --region $region \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=TaskB-Igw}]'
igw=$(aws ec2 describe-internet-gateways --filters 'Name=tag:Name,Values=TaskB-Igw' --query InternetGateways[].InternetGatewayId --output text --region $region)

#Attach IGW to VPC
aws ec2 attach-internet-gateway --internet-gateway-id $igw --vpc-id $vpc --region $region

#Create route table
aws ec2 create-route-table --vpc-id $vpc --region $region \
    --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=TaskB-Public-Route-Table}]'
routeTable=$(aws ec2 describe-internet-gateways --filters 'Name=tag:Name,Values=TaskB-Igw' --query InternetGateways[].InternetGatewayId --output text --region $region)

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
echo "Creating a key pair"
aws ec2 create-key-pair --key-name taskBKey --region us-east-1
key=$(aws ec2 describe-key-pairs --region us-east-1 | grep taskBKey | cut -d '"' -f4 )
echo "Key pair: "$key

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