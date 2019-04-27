@echo off

SET DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com
SET HOST_CNAME=app.sampleapp.mycompany.com

meteor deploy %HOST_CNAME% --settings settings-production.json