## Introduction

This is a React Native application developed using Expo. This guide will help you set up the project, run it on your local machine, and build the app for production.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm or yarn
- Expo CLI
- EAS CLI (Expo Application Services CLI)

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

Install the necessary dependencies using npm or yarn:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start the Development Server

Start the development server using Expo CLI:

```bash
npx expo start
```

## Building the App

### Using EAS (Expo Application Services)

#### 1. Install the latest EAS CLI

To install the EAS CLI, use the following commands:

```bash
# Using npm
npm install -g expo-cli
npm install -g eas-cli

# Using yarn (for macOS)
yarn global add eas-cli
```

#### 2. Log in to your Expo account

Log in to your Expo account with the following command:

```bash
eas login
```

You can verify your login status with:

```bash
eas whoami
```

#### 3. Configure the Project

Configure your project for building with EAS:

```bash
eas build:configure
```

#### 4. Create APK for Android

To build an APK for Android, use the following command:

```bash
eas build --platform android --profile preview
```

### Building Locally

If you want to build the app locally, follow these steps:

#### 1. Clean the Project Directory

Navigate to the `android` directory and clean the project:

```bash
cd android && ./gradlew clean
```

#### 2a. Create APK File

To create an Android App Bundle (APK) file, run the following command in the root directory of your project:

```bash
cd android && ./gradlew assembleRelease
```

If already in android folder
```bash
./gradlew assembleRelease
```

#### 2b. Create AAB File

To create an Android App Bundle (AAB) file, run the following command in the root directory of your project:

```bash
npx react-native build-android --mode=release
```

### 4. Additionals

#### To update Version Code use

```bash
eas build:version:set
```

#### For getting Android Folder

```bash
npx expo run:android
```

## Conclusion

You are now ready to develop and build your Expo React Native app. If you encounter any issues, please refer to the [Expo documentation](https://docs.expo.dev/) or open an issue on this repository.
