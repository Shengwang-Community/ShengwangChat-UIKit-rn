import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import {
  Icon,
  ListItem,
  SingleLineText,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import { useGeneralSetting } from '../hooks/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function StyleSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    disable: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const { appStyle, onSetAppStyle, updateParams } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState(appStyle);

  const onBack = () => {
    navi.goBack();
  };
  const onSave = () => {
    onSetAppStyle(currentStyle);
    navi.navigate({ to: 'CommonSetting' });
  };
  const onChanged = (index: number) => {
    setCurrentStyle(index === 0 ? 'classic' : 'modern');
    setChanged(true);
  };

  React.useEffect(() => {
    updateParams(({ appStyle }) => {
      setCurrentStyle(appStyle);
    });
  }, [updateParams]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_style_setting_navi_title')}
          />
        }
        Right={
          <Pressable
            onPress={onSave}
            style={{ paddingHorizontal: 8 }}
            disabled={changed ? false : true}
          >
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{
                color: getColor(changed ? 'enable' : 'disable'),
              }}
            >
              {tr('_demo_style_setting_navi_confim')}
            </SingleLineText>
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(0)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_style_setting_language_classic')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(0)}
          >
            <Icon
              name={
                currentStyle === 'modern'
                  ? 'unchecked_rectangle'
                  : 'radio_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentStyle === 'modern' ? 'disable' : 'enable'
                ),
              }}
            />
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(1)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_style_setting_language_modern')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(1)}
          >
            <Icon
              name={
                currentStyle === 'classic'
                  ? 'unchecked_rectangle'
                  : 'radio_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentStyle === 'classic' ? 'disable' : 'enable'
                ),
              }}
            />
          </Pressable>
        }
      />
    </SafeAreaViewFragment>
  );
}
