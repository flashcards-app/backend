# Getting Started

## Clone and install

run the following commands in your CLI:

```shell
git clone git@github.com:flashcards-app/backend.git flashcards-backend
cd flashcards-backend
npm install
npm i -g @babel/node@7.13.13  @babel/cli@7.13.14
```

## docker

### download and install docker

Follow the instructions in the docker website documentation:
[https://docs.docker.com/desktop/windows/install/](https://docs.docker.com/desktop/windows/install/)

After you have installed docker, you must have a green line at the bottom of the side panel - see image reference
bellow: <br/>
<img src="..\assets\dockerSidePanel.png" alt="story-example"/>

If you don't have a green line, you can try to restart the docker or otherwise restart your computer

> Note: If you don't have a green line the following steps won't work!

### Building a docker image

After you have finished the steps above, you can now build a docker image.

Run this in the CLI:

```shell
npm run docker:dev
```

It should build a docker image for you, **this can take some time!**

After the image is built, this should be the result in the docker desktop app:

<img src="..\assets\dockerAfterBuild.png" alt="story-example"/>

We don't want to run our api through the docker container - so we'll stop the relevent container:

<img src="..\assets\dockerStopApiContainer.png">

> The api container might stop itself, it's fine as well.

This should be our result:

<img src="..\assets\dockerStopApiContainerResult.png">

## Start the node server

Run the following in the terminal to create a .env file with the relevant environment variables(you can alternatively
copy .env.example to .env):

```shell
cp .env.example .env
```

Run this to start the server:

```shell
npm run dev
```

Congrats! You have now successfully started the dev server with a MongoDB instance connected to it!

> If you are following the [# Read before you start coding](../../README.md#read-before-you-start-coding) - guide, you should go to [Our Workflow](./workflow.md) next.
