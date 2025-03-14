import { default as Slider } from '@react-native-community/slider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import {
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
export function ColorSettingScreen(props: Props) {
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
  const {
    appPrimaryColor,
    onSetAppPrimaryColor,
    appErrorColor,
    appNeutralSColor,
    appSecondColor,
    appNeutralColor,
    onSetAppErrorColor,
    onSetAppSecondColor,
    onSetAppNeutralColor,
    onSetAppNeutralSColor,
    updateParams,
  } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [priColor, setPriColor] = React.useState(appPrimaryColor);
  const [errorColor, setErrorColor] = React.useState(appErrorColor);
  const [secondColor, setSecondColor] = React.useState(appSecondColor);
  const [neutralColor, setNeutralColor] = React.useState(appNeutralColor);
  const [neutralSColor, setNeutralSColor] = React.useState(appNeutralSColor);

  const onBack = () => {
    navi.goBack();
  };
  const onConfirm = () => {
    onSetAppPrimaryColor(priColor);
    onSetAppErrorColor(errorColor);
    onSetAppSecondColor(secondColor);
    onSetAppNeutralColor(neutralColor);
    onSetAppNeutralSColor(neutralSColor);
    navi.navigate({
      to: 'CommonSetting',
      props: {
        from: 'ColorSetting',
        hash: Date.now(),
      },
    });
  };
  const onChanged = () => {
    setChanged(true);
  };

  const onSetPriColor = (v: number) => {
    setPriColor(v);
    onChanged();
  };
  const onSetErrorColor = (v: number) => {
    setErrorColor(v);
    onChanged();
  };
  const onSetSecondColor = (v: number) => {
    setSecondColor(v);
    onChanged();
  };
  const onSetNeutralColor = (v: number) => {
    setNeutralColor(v);
    onChanged();
  };
  const onSetNeutralSColor = (v: number) => {
    setNeutralSColor(v);
    onChanged();
  };

  React.useEffect(() => {
    updateParams(
      ({
        appPrimaryColor,
        appErrorColor,
        appSecondColor,
        appNeutralColor,
        appNeutralSColor,
      }) => {
        setPriColor(appPrimaryColor);
        setErrorColor(appErrorColor);
        setSecondColor(appSecondColor);
        setNeutralColor(appNeutralColor);
        setNeutralSColor(appNeutralSColor);
      }
    );
  }, [updateParams]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_color_setting_navi_title')}
          />
        }
        Right={
          <Pressable
            onPress={onConfirm}
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
              {tr('_demo_color_setting_navi_confirm')}
            </SingleLineText>
          </Pressable>
        }
      />

      <View
        style={{
          backgroundColor: getColor('bg2'),
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: 44,
        }}
      >
        <SingleLineText
          style={{
            color: getColor('disable'),
          }}
          paletteType={'title'}
          textType={'small'}
        >
          {tr('_demo_color_setting_primary')}
        </SingleLineText>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: getColor('bg'),
        }}
      >
        <ColorSetting
          valueType={'primary'}
          value={priColor}
          onValueChange={onSetPriColor}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor('bg2'),
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: 44,
        }}
      >
        <SingleLineText
          style={{
            color: getColor('disable'),
          }}
          paletteType={'title'}
          textType={'small'}
        >
          {tr('_demo_color_setting_second')}
        </SingleLineText>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: getColor('bg'),
        }}
      >
        <ColorSetting
          valueType={'second'}
          value={secondColor}
          onValueChange={onSetSecondColor}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor('bg2'),
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: 44,
        }}
      >
        <SingleLineText
          style={{
            color: getColor('disable'),
          }}
          paletteType={'title'}
          textType={'small'}
        >
          {tr('_demo_color_setting_error')}
        </SingleLineText>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: getColor('bg'),
        }}
      >
        <ColorSetting
          valueType={'error'}
          value={errorColor}
          onValueChange={onSetErrorColor}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor('bg2'),
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: 44,
        }}
      >
        <SingleLineText
          style={{
            color: getColor('disable'),
          }}
          paletteType={'title'}
          textType={'small'}
        >
          {tr('_demo_color_setting_neutral')}
        </SingleLineText>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: getColor('bg'),
        }}
      >
        <ColorSetting
          valueType={'neutral'}
          value={neutralColor}
          onValueChange={onSetNeutralColor}
          colorFormat={(v) => `hsla(${v}, 8%, 50%, 1)`}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor('bg2'),
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: 44,
        }}
      >
        <SingleLineText
          style={{
            color: getColor('disable'),
          }}
          paletteType={'title'}
          textType={'small'}
        >
          {tr('_demo_color_setting_neutralS')}
        </SingleLineText>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: getColor('bg'),
        }}
      >
        <ColorSetting
          valueType={'neutralS'}
          value={neutralSColor}
          onValueChange={onSetNeutralSColor}
          colorFormat={(v) => `hsla(${v}, 36%, 50%, 1)`}
        />
      </View>
    </SafeAreaViewFragment>
  );
}

type ColorSettingProps = {
  value: number;
  onValueChange: (value: number) => void;
  valueType: 'primary' | 'second' | 'error' | 'neutral' | 'neutralS';
  colorFormat?: (v: number) => string;
};
function ColorSetting(props: ColorSettingProps) {
  const { value, onValueChange, valueType, colorFormat } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg1: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    bg2: {
      light: colors.neutral[9],
      dark: colors.neutral[7],
    },
    border: {
      light: colors.neutral[7],
      dark: colors.neutral[5],
    },
    v: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  // const [value, setValue] = React.useState<number>(0);
  const [color, setColor] = React.useState<string>('hsla(203, 100%, 50%, 1)');

  const getInitColor = React.useCallback(() => {
    if (valueType === 'primary') {
      return `hsla(203, 100%, 50%, 1)`;
    } else if (valueType === 'second') {
      return `hsla(155, 100%, 50%, 1)`;
    } else if (valueType === 'error') {
      return `hsla(350, 100%, 50%, 1)`;
    } else if (valueType === 'neutral') {
      return `hsla(203, 8%, 50%, 1)`;
    } else if (valueType === 'neutralS') {
      return `hsla(220, 36%, 50%, 1)`;
    }
    return 'hsla(203, 100%, 50%, 1)';
  }, [valueType]);

  React.useEffect(() => {
    setColor(getInitColor());
  }, [getInitColor]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          padding: 2,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: getColor('border'),
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
      <View style={{ width: 12 }} />
      <Slider
        minimumValue={0}
        maximumValue={360}
        step={1}
        minimumTrackTintColor={getColor('bg1') as string}
        value={value}
        style={{
          height: 4,
          // width: '80%',
          flexGrow: 1,
        }}
        onValueChange={(value) => {
          onValueChange(value);
          console.log('value', value);
          if (colorFormat) {
            setColor(colorFormat(value));
          } else {
            setColor(`hsla(${value}, 100%, 50%, 1)`);
          }
        }}
      />
      <View style={{ width: 10 }} />
      <View
        style={{
          width: 30,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <SingleLineText style={{ color: getColor('v') }}>
          {value}
        </SingleLineText>
      </View>
    </View>
  );
}
