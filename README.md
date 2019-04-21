# Setting up a Full-Stack TypeScript Application: featuring Express and React

Great for projects of any size… startups and enterprises!

## The TypeScript world is limitless

Many will tell you that NodeJS is better suited for small projects and that static, compiled languages like Java/C# are better for large enterprise applications. This is where TypeScript comes in handy; it gives you the rapid development of a scripting language combined with the type safety of a static language. If you already know JavaScript, the learning curve for TypeScript is extremely small. TypeScript just requires a little extra setup at the beginning because it’s well… a superset and not technically a language.

Just to point it out, I’m sure there are tutorials all over the web showing you how to setup TypeScript for React or NodeJS. But the ones I’ve run into have been pretty piecemeal and I’ve never really read one that was comprehensive enough. The point of this article is to show you how to setup TypeScript for both front and back-end development, and also debug, unit-test, and then build everything together for production.
All the source code is available at the following repository. You should observe the corresponding files/folders in the repo while reading this article.

seanpmaxwell/TypeScriptFullStackShell

## Folder Hierarchy

To keep things organized we’re going to put all the configuration and dependencies for our back-end at the root of our directory. We’ll generate everything needed for the front-end using the create-react-app npm module and nest it in the src/public/react/ folder. The reason for putting our React app here and not in its own separate folder at the root is that as your web-application grows, you might end up serving some pages that are not part of the main React app or you could even end up serving multiple react apps.

To give an example, you might end up having all the front-end content accessible by regular users served at one Express route contained within a single React app. At the same time, content used by your site Administrators could be served at a different Express route in another React app. For this tutorial though, we’re only going to setup one React project.

Create a folder to serve as the root and give it the name of whatever your app is going to be. I’m just going to call mine root. Run npm init inside of it to turn it into an npm package and generate a package.json file. Create a another a file named src/ to hold our front-end and back-end code and another named util/ which will hold our files for production building.

```javascript
root/
  src/
    public/
      react/
        demo-react/
  util/
  package.json
```

## TypeScript for the Back-End

### Setup ts-node

To start coding in TypeScript, we need to install the dependencies that will transpile our code and then create configuration files (although they are not strictly required) that set rules for how they are transpiled. At the root of your app install ts-node and nodemon, which runs our .ts files directly during development and can also restart our server when changes are detected, and typescript, to turn our .ts files in .js files. These modules are for development so make sure to use the -D option.

```npm i -D ts-node nodemon typescript tslint```

To specify rules for transpilation, create a file named **tsconfig.json** at root/ and paste in the following contents. Note lines 11 and 23 in the following snippet. If you plan on debugging with an IDE like Webstorm or VsCode, we need to generate .js.map files which is what “sourcemap” on line 8 is for.

```javascript
{
  "compileOnSave": true,
  "compilerOptions": {
    "module": "commonjs",
    "strict": true,
    "baseUrl": "./",
    "outDir": "build",
    "sourceMap": true,
    "removeComments": true,
    "experimentalDecorators": true,
    "target": "es5",
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "strictNullChecks": true,
    "importHelpers": true,
    "types": [
      "node"
    ],
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2015",
      "dom"
    ]
  },
  "include": [
    "./src/**/*.ts"
  ],
  "exclude": [
    "./src/**/*.test.ts",
    "./src/public/"
  ]
}
```

The unit-test test files we’ll eventually create will end with .test.ts and aren’t needed for production so make sure to exclude those in addition to any front-end folders, which will have their own build scripts.


To enforce a set of coding standards for your TypeScript, create another file named **tslint.json**. I tend to set mine pretty strict cause I like to follow convention, but feel free to play around with these settings if you want.

