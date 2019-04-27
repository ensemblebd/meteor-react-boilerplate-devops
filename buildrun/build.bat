@echo off
SET NODE_ENV=production

for /f "delims== tokens=1,2" %%G in (buildrun\secure_variables.txt) do set %%G=%%H

SET MONGO_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/%MONGODBDB%
REM SET MONGO_OPLOG_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/local
SET MAIL_URL=smtp://%POSTMARKUSER%:%POSTMARKPASS%@%POSTMARKHOST%:%POSTMARKPORT%

SET ROOT_URL=https://sampleapp.mycompany.com
SET SETTINGS=settings-production.json
SET OS=os.windows.x86_64
set "cwd=%cd%"
SET BUILD_PATH=\..\builds
SET BUILD_FOLDER=\sampleapp-x86_64\
SET THE_PATH=%cwd%%BUILD_PATH%%BUILD_FOLDER%

if not exist %cwd%%BUILD_PATH% mkdir %cwd%%BUILD_PATH%
if not exist %cwd%%BUILD_PATH%%BUILD_FOLDER% mkdir %cwd%%BUILD_PATH%%BUILD_FOLDER%
echo Building to: %THE_PATH%

REM ECHO meteor --settings settings-production.json
meteor build %THE_PATH% --architecture %OS% --mobile-settings %SETTINGS% --server-only --server %ROOT_URL%