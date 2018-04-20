# reality-capture-mobile-app
Forge Reality Capture + React Native

In this repository, we will walk through 'building a basic **React Native** app' that can handle Forge login so you can process image files on your smartphone through the **Forge Reality Capture API** and open the resulting viewable in the Forge Viewer.  With the mobile version of Forge Viewer, you can view the resulting Reality Capture OBJ file - think of it as a 3D mesh model of a photoscene that you have captured through pictures taken from your smartphone.

- [x] - Part 1 of this three part demo app series, covers "getting started", "building a mobile UI", and "connecting to Forge Login"

- [x] - Part 2 will focus on creating a Reality Capture backend app running from an AWS lambda function that creates a photoscene, upload images to it and process the photoscene. The GitHub repository can be accessed [here](https://github.com/mazerab/reality-capture-backend-app).

- [x] - Part 3 will focus on creating another AWS lambda function that will be responsible for translating the OBJ output file to SVF format that the Forge Viewer can open. The GitHub repository can be accessed [here](https://github.com/mazerab/obj-upload-translate-app).

## Introduction

I’ve been interested in **React Native** for a while, and have been wanting to use it to build a mobile app that uses the Forge Reality Capture API. To help building a mobile app that will work in both Android and iOS environments, I chose to use the **Expo XDE** client. Expo is a set of tools, libraries and services which let you quickly build native iOS and Android apps by writing JavaScript. The current Expo documentation can be accessed [here](https://docs.expo.io/versions/v26.0.0/). 

To interface with the camera roll of the smart phone, I reused code from [this](https://github.com/expo/image-upload-example) repository. 

The biggest challenge here, is 'Authentication on mobile'. We want our phone to remember our login info, and not bother us again (until we uninstall or sign-out). A second challenge was how to port all the network related activities off the mobile app to a backend server app. Mobile phones can lose connectivity to the internet quite easily, it is therefore of interest to move all the network related tasks to a server infrastructure where we know the network will be reliable. For that task, I chose **Amazon AWS Lambda Functions**. AWS Lambda lets you run code without provisioning or managing servers, making it the perfect infrastructure to run the backend server app. Because AWS lambda functions have a 30 seconds timeout due to the API Gateway they rely on, I decided to break down the server app into two separate server apps (in other words two separate AWS lambda functions). 


### Pre-requisites

1. You must have a valid AWS account
1. Deploy new AWS lambda function to run [reality-capture-backend-app](https://github.com/mazerab/reality-capture-backend-app). 
1. Deploy new AWS lambda function to run [obj-upload-translate-app](https://github.com/mazerab/obj-upload-translate-app).
1. Follow the READMEs found in these two repositories to learn how to setup and deploy the AWS lambda functions.

*On your local development machine*

1. Install the Expo local development tool XDE by navigating to this [link](https://docs.expo.io/versions/latest/introduction/installation.html).
1. Download the client app source code from this [url](https://github.com/mazerab/reality-capture-mobile-app/archive/master.zip)
1. Extract the client app source code to a new directory on your development machine
1. Open a terminal and navigate to the new directory
1. Run the command **npm install** to install the dependencies. If successful, you will notice a new sub-directory called node_modules in the root of your app directory.
1. Launch the Expo XDE Client to open project and browse to your app root directory
  ![Open Expo Project](/assets/images/expo-open-project.png)
1. Using your favorite text editor, open the file ./constants/Config.js
1. Edit the variables FORGE_APP_ID, AWS_RECAP_LAMBDA_BASE_ENDPOINT, AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT and AWS_S3_BUCKET to reflect your environment
1. Save the changes




