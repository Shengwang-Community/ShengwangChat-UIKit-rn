import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Container, useLightTheme, usePresetPalette } from '../rename.uikit';

export function MyTriangle() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: 100,
          width: 100,
          backgroundColor: 'green',
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 50,
            borderRightWidth: 50,
            borderBottomWidth: 100,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'red',
          }}
        />
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'blue',
            borderBottomColor: 'yellow',
            borderLeftWidth: 75,
            borderRightWidth: 75,
            borderBottomWidth: 100,
            borderTopWidth: 0,
            borderRadius: 10,
            transform: [
              { rotate: '-90deg' },
              {
                translateY: 100,
              },
            ],
          }}
        />
        <View
          style={{
            backgroundColor: 'orange',
            width: 200,
            height: 200,
          }}
        >
          <View
            style={{
              backgroundColor: 'green',
              width: 100,
              height: 100,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [
                { rotate: '0deg' },
                // { translateX: -20 },
                // { translateY: 50 },
              ],
            }}
          />
          <View
            style={{
              position: 'absolute',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              backgroundColor: 'transparent',
              borderBottomColor: 'yellow',
              borderLeftWidth: 75,
              borderRightWidth: 75,
              borderBottomWidth: 100,
              borderTopWidth: 0,
              borderRadius: 10,
              transform: [{ rotate: '-0deg' }],
            }}
          />
        </View>

        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'blue',
            transform: [{ rotate: '45deg' }],
            borderRadius: 10,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export function MyTriangle2() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: 10,
          width: 10,
          alignItems: 'flex-start',
          backgroundColor: 'orange',
          // marginRight: 100,
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'transparent',
            borderBottomColor: 'blue',
            borderLeftWidth: 6.4,
            borderRightWidth: 6.4,
            borderBottomWidth: 8,
            borderTopWidth: 0,
            transform: [{ rotate: '-90deg' }],
          }}
        />
      </View>
      <View
        style={{
          height: 10,
          width: 10,
          alignItems: 'flex-end',
          backgroundColor: 'orange',
          // marginRight: 100,
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'transparent',
            borderBottomColor: 'blue',
            borderLeftWidth: 6.4,
            borderRightWidth: 6.4,
            borderBottomWidth: 8,
            borderTopWidth: 0,
            transform: [{ rotate: '90deg' }],
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export function MyTriangle3() {
  return (
    <SafeAreaView style={styles.test}>
      <View style={styles.container}>
        <View style={styles.triangle} />
        <View style={{ height: 100 }} />
        <View style={[styles.triangle, styles.triangle2]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  test: {
    top: 100,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'blue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
  triangle2: {
    transform: [{ rotate: '180deg' }],
  },
});

export const ChatBubble = ({ text }) => {
  return (
    <View style={styles2.container}>
      <View style={styles2.bubbleWrapper}>
        <View style={styles2.triangle} />
        <View style={styles2.bubble}>
          <Text style={styles2.text}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  bubbleWrapper: {
    // flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
    backgroundColor: 'transparent', // 确保阴影效果应用在整个包裹视图上
    padding: 5, // 添加一些内边距以确保阴影效果更明显
    borderRadius: 10, // 确保阴影效果的圆角
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  bubble: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  text: {
    fontSize: 16,
  },
});

export default function TestTriangle() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <ChatBubble text={'hello, world~'} />
    </Container>
  );
}
