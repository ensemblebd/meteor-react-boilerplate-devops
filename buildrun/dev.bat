@echo off
SET NODE_ENV=dev
for /f "delims== tokens=1,2" %%G in (buildrun\secure_variables.txt) do set %%G=%%H

SET MONGO_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/%MONGODBDB%
REM SET MONGO_OPLOG_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/local
SET MAIL_URL=smtp://%POSTMARKUSER%:%POSTMARKPASS%@%POSTMARKHOST%:%POSTMARKPORT%

REM SET ROOT_URL=http://localhost

echo meteor --settings settings.json
meteor --settings settings.json