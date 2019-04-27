@echo off
SET NODE_ENV=dev
for /f "delims== tokens=1,2" %%G in (buildrun\secure_variables.txt) do set %%G=%%H

SET MONGO_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/%MONGODBDB%
REM SET MONGO_OPLOG_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/local
SET MAIL_URL=smtp://%POSTMARKUSER%:%POSTMARKPASS%@%POSTMARKHOST%:%POSTMARKPORT%

for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a

echo meteor run android-device --settings settings-mobile.json --mobile-server http://%NetworkIP%:3000
meteor run android-device --settings settings-mobile.json --mobile-server http://%NetworkIP%:3000