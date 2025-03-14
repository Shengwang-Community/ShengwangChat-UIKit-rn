import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Container,
  GroupParticipantList,
  SearchGroupParticipant,
  TabPage,
  TabPageTabBarHeader,
} from '../rename.uikit';

export function CL() {
  return (
    <SafeAreaView>
      <GroupParticipantList
        groupId="sdf"
        containerStyle={{
          height: '100%',
          backgroundColor: 'red',
        }}
        // onRequestData={(params: {
        //   ids: string[];
        //   result: (data?: DataModel[], error?: UIKitError) => void;
        // }) => {
        //   params?.result(
        //     params.ids.map((v) => {
        //       return {
        //         id: v,
        //         name: v + 'name',
        //         avatar:
        //           'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //         type: 'user' as DataModelType,
        //       };
        //     })
        //   );
        // }}
      />
    </SafeAreaView>
  );
}

export function CL3() {
  return (
    <SafeAreaView>
      <SearchGroupParticipant
        groupId="sdf"
        onCancel={() => {
          console.log('test:zuoyu:cancel');
        }}
        containerStyle={{
          height: '100%',
          backgroundColor: 'red',
        }}
      />
    </SafeAreaView>
  );
}

export function BodyPagesT({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('test:BodyPagesT:', index, currentIndex);
  // const color = (i: number) => {
  //   if (i === 0) {
  //     return ['blue', 'red'];
  //   } else if (i === 1) {
  //     return ['orange', 'yellow'];
  //   } else if (i === 2) {
  //     return ['yellow', 'gray'];
  //   } else if (i === 3) {
  //     return ['red', 'yellow'];
  //   }
  //   return [];
  // };
  return (
    <GroupParticipantList
      groupId="sdf"
      containerStyle={{
        // height: '100%',
        backgroundColor: 'green',
      }}
    />
  );
}

export function CL2() {
  return (
    <SafeAreaView>
      <TabPage
        // header={{
        //   // Header: TabPage.DefaultHeader,
        //   HeaderProps: {
        //     titles: ['1', '2', '3', '4'],
        //   },
        // }}
        header={{
          Header: TabPageTabBarHeader as any,
          HeaderProps: {
            titles: ['1', '2', '3'],
            items: [
              {
                title: '会话',
                icon: 'bubble_fill',
              },
              {
                title: '联系人',
                icon: 'person_double_fill',
              },
              {
                title: '我',
                icon: 'person_single_fill',
              },
            ],
          } as any,
        }}
        // body={{
        //   type: 'TabPageBody',
        //   // Body: TabPage.DefaultBody,
        //   BodyProps: {
        //     children: BodyPages(),
        //   },
        // }}
        body={{
          type: 'TabPageBodyT',
          BodyProps: {
            RenderChildren: BodyPagesT,
            RenderChildrenProps: {
              index: 0,
              currentIndex: 0,
            },
          },
        }}
        // height={300}
        // height={undefined}
        // width={300}
        headerPosition="down"
        initIndex={2}
        onCurrentIndex={(index) => {
          console.log('test:zuoyu:index', index);
        }}
      />
    </SafeAreaView>
  );
}

export default function TestGroupParticipantList() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <CL2 />
    </Container>
  );
}