```javascript
{
  "rules": {
    "class-name": true,
    "curly": true,
    "eofline": false,
    "forin": true,
    "indent": false,
    "label-position": true,
    "label-undefined": true,
    "max-line-length": [true, 100],
    "no-arg": true,
    "no-bitwise": true,
    "no-console": true,
    "no-construct": true,
    "no-constructor-vars": false,
    "no-debugger": true,
    "no-duplicate-key": true,
    "no-duplicate-variable": true,
    "no-empty": true,
    "no-eval": true,
    "no-string-literal": true,
    "no-switch-case-fall-through": true,
    "no-trailing-whitespace": true,
    "no-unused-expression": true,
    "no-unused-variable": true,
    "no-unreachable": true,
    "no-use-before-declare": true,
    "no-var-requires": false,
    "one-line": [
      true,
      "check-open-brace",
      "check-catch",
      "check-else",
      "check-whitespace"
    ],
    "quotemark": [true, "single"],
    "semicolon": [true, "always"],
    "triple-equals": [true, "allow-null-check"],
    "typedef": [
      true,
      "callSignature",
      "indexSignature",
      "parameter",
      "propertySignature",
      "variableDeclarator",
      "memberVariableDeclarator"
    ],
    "use-strict": true,
    "variable-name": [
      true,
      "allow-leading-underscore"
    ],
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-separator",
      "check-type"
    ],
    "prefer-const": true
  }
}
```

## Create a Server

Now we can finally start writing some TypeScript. Under src/ create a server file which will configure and run Express. We could use the plain express module by itself but I think we should take advantage of the fact that we’re using TypeScript. OvernightJS is a simple library to wrap decorators around Express Router objects so you don’t have to instantiate one for every API that you create. It’s not an abstraction on top of Express nor is it meant to change the way you interact with it. That’s why I like it more than some of these large frameworks like NestJS or typescript-express-decorators.

@overnightjs/core

TypeScript decorators for the Express web server. Part of the OvernightJS project.

Install @overnightjs/core, create a server file, and extend the Server class from whatever you name your server class.

```npm i -s overnightjs/core```

```javascript
import { Server } from '@overnightjs/core';
import { cimp } from 'simple-color-print';


class DemoServer extends Server {
    private _port = 3001;
    private readonly _SERVER_START_MSG = 'Demo server started on port: ';


    constructor() {
        super();
    }


    public start(): void {
        this.app.listen(this._port, () => {
            cimp(this._SERVER_START_MSG + this._port);
        });
    }
}

export default DemoServer;
```

### Create a start.ts file

I’m sure you’re ready to see your code in action… but first!! To make running/building our application a little faster let’s create a **start.ts** file which can kick everything off. Notice the “scripts” key in our package.json file. Each property within “scripts” is like a mini-bash script that we can run with npm run “whatever the key is”. This along with the **start.ts** file will enable us to run/test/build our code with just a small set of npm run … commands.

Add another file to root/ named start.ts and give it some if-else statements to check whether we’re running for development/production or testing. For the moment, let’s just start the server. We’ll complete this file as we go through different sections.

```javascript
import DemoServer from './DemoServer';

// Start the server or run tests
if (process.argv[2] !== 'test') {

    let server = new DemoServer();
    server.start();

} else {
```

To avoid having to start and stop Express every time the code changes, let’s use nodemon to restart ts-node whenever there’s a change in a source file. nodemon can import it settings directly from the command-line or from a file: a file is easier so let’s use that. Place the file **nodemon.json** under util/.

```javascript
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/public"],
  "exec": "ts-node src/start.ts dev"
}
```

So other developers don’t have to enter a long command each time, let’s add nodemon as a property to **package.json**’s “scripts”.

```javascript
{
  "name": "typescriptfullstackshell",
  "version": "1.0.0",
  "description": "Demonstrate how to do full-stack TypeScript development",
  "main": "start.js",
  "scripts": {
    "start:express": "nodemon --config \"./util/nodemon.json\"/",
```

The command on line 7 will transpile the code, start a watcher that looks out for code changes based on our tsconfig.json file, and restart the server with the “dev” argument every time we run:

```npm run start:express```

Go ahead and run the command and you should see the _SERVER_START_MSG print out to the console. Make a change to the server file (port or start message) and you should the see the Express server restart and the changes immediately.

Congrats!! You’ve see up a Express/TypeScript development server.

## Making an API

