import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Container, useDispatchContext, useLifecycle } from '../rename.uikit';

export function CL() {
  const [is, setIs] = React.useState(false);
  const test = () => {};
  useLifecycle(
    React.useCallback((state: any) => {
      if (state === 'load') {
        console.log('test:zuoyu:load');
        test();
      } else if (state === 'unload') {
        console.log('test:zuoyu:unload');
      }
    }, [])
  );
  return (
    <SafeAreaView>
      <View
        style={{ width: 100, height: 100, backgroundColor: 'red' }}
        onTouchEnd={() => {
          setIs(!is);
        }}
      >
        <Text>{'Hello'}</Text>
      </View>
    </SafeAreaView>
  );
}

export function CL2() {
  const [is, setIs] = React.useState(false);
  const init = () => {};
  const unInit = () => {};
  const { addListener, removeListener, emit } = useDispatchContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        const listener = (data: any) => {
          if (data === 'load') {
            init();
          } else if (data === 'unload') {
            unInit();
          }
        };
        if (state === 'load') {
          console.log('test:zuoyu:load');
          addListener('test', listener);
        } else if (state === 'unload') {
          console.log('test:zuoyu:unload');
          removeListener('test', listener);
        }
      },
      [addListener, removeListener]
    )
  );
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          console.log('test:zuoyu:load');
          emit('test', 'load');
        } else if (state === 'unload') {
          console.log('test:zuoyu:unload');
          emit('test', 'unload');
        }
      },
      [emit]
    )
  );
  return (
    <SafeAreaView>
      <View
        style={{ width: 100, height: 100, backgroundColor: 'red' }}
        onTouchEnd={() => {
          setIs(!is);
        }}
      >
        <Text>{'Hello'}</Text>
      </View>
    </SafeAreaView>
  );
}

export class CL3 extends React.PureComponent<{ id: string }> {
  constructor(props: { id: string }) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
          <Text>{'test'}</Text>
        </View>
      </View>
    );
  }
}

export default function TestLifeCycle() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <CL />
    </Container>
  );
}
