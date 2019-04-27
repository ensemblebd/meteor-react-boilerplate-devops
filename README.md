# SampleApp app
App for mobile, which interacts with web server. Web server contains API for mobile device connections via app

### Usage - post installation ###
The mobile app was designed with registration capabilities. Assuming you setup email properly, you can register on mobile, then the webapp side (for administration) can be used.  

#### Development - Installing on Windows  
- Run PowerShell as admin.  
- paste & enter:  Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))  
- then type:   choco install meteor  
Now you have meteor. Clone/Checkout this repo to begin work.

If on Windows, please checkout and operate in a root C:\ drive path (or use mklink junction). The meteor bundler can fail to minify debug resources for android/ios if the path exceeds 255 characters.

#### Development - Installing on Mac
Todo.  

#### Plugins for Chrome
- https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?utm_source=chrome-app-launcher-info-dialog
- https://chrome.google.com/webstore/detail/meteor-minimongo-explorer/bpbalpgdnkieljogofnfjmgcnjcaiheg?utm_source=chrome-app-launcher-info-dialog


### Installation (first time repo usage)
Due to meteor having many user-submitted repositories, and those user's being largely unavailable to maintain their own projects, we have had to modify their sources to work properly.  
Therefore, we must install a local meteor package to override the global one provided via Atmosphere.  
1. `mkdir ./packages`   
2. `cd ./packages`  
3. `git clone https://github.com/ensemblebd/accounts-ui.git`  
4. `git clone https://github.com/ensemblebd/accounts-material-ui.git`  
Now meteor will prefer the local packages over the ones installed from Atmosphere globally.    

Then install MongoDB locally (optional).  
If doing local, here's a snippet to make a user easily: 
```
db.createUser(
  {
    user: "sauser",
    pwd: "q34n6jfte",
    roles: [ { role: "readWrite", db: "sampleappdev" } ],
    mechanisms:[  
      "SCRAM-SHA-1"
    ]
  }
)
```   
The IP Address used is in ./buildrun/secure_settings.txt (rename the .sample, and edit).  IP, User, and Pass are all in there.
You can tweak the .bat files as desired, but it should work as is, as per npm commands below.   

PostMark was chosen for the Email system, and so you can provision your api key in that same secure_settings.txt file (on .gitignore).  
Sample file has a fake GUID. Please access postmark Server credentials tab and paste it in.  
  
Then run:  
1. `npm install`  
2. `meteor npm install`  
3. Use the ./buildrun/ folder for various runtimes, or see npm commands below.  

#### NPM Commands:
Development build execution:  
- npm run dev          // will execute website version. Access on http://localhost:3000  
- npm run android      // will inject app & connect to local android phone over usb, and launch it. Hot reload and remote chrome debug permitted.    
- npm run ios          // todo: needs tested. Should operate same as android based on online docs.  Need to steal coworkers phone :P   
Production run and build:  
- npm start            // run website in production build (deployed on server).  
- npm build            // compile website version (aka server) for deployment later on (zip produced).  
- npm build android    // compile APK for android (warning, you must setup your ssh keys)  
- npm build ios        // todo.  

#### Notes
The ./settings.json file contains variables to be made global to all files. Public section is the only one visible to client-side code. Any other section or variable is only available to server.
This is by meteor design.
The ./buildrun/ folder contains the bat and shell scripts used to operate the npm commands above.  
And the package.json sources those scripts for easy cli usage.  


#### Client vs Server folders.  
- these are contained within the ./imports folder.  
- 	./imports/startup  
	client folder contains client code. ONLY.  
	server folder is visa versa.  
	The only exception is the lib folder.  ./api/connection.js should be used to register models, and subscribe the client to those models for live updates.
	(system uses DDP, to remotely connect to server, maintaining a "MicroMongo" instance on the client itself for transitional and state awareness )  
- 	./imports/ui  
	Contains all jsx files (react components, containers, and rendered pages.  
-   ./imports/api  
	Contains server code to be made available as callable methods/actions for the client code.  

#### See Also
   - https://github.com/jagi/meteor-astronomy/


## Originally Sourced Upon: meteor-react-boilerplate
https://github.com/AdamBrodzinski/meteor-react-boilerplate
A starter project for React &amp; Meteor  
  
This repo aims to get you up and running with with React with little effort. It has sane defaults that  
most apps will use (router, accounts).  
  
Most of the content is in the 'imports' folder so that we can so serverside rendering more easily. Here's the
rundown on what's included.

For an in-depth example of how to use Meteor with React see
[React-ive Meteor](https://github.com/AdamBrodzinski/react-ive-meteor). For flux support see the [Flux Leaderboard](https://github.com/AdamBrodzinski/meteor-flux-leaderboard) example app.

#### APIs & Packages
- [Session](https://docs.meteor.com/api/session.html)
- [Logging](https://atmospherejs.com/meteor/logging)
- [Reload](https://atmospherejs.com/meteor/reload)
- [Random](https://docs.meteor.com/packages/random.html)
- [EJSON](https://docs.meteor.com/api/ejson.html)
- [Spacebars](https://docs.meteor.com/packages/spacebars.html)
- [Check](https://docs.meteor.com/api/check.html)
- [Accounts Password](http://docs.meteor.com/api/passwords.html)
- [Accounts UI](https://docs.meteor.com/packages/accounts-ui.html) (with React wrapper)
- [Std:Accounts UI](https://github.com/studiointeract/accounts-ui) // provides full suite of account objects.
- [gadicc:blaze-react-component](https://github.com/gadicc/meteor-blaze-react-component/)
- [mystor:meteor-device-detection] (https://github.com/mystor/meteor-device-detection)

#### NPM
- React
- React DOM
- [React Router](https://github.com/reactjs/react-router)
- [Classnames](https://github.com/JedWatson/classnames)
- [History](https://github.com/ReactTraining/history)

#### Components
- Header
- LoginButtons

#### Models
- User
- (See a more [complex example](https://github.com/AdamBrodzinski/react-ive-meteor/blob/master/both/models/post.js))

#### Pages/Routes
- Home, About
- Not Found
- Main Layout

