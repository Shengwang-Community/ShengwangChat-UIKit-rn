_English | [中文](./README.zh.md)_

# Introduction

ChatroomUIKit is designed to address most users' chat room requirements specific to pan-entertainment scenarios. It delivers good user experience in the use of APIs (for user-side developers) by streamlining the SDK integration, facilitating customization, and offering comprehensive documentation.

## Development environment requirements

- MacOS 12 or higher
- React-Native 0.66 or higher
- NodeJs 16.18 or higher

For iOS app:

- Xcode 13 or higher and its related dependency tool.

For the Android app:

- Android Studio 2021 or higher and its related dependency tool.

## Installation

```sh
npm install react-native-shengwang-chat-room
# or
yarn add react-native-shengwang-chat-room
```

## Dependencies

```sh
yarn add react-native-linear-gradient \
react-native-safe-area-context
```

## Quick Start

Initialization

```typescript
import { Container } from 'react-native-shengwang-chat-room';
export function App() {
  return (
    <Container opt={{ appId: '<your app ID>' }}>
      {/** sub component */}
    </Container>
  );
}
```

Join a room

```typescript
export function ChatroomScreen() {
  return (
    <Chatroom roomId={'<room ID>'} ownerId={'<room owner ID>'}>
      {/** sub component */}
    </Chatroom>
  );
}
```

## Contributing

See the [contributing guide](../../CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
