import * as React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import emoji from 'twemoji';

import { FACE_ASSETS, IconNameType } from '../../assets';
import { useConfigContext } from '../../config';
import {
  useCheckType,
  useColors,
  useCompare,
  useGetStyleProps,
} from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { SingleLineText } from '../../ui/Text';
import type { EmojiIconItem } from '../types';
import { gCountPerRow } from './EmojiList.const';
import { EmojiListFloatButtonMemo } from './EmojiListFloatButton';

/**
 * Emoji List Component properties.
 */
export type EmojiListProps = {
  /**
   * Callback function when an emoji is selected.
   */
  onFace?: (id: string) => void;
  /**
   * Callback function when the delete button is clicked.
   */
  onDel?: () => void;
  /**
   * Callback function when the send button is clicked.
   */
  onSend?: () => void;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The number of emojis per row.
   */
  countPerRow?: number;
  /**
   * The list of emoji expressions.
   *
   * The format needs to be followed. For example: `U+1F641` {@link FACE_ASSETS}. It will replace the built-in emoji  list.
   */
  emojiList?: EmojiIconItem[];

  /**
   * Whether to use the emoji chat mode.
   *
   * Its setting will affect the type of the return value of `onFace`. If true, returns the emoji string, otherwise returns the `U+xxxxx` string.
   *
   * @default false
   */
  isEmojiCharacter?: boolean;
};

/**
 * List of emoji expressions.
 *
 * @param props {@link EmojiListProps}
 * @returns JSX.Element
 */
export function EmojiList(props: EmojiListProps) {
  const { colors } = usePaletteContext();
  const { width: winWidth } = useWindowDimensions();
  const { getColor } = useColors({
    btn1: {
      light: colors.neutral[3],
      dark: colors.neutral[98],
    },
    btn2: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    selected: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const {
    onFace,
    containerStyle,
    countPerRow = gCountPerRow,
    emojiList,
    onDel,
    onSend,
    isEmojiCharacter = false,
  } = props;
  const { getStyleSize, getBorderRadius } = useGetStyleProps();
  const { width: propsWidth } = getStyleSize(containerStyle);
  const { checkType } = useCheckType();
  const { fontFamily } = useConfigContext();
  const { cornerRadius: corner } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  if (propsWidth) {
    checkType(propsWidth, 'number');
  }
  const getUnitSize = () => {
    if (propsWidth) {
      return (propsWidth as number) / countPerRow - 1;
    }
    return winWidth / countPerRow - 1;
  };
  const { enableCompare } = useConfigContext();
  useCompare(getColor, { enabled: enableCompare });

  const _emojiList =
    emojiList ??
    FACE_ASSETS.map((v) => {
      return {
        name: v as IconNameType,
        state: 'common',
      } as EmojiIconItem;
    });

  return (
    <View
      style={[
        {
          // height: gAspectRatio * winWidth,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      <ScrollView>
        <View style={styles.group}>
          <View style={styles.list}>
            {_emojiList.map((v, i) => {
              const r = emoji.convert.fromCodePoint(v.name.substring(2));
              return (
                <Pressable
                  key={i}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: getUnitSize(),
                    height: getUnitSize(),
                    // alignSelf: 'baseline', // !!! crash
                  }}
                  onPress={() => {
                    onFace?.(isEmojiCharacter === true ? r : v.name);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: getColor(
                        v.state === 'selected' ? 'selected' : ''
                      ),
                      borderRadius: getBorderRadius({
                        height: Platform.OS === 'ios' ? 50 : 50,
                        crt: corner.avatar,
                        cr: cornerRadius,
                      }),
                      // width: Platform.OS === 'ios' ? 36 : 36,
                      // height: Platform.OS === 'ios' ? 36 : 36,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SingleLineText
                      style={{
                        fontSize: Platform.OS === 'ios' ? 30 : 22,
                        fontFamily: fontFamily,
                        textAlign: 'center',
                        color: getColor('fg'),
                      }}
                    >
                      {r}
                    </SingleLineText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {onDel ? (
        <EmojiListFloatButtonMemo
          iconName={'arrow_left_thick'}
          isVisible={true}
          onClicked={onDel}
          containerStyle={{
            right: 16 + 44 + 12,
            bottom: 16,
            borderRadius: getBorderRadius({
              height: 36,
              crt: corner.avatar,
              cr: cornerRadius,
            }),
            backgroundColor: getColor('bg'),
          }}
          style={{
            tintColor: getColor('btn1'),
          }}
        />
      ) : null}
      {onSend ? (
        <EmojiListFloatButtonMemo
          iconName={'airplane'}
          isVisible={true}
          onClicked={onSend}
          containerStyle={{
            right: 16,
            bottom: 16,
            borderRadius: getBorderRadius({
              height: 44,
              crt: corner.avatar,
              cr: cornerRadius,
            }),
            backgroundColor: getColor('btn2'),
          }}
          style={{
            tintColor: getColor('bg'),
          }}
        />
      ) : null}
    </View>
  );
}

const EmojiListCompare = (
  _prevProps: Readonly<EmojiListProps>,
  _nextProps: Readonly<EmojiListProps>
) => {
  return true;
};

const styles = StyleSheet.create({
  group: { alignItems: 'center', flex: 1 },
  title: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
});

export const EmojiListMemo = React.memo(EmojiList, EmojiListCompare);
