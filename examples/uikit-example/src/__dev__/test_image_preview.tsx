import * as React from 'react';
import {
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Container,
  ImagePreview,
  ImagePreview2,
  useLightTheme,
  usePresetPalette,
} from '../rename.uikit';

export function TestMyImagePreview() {
  // const url =
  //   'https://cdn4.iconfinder.com/data/icons/aiga-symbol-signs/589/aiga_toiletsq_women_inv-1024.png';
  const url2 = 'https://picsum.photos/200/300';
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImagePreview
            source={{ uri: url2, width: 300, height: 300 }}
            onClicked={() => {
              console.log('onClicked');
            }}
            onLongPress={() => {
              console.log('onLongPress');
            }}
            onDupClicked={() => {
              console.log('onDupClicked');
            }}
          />
          <ImagePreview2
            source={{ uri: url2, width: 300, height: 300 }}
            containerStyle={{ width: 300, height: 300 }}
            onClicked={() => {
              console.log('onClicked');
            }}
            onLongPress={() => {
              console.log('onLongPress');
            }}
            onDupClicked={() => {
              console.log('onDupClicked');
            }}
          />
          {/* <Draggable2>
            <View
              style={{
                height: 100,
                width: 100,
                backgroundColor: 'blue',
              }}
            />
          </Draggable2> */}
          {/* <Scalable>
            <View
              style={{
                height: 100,
                width: 100,
                backgroundColor: 'blue',
              }}
            />
          </Scalable> */}
          {/* <Draggable2>
            <Scalable>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'blue',
                }}
                source={{
                  uri: url,
                }}
              />
            </Scalable>
          </Draggable2> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function TestImagePreview() {
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
      <TestMyImagePreview />
    </Container>
  );
}
