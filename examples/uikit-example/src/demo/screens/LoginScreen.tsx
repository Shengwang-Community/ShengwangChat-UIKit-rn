import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TextInput, useChatContext, useChatListener } from '../../rename.uikit';
import { useLoginWithConfig } from '../hooks/useLoginWithConfig';
import type { RootScreenParamsList } from '../routes';

const account = require('../../env').account as {
  id: string;
  token: string;
}[];
let gId = account[0]?.id;
let gToken = account[0]?.token;
let gIsPass = false;

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginScreen(props: Props) {
  const { navigation } = props;

  const im = useChatContext();
  useChatListener(
    React.useMemo(() => {
      return {
        onConnected: () => {
          setS2('onConnected');
        },
        onDisconnected: (type) => {
          setS2(`onDisconnected: ${type}`);
        },
      };
    }, [])
  );

  const [s, setS] = React.useState<'' | 'success' | 'failed' | 'logouted'>('');
  const [s2, setS2] = React.useState<string>('');
  const [reason, setReason] = React.useState<string>('');
  const [id, setId] = React.useState(gId);
  const [isPass, setIsPass] = React.useState(gIsPass);
  const [token, setToken] = React.useState(gToken);
  const { devLoginAction } = useLoginWithConfig();

  const onToken = (t: string) => {
    gToken = t;
    setToken(t);
  };
  const onId = (t: string) => {
    gId = t;
    setId(t);
  };
  const onIsPass = (t: boolean) => {
    gIsPass = t;
    setIsPass(t);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Click id to try to log in.'}
        </Text>
        <Text style={{ color: 'red' }}>{`connect state: ${s2}.`}</Text>
        <Text
          style={{ color: 'red' }}
        >{`login state: ${s}. reason: ${reason}`}</Text>
      </View>

      <View style={{ height: 10 }} />
      <TextInput
        placeholder={'Please enter ID.'}
        style={{
          height: 40,
          backgroundColor: '#fff8dc',
          color: 'black',
          borderRadius: 4,
        }}
        containerStyle={{ marginHorizontal: 10 }}
        value={id}
        onChangeText={onId}
      />
      <View style={{ height: 10 }} />
      <TextInput
        placeholder={'Please enter Token or password.'}
        style={{ backgroundColor: '#fff8dc', color: 'black', borderRadius: 4 }}
        containerStyle={{ marginHorizontal: 10 }}
        multiline={true}
        value={token}
        onChangeText={onToken}
      />
      <View style={{ height: 10 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>{isPass ? 'password to log in.' : 'token to log in.'}</Text>
        <Switch value={isPass} onValueChange={onIsPass} />
      </View>
      <View style={{ height: 10 }} />
      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#fff8dc',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
        }}
        onPress={() => {
          if (id && token) {
            devLoginAction({
              id: id,
              passOrToken: token,
              usePassword: isPass,
              onResult: ({ isOk, reason }) => {
                setS(isOk === true ? 'success' : 'failed');
                if (reason) {
                  setReason(reason);
                }
                if (isOk === true) {
                  navigation.replace('Home', {});
                }
              },
            });
          }
        }}
      >
        <Text style={{ color: '#8fbc8f', fontSize: 26 }}>
          {'click me for login.'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#fff8dc',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
        }}
        onPress={() => {
          im.logout({
            result: ({ isOk, error }) => {
              setS(isOk === true ? 'logouted' : 'failed');
              if (error) {
                console.warn('logout:', error);
              }
            },
          });
        }}
      >
        <Text style={{ color: '#8fbc8f', fontSize: 26 }}>
          {'click me for logout.'}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
