@echo off
SET NODE_ENV=production
for /f "delims== tokens=1,2" %%G in (buildrun\secure_variables.txt) do set %%G=%%H

SET MONGO_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/%MONGODBDB%
REM SET MONGO_OPLOG_URL=mongodb://%MONGODBUSER%:%MONGODBPASS%@%MONGODBHOST%:%MONGODBPORT%/local
SET MAIL_URL=smtp://%POSTMARKUSER%:%POSTMARKPASS%@%POSTMARKHOST%:%POSTMARKPORT%

SET ROOT_URL=https://sampleapp.mycompany.com
SET SETTINGS=settings-production.json
set "cwd=%cd%"
SET BUILD_PATH=\..\builds
SET BUILD_FOLDER=\sampleapp-x86_64\
SET THE_PATH=%cwd%%BUILD_PATH%%BUILD_FOLDER%

if not exist %cwd%%BUILD_PATH% mkdir %cwd%%BUILD_PATH%
if not exist %cwd%%BUILD_PATH%%BUILD_FOLDER% mkdir %cwd%%BUILD_PATH%%BUILD_FOLDER%
echo Building to: %THE_PATH%

REM ECHO meteor --settings settings-production.json
meteor build %THE_PATH% --mobile-settings %SETTINGS% --server %ROOT_URL%

if exist %THE_PATH%android\release-unsigned.apk (

    echo Signing APK..
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -tsa http://sha256timestamp.ws.symantec.com/sha256/timestamp -keystore %USERPROFILE%\.android\sampleapp.keystore -storepass %APKSTOREPASS% -keypass %APKKEYPASS% release-unsigned.apk sampleapp
    echo -----------
    echo Optimizing APK...
    %ANDROID_HOME%/build-tools/27.0.1/zipalign 4 release-unsigned.apk sampleapp.apk

    REM todo: consider automatic deployment to app store alpha/beta release
) else (
    echo Couldn't find APK for signing.
)