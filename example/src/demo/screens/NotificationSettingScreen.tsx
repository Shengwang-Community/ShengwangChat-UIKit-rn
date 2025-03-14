import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import {
  ListItem,
  SingleLineText,
  Switch,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useGeneralSetting, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NotificationSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    t1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });
  const { appNotification, onSetAppNotification, updateParams } =
    useGeneralSetting();

  const onBack = () => {
    navi.goBack();
  };

  React.useEffect(() => {
    updateParams();
  }, [updateParams]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_notification_setting_navi_title')}
          />
        }
        Right={<View />}
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_notification_setting_offline_push')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appNotification !== undefined ? (
              <Switch
                value={appNotification}
                onValueChange={onSetAppNotification}
                height={31}
                width={51}
              />
            ) : null}
          </View>
        }
        tail={
          <View
            style={{
              height: 26,
              paddingHorizontal: 16,
              backgroundColor: getColor('bg2'),
              justifyContent: 'center',
            }}
          >
            <SingleLineText
              textType={'small'}
              paletteType={'body'}
              style={{ color: getColor('t1') }}
            >
              {tr('_demo_notification_setting_offline_push_tip')}
            </SingleLineText>
          </View>
        }
      />
    </SafeAreaViewFragment>
  );
}