Having an Express server which doesn’t do anything isn’t much fun to play around with, so using OvernightJS let’s make a single, simple API that just prints out some text and sends back a JSON response. Create a folder under src/ named controllers/, add a controller file and name it whatever you want: I named mine DemoController.ts. Give it a single API for now (you can add more later) using the OvernightJS’s route decorators, and give the route a try/catch block which handles a response for errors. This will be useful for showing you how to unit-test later on.

```javascript
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { cinfo, cerr } from 'simple-color-print';


@Controller('api/say-hello')
class DemoController {

    public readonly SUC_MSG = 'hello';
    public readonly ERR_MSG = 'can\'t say hello';


    @Get(':name')
    private sayHello(req: Request, res: Response): void {

        try {

            const name = req.params.name;

            if (name === 'makeitfail') {
                throw Error('User triggered failure');
            }

            cinfo('API: "GET /api/say-hello/:name" called with param: ' + name);

            res.status(250).json({response: this.SUC_MSG});
        } catch (err) {
            cerr(err);
            res.status(400).json({response: this.ERR_MSG});
        }
    }
}

export default DemoController;
```

Back in the server file, setup Express to parse JSONs and import/activate the controller we just created. So we don’t trigger an error when visiting localhost:3001 in the browser, let’s also setup a default response for that too when running the server in development mode.

```javascript
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { cimp, cinfo } from 'simple-color-print';
import DemoController from './controllers/demo/DemoController';


class DemoServer extends Server {

    private readonly _SERVER_START_MSG = 'Demo server started on port: ';
    private readonly _DEV_MSG = 'Express Server is running in development mode. Start the React ' +
        'development server "npm run start:react" to develop front-end content. Back-end is ' +
        'currently running on port: ';

    private _port = 3001;


    constructor() {
        super();

        // Setup json middleware
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        // Setup the controllers
        super.addControllers(new DemoController());

        // Point to front-end code
        if (process.env.NODE_ENV !== 'production') {
            cinfo('Starting server in development mode');
            const msg = this._DEV_MSG + process.env.EXPRESS_PORT;
            this.app.get('*', (req, res) => res.send(msg));
        }
    }


    public start(): void {
        this.app.listen(this._port, () => {
            cimp(this._SERVER_START_MSG + this._port);
        });
    }
}

export default DemoController;
```

Restart nodemon, and fire off a GET request, using an API calling tool of your choice (such as Postman), to **localhost:3001/api/say-hello/:name**. Make sure that that you get a return value and that the Express route fires an error when you pass in makeitfail as the parameter.

If all is well we can move on to our front-end!

## Creating a React App

This is going to require much less configuration because create-react-app will spin up a shell for our project and import all the necessary dependencies. All we have to do is connect the front to the back so we can develop each one separately while still activating our Express APIs from within React.

