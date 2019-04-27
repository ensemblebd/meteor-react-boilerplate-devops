@echo off
SET NODE_ENV=production
for /f "delims== tokens=1,2" %%G in (buildrun\secure_variables.txt) do set %%G=%%H

SET MONGO_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/%MONGODBDB%
REM SET MONGO_OPLOG_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/local
SET MAIL_URL=smtp://%POSTMARKUSER%:%POSTMARKPASS%@%POSTMARKHOST%:%POSTMARKPORT%

meteor --settings settings.json --server-only