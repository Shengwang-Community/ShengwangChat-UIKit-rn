[Return to Parent Document](./index.en.md)

- [Question List](#question-list)
  - [FAQs](#faqs)
      - [Lack Dynamic Updates of Code Modifications](#lack-dynamic-updates-of-code-modifications)
      - [Compilation Error When Using xcode 15.3](#compilation-error-when-using-xcode-153)
      - [xcode 15 Compilation Error](#xcode-15-compilation-error)
      - [React-Native Occupies a Significant Amount of Space](#react-native-occupies-a-significant-amount-of-space)
      - [Not Support for Remote references from GitHub](#not-support-for-remote-references-from-github)
  - [Specialized Issues](#specialized-issues)
      - [MIUI 12 Strings Fail to Be Displayed Fully](#miui-12-strings-fail-to-be-displayed-fully)
  - [Issues with Third-Party Libraries](#issues-with-third-party-libraries)
      - [@react-native-clipboard/clipboard Dependency Issue](#react-native-clipboardclipboard-dependency-issue)
      - [react-native-gesture-handler Dependency Issue](#react-native-gesture-handler-dependency-issue)
      - [react-native-safe-area-context Dependency Issue](#react-native-safe-area-context-dependency-issue)
      - [Issues with `expo-updates`](#issues-with-expo-updates)
      - [Create expo project and integrate uikit problem](#create-expo-project-and-integrate-uikit-problem)
      - [flipper compile question](#flipper-compile-question)
      - [ScrollView from react-native-gesture-handler](#scrollview-from-react-native-gesture-handler)
      - [yarn vs npm in react-native ?](#yarn-vs-npm-in-react-native-)

# Question List

## FAQs

#### Lack Dynamic Updates of Code Modifications

Reference 1: Maybe there is no `watchman` tool.

#### Compilation Error When Using xcode 15.3

Detailed description: Build Error on Xcode 15.3: "Called object type 'facebook::flipper::SocketCertificateProvider' is not a function or function pointer"
Reference 1: https://stackoverflow.com/questions/78121217/build-error-on-xcode-15-3-called-object-type-facebookflippersocketcertifi
Reference 2: https://github.com/facebook/react-native/issues/43335

#### xcode 15 Compilation Error

Detailed description:
Showing Recent Errors Only
ios/Pods/boost/boost/container_hash/hash.hpp:131:33: No template named 'unary_function' in namespace 'std'; did you mean '\_\_unary_function'?
Reference 1: https://github.com/facebook/react-native/issues/37748
Reference 2: https://developer.apple.com/documentation/xcode-release-notes/xcode-15-release-notes

#### React-Native Occupies a Significant Amount of Space

This is a current objective issue with React Native. It is advisable to use a mainstream version whenever possible, for example, 0.71.11, as installing multiple versions will exponentially increase disk space usage.

#### Not Support for Remote references from GitHub

Due to the repository's multi-package management and the dynamic generation of certain files, Git address references is impossible. However, local packaging services are currently available. The standalone `npm` packages that you generate by running `npm pack` in the specified directory (`packages/react-native-shengwang-chat-uikit`) can be used locally.

## Specialized Issues

#### MIUI 12 Strings Fail to Be Displayed Fully

Message Description: The string that displays properly on other Android devices and iOS devices is not properly rendered on MIUI 12.

Reference 1: https://github.com/facebook/react-native/issues/29259

## Issues with Third-Party Libraries

#### @react-native-clipboard/clipboard Dependency Issue

Message Description: In a react-native@0.73.2 application, using pod 1.12.1 may cause errors.

```sh
[!] Invalid `RNCClipboard.podspec` file: undefined method `visionos' for #<Pod::Specification name="RNCClipboard">.
```

Reference：1. Visit the official website of the third-party library and refer to the solution provided in issue #241.
Reference：2. Upgrade pod to v1.14.2.

#### react-native-gesture-handler Dependency Issue

Message description: kotlin syntax issue.

After modification

```kotlin
decorateRuntime(jsContext!!.get())
```

#### react-native-safe-area-context Dependency Issue

Message description: kotlin syntax issue.

```kotlin
  public override fun getTypedExportedConstants(): MutableMap<String, Any>? {
    return getInitialWindowMetrics()?.let { MapBuilder.of<String, Any>("initialWindowMetrics", it) }
  }
```

#### Issues with `expo-updates`

In release mode, using `expo-updates` may result in images not being found.

Reference: 1. https://github.com/expo/expo/issues/22656  
Main solutions include:

1. Remove the `expo-updates` dependency from the `package.json` configuration file.
2. Disable `expo-updates` by modifying the `EXUpdatesEnabled` property in the `Expo.plist` file.
3. Use the command `eas build` to build the project.

#### Create expo project and integrate uikit problem

The react-native project created with expo cannot compile and run `uikit` normally.

Reference: The `expo` project created by default does not have `native` configuration. You need to use `npx expo prebuild` to create `ios` and `android` folders and configurations. In this way, `uikit` can be compiled and run normally.

#### flipper compile question

Flipper Compilation Issue
In macOS 14.6.1 with Xcode 15.4, compiling react-native 0.71.11 with flipper 0.182.0 may result in the following issue:

The simplest solution is to add the header file #include <functional> in FlipperTransportTypes.h.

Reference: Debugging React Native apps with Flipper is deprecated in React Native 0.73. We will eventually remove out-of-the box support for JS debugging via Flipper.

#### ScrollView from react-native-gesture-handler

ERROR Error: NativeViewGestureHandler must be used as a descendant of GestureHandlerRootView. Otherwise the gestures will not be recognized. See https://docs.swmansion.com/react-native-gesture-handler/docs/installation for more details.

#### yarn vs npm in react-native ?

For `react-native` developers, `yarn` tool is usually used for management. The main basis is as follows:

1. Use the command recommended by the official website to create an application project. The project management configuration uses `yarn` by default. You can verify it by creating a project `npx @react-native-community/cli init xxx-app`
2. Check the help document of the cli recommended by the official website to create an application `npx @react-native-community/cli init --help `
3. Use the official recommended command to create a library project. The project management configuration uses `yarn` by default. You can verify it by creating a project `npx create-react-native-library@0.34.3 --react-native-version 0.72.17 react-native-xxx-lib`
4. After creating a project, some scripts are completed through `yarn`, which may automatically execute actions or behaviors, while `npm` cannot trigger automatic execution.