Download the create-react-app globally (or use npx), navigate to **src/public/react/**, and create a new TypeScript React project:

```shell
cd src/public/react/
npx create-react-app demo-react --typescript
```

Navigate to **demo-react/**, run npm start, and at **localhost:3000** you should see the React sample page.

## Linking the Front and Back together during Development

Now that we have a front and back-end, we need to setup a proxy so your http request will go to to Express instead of the React development server. To make sure our configuration works, let’s put some code inside React that sends a request to our ‘say-hello’ API. To keep it simple, just add something that gets fired automatically for right now. If you want to display a response in the browser you’ll need to convert the response to a JSON format (see line 14 below). Using fetch, I added a get request in **demo-react/src/App.tsx**.

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {

    async function callExpress() {

      try {

        let response = await fetch('/api/say-hello/SeanMaxwell')
                              .then(res => res.json());

        alert('Hi this is a response from the backend: ' + response.response);

      } catch (err) {
        alert(err);
      }
    }

    callExpress();
    ...
```

Now to channel our requests to the back-end, add the proxy property to the React app’s **package.json** file and set the value to the url:port that Express is running on. See line 21 below.

```javascript
{
  "name": "demo-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/jest": "23.3.13",
    "@types/node": "10.12.18",
    "@types/react": "16.7.20",
    "@types/react-dom": "16.0.11",
    "react": "^16.7.0",
    "react-dom": "^16.7.0",
    "react-scripts": "2.1.3",
    "typescript": "3.2.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:3001",
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```

If React’s dev server is currently running, save the file (you should see the browser refresh automatically) and an alert should appear with the API’s response.

## Unit-Testing the Back-End

Congrats, you’ve got a full-stack Express/React app setup for development. The tools you need for testing the front are packaged for you with create-react-app, but since we’ve been doing the back from scratch let’s go over how to start testing for it. There are a number of testing tools you can use but the ones I like the best are Jasmine and Supertest. Jasmine allows you to write business-driven-development test with describe() and it(). Supertest enables us to fire off API calls inside our TypScript code passing along any data we want to and providing a callback for the responses where we make our tests’ assertions.

Install the two dependencies for testing and their corresponding @types/ packages:

```npm i -D jasmine @types/jasmine supertest @types/supertest```

## Test Server

Create another file in the controllers/demo folder with the same name as your last controller file but appended with .test.ts. To make the the API calls, Supertest needs to get an instance of our Express app. We don’t actually want to start our server with this.app.listen though, so instead of using the main DemoServer.ts configuration, let’s create a new server file just for testing. All it needs to do is activate one controller and return the Express instance. Oh and one more thing, we’ll still need to pass it whatever middleware we did in our main server file. Place this file in a controllers/shared/ folder and import the server class at the top of your test file.

```javascript
import * as bodyParser from 'body-parser';
import { Application } from 'express';
import { Server } from '@overnightjs/core';


class TestServer extends Server {

    constructor() {
        super();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    public setController(ctlr: object): void {
        super.addControllers(ctlr);
    }

    public getExpressInstance(): Application {
        return this.app;
    }
}

export default TestServer;
```

This is another thing that makes OvernightJS so great. It’s trivial to spin up new Express apps for testing purposes.

## Your first Unit-Test

In your test file, configure Supertest in the beforeall() method and setup one unit-test for each controller route. Make sure to add an assertion for every possible pathway the user can trigger in each unit-test.

```javascript
import * as supertest from 'supertest';

import {} from 'jasmine';
import { SuperTest, Test } from 'supertest';
import { cerr } from 'simple-color-print';

import TestServer from '../shared/TestServer.test';
import DemoController from './DemoController';


describe('DemoController', () => {

    const demoController = new DemoController();
    let agent: SuperTest<Test>;


    beforeAll(done => {

        // Activate the routes
        const server = new TestServer();
        server.setController(demoController);

        // Start supertest
        agent = supertest.agent(server.getExpressInstance());
        done();
    });


    describe('API: "/api/say-hello/:name"', () => {

        const { SUC_MSG, ERR_MSG } = demoController;

        it(`should return a JSON object with the message "${SUC_MSG}" and a status code of 250
            if message was successful`, done => {

            agent.get('/api/say-hello/seanmaxwell')
                .end((err, res) => {

                    if (err) { cerr(err); }

                    expect(res.status).toBe(250);
                    expect(res.body.response).toBe(SUC_MSG);
                    done();
                });
        });

        it(`should return a JSON object with the message "${ERR_MSG}" and a status code of 400
            if message was unsuccessful`, done => {

            agent.get('/api/say-hello/makeitfail')
                .end((err, res) => {

                    if (err) { cerr(err); }

                    expect(res.status).toBe(400);
                    expect(res.body.response).toBe(ERR_MSG);
                    done();
                });
        });
    });
});
```

## Configure Jasmine

We could run Jasmine directly from the command line using jasmine, but if we wanted to debug our test files just like any other node script, we would need to run Jasmine from a .js file. To do, so let’s add a configuration for Jasmine in start.ts.

Configure Jasmine to load the test files from the src/ directory (lines 17–24), if we run start.ts with the test argument. When writing tests, you might not want to run all at once; you might just want to run a single test file. That’s why we check for a 2nd argument (which will be the path for a test file), and pass it to Jasmine’s execute method if it exists.

```javascript
import { cinfo, cerr } from 'simple-color-print';
import DemoServer from './DemoServer';



// Start the server or run tests
if (process.argv[2] !== 'test') {

    let server = new DemoServer();
    server.start();

} else {

    const Jasmine = require('jasmine');
    const jasmine = new Jasmine();

    jasmine.loadConfig({
        "spec_dir": "src",
        "spec_files": [
            "./controllers/**/*.test.ts"
        ],
        "stopSpecOnExpectationFailure": false,
        "random": true
    });

    jasmine.onComplete((passed: boolean) => {

        if (passed) {
            cinfo('All tests have passed :)');
        } else {
            cerr('At least one test has failed :(');
        }
    });

    let testPath = process.argv[3];

    if (testPath) {
        testPath = `./src/${testPath}.test.ts`;
        jasmine.execute([testPath]);
    } else {
        jasmine.execute();
    }
}
```

Give the following property to package.json “scripts” so we can run our unit-tests with npm run test.

```“test”: "ts-node ./src/start.ts test"```
If you want pass in a unit-test, all you need to run is:

```npm test -- "path to the unit-test file" (i.e. controllers/DemoController)```

## Building for Production

After you’re done developing and testing your code, you’ll want to build it. ts-node should only be used during development, so we’ll need generate .js files for production.

### Automate the build process

To build both the back-end and the front-end for production, we don’t want to have to manually transpile our TypeScript, build our code, navigate to the front-end directory, build that code, then move the bundled React app to our top level build folder every time we’re ready for production. So let’s create a script that can do all of that for us and then configure that app to be run with a single command.

Configure this script to transpile our back-end code (skipping the test files), navigate to the React app, build that, give the output folder the same name as the React app’s folder (remember to be keep consistency), then move that to where the back-end code was built to. The source maps are only needed for development, so use the sourceMap false option on line 9 below so we don’t generate a bunch of .js.map files.I develop in Linux, so I use Bash; however, if you’re on Windows, you’ll have to look up the equivalent Batch or PowerShell commands.

```shell
#!/usr/bin/env bash



