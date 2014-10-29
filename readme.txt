Instructions for developers/code deployers
------------------------------------------
For the very first time after taking the code, in order to build node_modules go to project folder and execute:
npm install

To run db server, open terminal/cmd go to the project folder and execute:
mongod --dbpath ./database

To run node server:
In development, open terminal/cmd and go to project folder and execute:
node server/start.js
In production execute,
NODE_ENV=production node server/start.js

To monitor and keep creating browserify js bundle for home page, open terminal/cmd and go to project folder and execute:
watchify client/pages/home/home_controller.js -v -d -o client/js/home_bundle.js

Similarly as we change other pages need to run watchify/browserify for those modules, eg:
watchify client/pages/listresults/listresults.js -v -d -o client/js/list_bundle.js

—————————

html developers can edit html to fetch images/js/css statically by adding the following:
<base href="file:///Users/home/nodejsprojects/1stopwed/client/">
please remove it after html development.
