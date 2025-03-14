import * as React from 'react';
import { View } from 'react-native';

import { Badges, Container } from '../rename.uikit';

export function TB() {
  return (
    <View style={{ paddingTop: 100, flexGrow: 1 }}>
      <View style={{ width: 200, height: 10, backgroundColor: 'red' }} />
      <Badges count={8} />
    </View>
  );
}

export default function TestBadge() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <TB />
    </Container>
  );
}