### Build BackEnd ###

# Remove existing production folder
rm -rf ./build/

# Transpile .ts to .js
tsc --sourceMap false



### Bundle FrontEnd ###

# Create the directory for React
mkdir -p ./build/public/react/

# Navigate to the react directory
cd ./src/public/react/demo-react

# Build React code
npm run build

# Rename the folder
mv build demo-react

# Move the contains to the build/ dir
mv demo-react ../../../../build/public/react/
view raw
```

## Modify the server file to serve the front-end for production

In development mode, Express just sends a single line to the browser which tells us which port Express is running on. But in production, Express needs to serve React from the same port that it’s running on. Since our entire front-end right now is contained in a single React app, we can point our static and views directory both there.

Add another method to the server file and append the if statement in the constructor which sets the views/ and static/ directories for Express when in production mode.

```javascript
// Point to front-end code
        if (process.env.NODE_ENV !== 'production') {
            this._serveFrontEndDev();
        } else {
            this._serveFrontEndProd();
        }
    }
    
    private _serveFrontEndProd(): void {

        cinfo('Starting server in production mode');

        this._port = 3002;

        const dir = path.join(__dirname, 'public/react/demo-react/');

        // Set the static and views directory
        this.app.set('views',  dir);
        this.app.use(express.static(dir));

        // Serve front-end content
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', {root: dir});
        });
    }
```

To activate our build script and make it easy to start our entire app in production mode, let’s modify the package.json files one last time to run our build script and start the code for production by running the built start script with the environment set to production.

Notice lines 7 and 11 in the snippet below. We can build for production with npm run build and start in production mode with npm start.

```javascript
{
  "name": "typescriptfullstackshell",
  "version": "1.0.0",
  "description": "demonstrate how to do full-stack TypeScript development",
  "main": "build/demo.bundle.js",
  "scripts": {
    "start": "npm install --only=prod && NODE_ENV=production node ./build/start.js",
    "start:express": "nodemon --config \"./util/nodemon.json\"",
    "test": "ts-node src/start.ts test",
    "build": "sh ./util/buildForProd.sh"
```

Now when you start the Express server in production mode and navigate to the same route you started it under in the browser, you should see the React app displayed.

Please star the repo and OvernightJS repo on GitHub if you found this article helpful. Happy web-deving :)

