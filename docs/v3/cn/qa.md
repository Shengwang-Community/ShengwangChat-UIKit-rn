[返回父文档](./index.md)

- [问题列表](#问题列表)
  - [常见问题](#常见问题)
      - [修改代码，没有动态更新](#修改代码没有动态更新)
      - [使用 xcode 15.3，编译报错](#使用-xcode-153编译报错)
      - [xcode 15 编译报错](#xcode-15-编译报错)
      - [React-Native 占用空间非常大](#react-native-占用空间非常大)
      - [不支持 github 远程引用](#不支持-github-远程引用)
  - [专业问题](#专业问题)
      - [MIUI 12 字符串显示不全问题。](#miui-12-字符串显示不全问题)
  - [三方库问题](#三方库问题)
      - [@react-native-clipboard/clipboard 依赖问题](#react-native-clipboardclipboard-依赖问题)
      - [react-native-gesture-handler 依赖问题](#react-native-gesture-handler-依赖问题)
      - [react-native-safe-area-context 依赖问题](#react-native-safe-area-context-依赖问题)
      - [node 版本问题](#node-版本问题)
      - [expo-updates 的问题](#expo-updates-的问题)
      - [创建 expo 项目 集成 uikit 问题](#创建-expo-项目-集成-uikit-问题)
      - [flipper compilation problem](#flipper-compilation-problem)
      - [ScrollView from react-native-gesture-handler](#scrollview-from-react-native-gesture-handler)
      - [在 react-native 中 `yarn` 和 `npm` 的选择](#在-react-native-中-yarn-和-npm-的选择)

# 问题列表

## 常见问题

#### 修改代码，没有动态更新

参考 1: 可能没有 `watchman` 工具。

#### 使用 xcode 15.3，编译报错

详细描述: Build Error on Xcode 15.3: "Called object type 'facebook::flipper::SocketCertificateProvider' is not a function or function pointer"
参考 1: https://stackoverflow.com/questions/78121217/build-error-on-xcode-15-3-called-object-type-facebookflippersocketcertifi
参考 2: https://github.com/facebook/react-native/issues/43335

#### xcode 15 编译报错

详细描述:
Showing Recent Errors Only
ios/Pods/boost/boost/container_hash/hash.hpp:131:33: No template named 'unary_function' in namespace 'std'; did you mean '\_\_unary_function'?
参考 1: https://github.com/facebook/react-native/issues/37748
参考 2: https://developer.apple.com/documentation/xcode-release-notes/xcode-15-release-notes

#### React-Native 占用空间非常大

这个是 RN 当前客观存在的问题，建议，尽量使用一个主流版本。例如：0.71.11，因为越多版本占用磁盘空间就会成倍的增加。

#### 不支持 github 远程引用

由于仓库是多包管理，并且由于部分文件是动态生成的，所以无法支持 git 地址引用。但是，目前提供本地打包服务。通过在指定目录（`packages/react-native-shengwang-chat-uikit`），执行 `npm pack` 生成独立的 npm 包，可以放在本地使用。

## 专业问题

#### MIUI 12 字符串显示不全问题。

消息描述: 其它 android 设备没有问题，ios 设备都可以正常显示的字符串，MIUI 12 无法正常显示。
参考 1: https://github.com/facebook/react-native/issues/29259

## 三方库问题

#### @react-native-clipboard/clipboard 依赖问题

消息描述：在 react-native@0.73.2的应用，使用 pod 版本 1.12.1 版本可能遇到错误

```sh
[!] Invalid `RNCClipboard.podspec` file: undefined method `visionos' for #<Pod::Specification name="RNCClipboard">.
```

参考：1. 去该三方库官网，参考#241 的解决办法。
参考：2. 升级 pod 到 1.14.2 版本。

#### react-native-gesture-handler 依赖问题

消息描述：kotlin 的语法问题。
修改后：

```kotlin
decorateRuntime(jsContext!!.get())
```

#### react-native-safe-area-context 依赖问题

消息描述：kotlin 语法问题

```kotlin
  public override fun getTypedExportedConstants(): MutableMap<String, Any>? {
    return getInitialWindowMetrics()?.let { MapBuilder.of<String, Any>("initialWindowMetrics", it) }
  }
```

#### node 版本问题

创建 expo51 版本的应用项目，要求 node 的最低版本是 18.18.0，如果使用 yarn 工具，会有相应的提示信息。如果使用 npm 可能没有提示信息。

#### expo-updates 的问题

在 release 模式下，使用 `expo-updates` 可能导致图片无法被找到。

参考：1. https://github.com/expo/expo/issues/22656  
 解决方法主要以下几种： 1. 删除依赖项 `expo-updates`, 该依赖项在 `package.json` 配置文件中。 2. 禁用 `expo-updates`, 修改设置在 `Expo.plist` 文件中的属性 `EXUpdatesEnabled` 3. 使用命令 `eas build` 构建

#### 创建 expo 项目 集成 uikit 问题

使用 expo 创建的 react-native 项目，无法正常编译运行 `uikit`。

参考：默认创建的`expo`的项目没有`native`配置，需要使用 `npx expo prebuild` 创建 `ios` 和 `android` 的文件夹以及配置。这样 `uikit` 可以正常编译运行了。

#### flipper compilation problem

In `macos 14.6.1` version, using `xcode 15.4` version, compiling `react-native 0.71.11` version, `flipper 0.182.0` version may have the following problems:

```log
Showing Recent Errors Only
/Users/asterisk/Codes/rn/react-native-chat-library-2.0/examples/uikit-example/ios/Pods/Headers/Private/Flipper/FlipperTransportTypes.h:24:14: No template named 'function' in namespace 'std'
```

The easiest way is to add the header file `#include <functional>` in `FlipperTransportTypes.h`

Reference: [Debugging React Native apps with Flipper is deprecated in React Native 0.73. We will eventually remove out-of-the box support for JS debugging via Flipper.](https://reactnative.dev/docs/debugging)

#### ScrollView from react-native-gesture-handler

ERROR Error: NativeViewGestureHandler must be used as a descendant of GestureHandlerRootView. Otherwise the gestures will not be recognized. See https://docs.swmansion.com/react-native-gesture-handler/docs/installation for more details.

#### 在 react-native 中 `yarn` 和 `npm` 的选择

对于 `react-native` 开发者们，通常采用 `yarn` 工具进行管理。主要依据如下：

1. 使用官网推荐命令创建应用项目，项目管理配置默认使用 `yarn`。可以通过创建项目验证 `npx @react-native-community/cli init xxx-app`
2. 查看官网推荐的创建应用的 cli 的帮助文档 `npx @react-native-community/cli init --help `
3. 使用官方推荐命令创建库项目，项目管理配置默认使用 `yarn`。可以通过创建项目验证 `npx create-react-native-library@0.34.3 --react-native-version 0.72.17 react-native-xxx-lib`
4. 创建项目之后，某些脚本通过 `yarn` 来完成，可能自动执行动作或者行为，而 `npm` 无法触发自动执行。
