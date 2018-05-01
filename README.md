# reality-capture-mobile-app
Forge Reality Capture + React Native

In this repository, we will walk through 'building a basic **React Native** app' that can handle Forge login so you can process image files on your smartphone through the **Forge Reality Capture API** and open the resulting viewable in the Forge Viewer.  With the mobile version of Forge Viewer, you can view the resulting Reality Capture OBJ file - think of it as a 3D mesh model of a photoscene that you have captured through pictures taken from your smartphone.

- [x] - Part 1 of this three part demo app series, covers "getting started", "building a mobile UI", and "connecting to Forge Login"

- [x] - Part 2 will focus on creating a Reality Capture backend app running from an AWS lambda function that creates a photoscene, upload images to it and process the photoscene. The GitHub repository can be accessed [here](https://github.com/mazerab/reality-capture-backend-app).

- [x] - Part 3 will focus on creating another AWS lambda function that will be responsible for translating the OBJ output file to SVF format that the Forge Viewer can open. The GitHub repository can be accessed [here](https://github.com/mazerab/obj-upload-translate-app).

## Introduction

I’ve been interested in **React Native** for a while, and have been wanting to use it to build a mobile app that uses the Forge Reality Capture API. To help building a mobile app that will work in both Android and iOS environments, I chose to use the **Expo XDE** client. Expo is a set of tools, libraries and services which let you quickly build native iOS and Android apps by writing JavaScript. The current Expo documentation can be accessed [here](https://docs.expo.io/versions/v26.0.0/). 

To interface with the camera roll :camera: of the smart phone, I reused code from [this](https://github.com/expo/image-upload-example) repository. 

The biggest challenge here, is 'Authentication on mobile'. We want our phone to remember our login info, and not bother us again (until we uninstall or sign-out). A second challenge was how to port all the network related activities off the mobile app to a backend server app. Mobile phones can lose connectivity to the internet quite easily, it is therefore of interest to move all the network related tasks to a server infrastructure where we know the network will be reliable. For that task, I chose **Amazon AWS Lambda Functions**. AWS Lambda lets you run code without provisioning or managing servers, making it the perfect infrastructure to run the backend server app. Because AWS lambda functions have a 30 seconds timeout due to the API Gateway they rely on, I decided to break down the server app into two separate server apps (in other words two separate AWS lambda functions). 

### Trying it out!

You can pretest the mobile app by scanning the below QR code on your smartphone after installing Expo.

<img src="/assets/images/app-qr-code.png" width="200" height="250">

If you need sample images, please go to this [directory](/assets/sample).

### Pre-requisites

* You must have a valid AWS account
* You have to create a new public-read S3 bucket, and apply the policy found in this [JSON](https://github.com/mazerab/reality-capture-mobile-app/blob/master/s3-policy.json) file. Before you apply the policy, edit the JSON to specify your bucket name and save the change.
* You must have created a new Forge App. Step by step instructions found [here](https://developer.autodesk.com/en/docs/oauth/v2/tutorials/create-app/).
* Deploy new AWS lambda function to run [reality-capture-backend-app](https://github.com/mazerab/reality-capture-backend-app). 
* Deploy new AWS lambda function to run [obj-upload-translate-app](https://github.com/mazerab/obj-upload-translate-app).
* Follow the READMEs found in these two repositories to learn how to setup and deploy the AWS lambda functions.

### Setup 

*On your local development machine*

* Install the Expo local development tool XDE by navigating to this [link](https://docs.expo.io/versions/latest/introduction/installation.html).
* Download the client app source code from this [url](https://github.com/mazerab/reality-capture-mobile-app/archive/master.zip)
* Extract the client app source code to a new directory on your development machine
* Open a terminal and navigate to the new repository directory
* Run the command **npm install** to install the dependencies. If successful, you will notice a new sub-directory called node_modules in the root of your app directory.
* Using your favorite text editor, open the file **./constants/Config.js**
* Edit the variables **FORGE_APP_ID**, **AWS_RECAP_LAMBDA_BASE_ENDPOINT**, **AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT** and **AWS_S3_BUCKET** to reflect your environment
* Save the changes
* Launch the Expo XDE Client to open project and browse to your app root directory

  <img src="/assets/images/expo-open-project.png" width="450" height="300">
* Open the iOS Simulator to start the app

  <img src="/assets/images/open-ios-simulator.png" width="200" height="150">
* In the iOS Simulator, you will be prompted to use *"expo.io"* to Sign In, choose **Continue**
  ![Continue](/assets/images/expo-io-sign-in.png)
* Next prompt will ask you to sign into another service, choose **Yes**

  ![Continue](/assets/images/sign-in-to-another-service.png)
* You will then be redirected to the sign in page of Autodesk, you will get a 400 invalid redirect_uri error
  <img src="/assets/images/400-invalid-redirect-uri.png" width="250" height="250">
* Go back to the Expo XDE Client and look for a message stating *"Copy this redirect url to the Forge app callback ..."*
  <img src="/assets/images/redirect-url.png" width="600" height="100">
* Copy the URL
* Edit your Forge App and change the callback URL to the URL you just copied
  <img src="/assets/images/callback-url.png" width="350" height="250">
* Save the changes in your Forge app
* Restart the project in Expo and this time you will be redirected to the Autodesk Sign-In page
* Login with your Autodesk ID
  <img src="/assets/images/adsk-sign-in.png" width="250" height="250">
* You will see the main screen, select *"Pick an image from camera roll"* to select your first image
  ![Main Screen](/assets/images/main-app-screen.png)
* Repeat the process by adding three or more images (**Note**: the order in which you add the images does not matter)

  ![Pick Image](/assets/images/pick-an-image-from-camera-roll.png)
* When you have added enough images, select *"Process Photoscene"*
* When the photoscene is fully processed, the View File button becomes available
* Click on View File button to launch the Forge Viewer

  ![Forge Viewer](/assets/images/forge-viewer.png)

# What's next

One of the reasons for using Expo and XDE was its feature to **'Publish your app'**. This gives you a *very* convenient way to let others try out your new app on their own phone. It delays the decision to buy an Apple Developer Account, MacBook, install Xcode, build and deploy. Just share the QRCode, like the one I posted at the beginning of this README, and away you go!

And if you want to develop an app for the web, please make sure you read [The Hitchhiker's Guide to ... Reality Capture API](https://forge.autodesk.com/blog/hitchhikers-guide-reality-capture-api).





