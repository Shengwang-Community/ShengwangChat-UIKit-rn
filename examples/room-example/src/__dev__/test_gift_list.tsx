// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetGift,
  BottomSheetGift2,
  BottomSheetGiftSimuRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  GiftList,
  GiftListModel,
  useCompare,
  useDarkTheme,
  useLightTheme,
  usePresetPalette,
} from '../rename.room';

export function TestGiftList() {
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          paddingTop: 100,
        }}
      >
        <TouchableOpacity
          style={{ width: 200, height: 40, backgroundColor: 'red' }}
          onPress={() => {}}
        >
          <Text>{'Start painting presents'}</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
        <GiftList gifts={gifts} />
      </View>
    </Container>
  );
}

export function TestGiftList2() {
  // const pal = createPresetPalette();
  // const dark = createDarkTheme(pal);
  // const light = createLightTheme(pal);
  const pal = usePresetPalette();
  const dark = useDarkTheme(pal);
  const light = useLightTheme(pal);
  useCompare(pal, { enabled: true });
  useCompare(dark, { enabled: true });
  useCompare(light, { enabled: true });

  const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
  const count = React.useRef(0);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          paddingTop: 100,
        }}
      >
        <TouchableOpacity
          style={{ width: 200, height: 40, backgroundColor: 'red' }}
          onPress={() => {
            ref.current?.startShow();
            // ref.current?.startShowWithInit(
            //   count.current % 2 === 0
            //     ? [{ title: 'gift1', gifts }]
            //     : [
            //         { title: 'gift1', gifts },
            //         { title: 'gift2', gifts: gifts2 },
            //       ]
            // );
            ++count.current;
          }}
        >
          <Text>{'Start painting presents'}</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
        <BottomSheetGift2
          ref={ref}
          gifts={[
            { title: 'gift1', gifts },
            { title: 'gift2', gifts },
          ]}
        />
      </View>
    </Container>
  );
}

export function TestGiftList3() {
  // const pal = createPresetPalette();
  // const dark = createDarkTheme(pal);
  // const light = createLightTheme(pal);
  const pal = usePresetPalette();
  const dark = useDarkTheme(pal);
  const light = useLightTheme(pal);
  useCompare(pal, { enabled: true });
  useCompare(dark, { enabled: true });
  useCompare(light, { enabled: true });

  const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
  const count = React.useRef(0);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          paddingTop: 100,
        }}
      >
        <TouchableOpacity
          style={{ width: 200, height: 40, backgroundColor: 'red' }}
          onPress={() => {
            ref.current?.startShow();
            // ref.current?.startShowWithInit(
            //   count.current % 2 === 0
            //     ? [{ title: 'gift1', gifts }]
            //     : [
            //         { title: 'gift1', gifts },
            //         { title: 'gift2', gifts: gifts2 },
            //       ]
            // );
            ++count.current;
          }}
        >
          <Text>{'Start painting presents'}</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
        <BottomSheetGift
          ref={ref}
          gifts={[
            { title: 'gift1', gifts },
            { title: 'gift2', gifts },
          ]}
        />
      </View>
    </Container>
  );
}

export default function test_gift_list() {
  return <TestGiftList3 />;
}

export const gifts: GiftListModel[] = [
  {
    giftId: '2665752a-e273-427c-ac5a-4b2a9c82b255',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png',
    giftName: 'Sweet Heart',
    giftPrice: 1,
  },
  {
    giftId: 'ff3bbb9e-ef18-430f-aa61-5bddf75eb722',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift2.png',
    giftName: 'Flower',
    giftPrice: 2,
  },
  {
    giftId: '94f296fa-86d9-4552-84db-025b05ed9f8d',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift3.png',
    giftName: 'Sweet Heart',
    giftPrice: 5,
  },
  {
    giftId: 'd4cd0526-d8db-4e00-8fc0-d5228907a517',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift4.png',
    giftName: 'Super Agora',
    giftPrice: 10,
  },
  {
    giftId: 'c1997f02-d927-46f5-adda-e6af6714bd75',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift5.png',
    giftName: 'Star',
    giftPrice: 20,
  },
  {
    giftId: '0c62b402-376f-4fbb-b584-769a8249189e',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift6.png',
    giftName: 'Lollipop',
    giftPrice: 30,
  },
  {
    giftId: 'ce3f8bc3-74d7-43be-a040-c397d5c49f6d',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift7.png',
    giftName: 'Diamond',
    giftPrice: 50,
  },
  {
    giftId: '948b1a3b-b2c6-41fc-99b7-a5b9457cd159',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift8.png',
    giftName: 'Crown',
    giftPrice: 100,
  },
  {
    giftId: 'f1e12397-feb7-4c01-b834-f11faf321dbf',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift9.png',
    giftName: 'Mic',
    giftPrice: 500,
  },
  {
    giftId: 'e915438c-7fbd-4e03-840f-0036ec97c824',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift10.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/ballon.pag',
    giftName: 'Balloon',
    giftPrice: 666,
    effectMD5: '141761700268c0290852af8f6a501c10',
  },
  {
    giftId: '0c832b52-8f2e-4202-958b-9410db2d9438',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift11.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/planet.pag',
    giftName: 'Plant',
    giftPrice: 888,
    effectMD5: '41f3eeff249be268004d82a1d1eaf481',
  },
  {
    giftId: 'beada6a3-eae6-450e-869c-743d02fa95e7',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift12.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/rocket.pag',
    giftName: 'Rocket',
    giftPrice: 1000,
    effectMD5: 'de5094b30eebeadf8b8f5d8357a19578',
  },
];

export const gifts2 = gifts.slice(0, gifts.length - 1);
