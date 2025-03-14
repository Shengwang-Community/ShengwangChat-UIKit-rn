import * as React from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';

import {
  Alert,
  BottomSheetNameMenu,
  Icon,
  ListItem,
  SimpleToast,
  SingleLineText,
  StatusAvatar,
  Text1Button,
  Text2Button,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import { accountType, demoType } from '../common/const';
import { mineInfo } from '../utils/utils';
import { useMineInfo } from './MineInfo.hooks';
import type { MineInfoProps } from './types';

export function MineInfo(props: MineInfoProps) {
  const { containerStyle } = props;
  const {
    userId,
    userName,
    userAvatar,
    alertRef,
    menuRef,
    toastRef,
    onRequestCloseMenu,
    onClickedState,
    onClickedLogout,
    onClickedCommon,
    onClickedMessageNotification,
    onClickedPrivacy,
    userState,
    onClickedPersonInfo,
    onClickedAbout,
    enablePresence,
    onCopyId,
    onClickedDestroyAccount,
    enableAccount = false,
  } = useMineInfo(props);
  const { cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
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
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    t3: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
    },
    n: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          {
            // flex: 1,
            flexGrow: 1,
            backgroundColor: getColor('bg'),
            // backgroundColor: 'red',
          },
          containerStyle,
        ]}
      >
        {enableAccount === true ? (
          <View
            style={{
              alignItems: 'center',
              paddingTop: 64,
              width: Dimensions.get('window').width,
            }}
          >
            <StatusAvatar
              size={100}
              url={userAvatar}
              userId={userId}
              // statusContainerStyle={{
              //   height: 22,
              //   width: 22,
              //   borderRadius: 11,
              //   right: -2,
              //   bottom: -2,
              // }}
              // statusStyle={{ height: 18, width: 18, borderRadius: 9 }}
              // statusStyle={{backgroundColor: 'red'}}
            />
            <View style={{ height: 12 }} />
            <SingleLineText
              textType={'large'}
              paletteType={'headline'}
              style={{ color: getColor('fg') }}
            >
              {userName ?? userId}
            </SingleLineText>
            <View style={{ height: 4 }} />
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 4,
              }}
              onPress={onCopyId}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{ color: getColor('t3') }}
              >
                {`ID: ${userId}`}
              </SingleLineText>
              <Icon
                name={'doc_on_doc'}
                style={{ width: 16, height: 16, tintColor: getColor('t3') }}
              />
            </Pressable>
          </View>
        ) : null}

        <View style={{ height: 10 }} />

        {/* <View style={{ flexGrow: 1 }} /> */}

        <ScrollView style={{ flex: 1 }}>
          {enablePresence === true ? (
            <ListItem
              header={
                <View
                  style={{
                    paddingHorizontal: 16,
                    height: 26,
                    justifyContent: 'center',
                  }}
                >
                  <SingleLineText
                    textType={'small'}
                    paletteType={'title'}
                    style={{ color: getColor('t3') }}
                  >
                    {tr('_demo_info_state_set')}
                  </SingleLineText>
                </View>
              }
              onClicked={onClickedState}
              containerStyle={{ paddingHorizontal: 16 }}
              LeftName={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name={mineInfo[5]!}
                    style={{ height: 28, width: 28, borderRadius: 8 }}
                  />
                  <View style={{ width: 8 }} />
                  <SingleLineText
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_demo_info_online_state')}
                  </SingleLineText>
                </View>
              }
              RightIcon={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SingleLineText
                    textType={'medium'}
                    paletteType={'label'}
                    style={{ color: getColor('t3') }}
                  >
                    {tr(userState)}
                  </SingleLineText>
                  <Icon
                    name={'chevron_right'}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: getColor('right'),
                    }}
                  />
                </View>
              }
            />
          ) : null}

          {enableAccount === true ? (
            <ListItem
              onClicked={onClickedPersonInfo}
              containerStyle={{ paddingHorizontal: 16 }}
              LeftName={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name={mineInfo[3]!}
                    style={{ height: 28, width: 28, borderRadius: 8 }}
                  />
                  <View style={{ width: 8 }} />
                  <SingleLineText
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_demo_info_person_info')}
                  </SingleLineText>
                </View>
              }
              RightIcon={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name={'chevron_right'}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: getColor('right'),
                    }}
                  />
                </View>
              }
            />
          ) : null}

          <ListItem
            onClicked={onClickedCommon}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={mineInfo[2]!}
                  style={{ height: 28, width: 28, borderRadius: 8 }}
                />
                <View style={{ width: 8 }} />
                <SingleLineText
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('_demo_info_common_setting')}
                </SingleLineText>
              </View>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'chevron_right'}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: getColor('right'),
                  }}
                />
              </View>
            }
          />

          <ListItem
            onClicked={onClickedMessageNotification}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={mineInfo[0]!}
                  style={{ height: 28, width: 28, borderRadius: 8 }}
                />
                <View style={{ width: 8 }} />
                <SingleLineText
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('_demo_info_message_notification')}
                </SingleLineText>
              </View>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'chevron_right'}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: getColor('right'),
                  }}
                />
              </View>
            }
          />

          <ListItem
            onClicked={onClickedPrivacy}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={mineInfo[4]!}
                  style={{ height: 28, width: 28, borderRadius: 8 }}
                />
                <View style={{ width: 8 }} />
                <SingleLineText
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('_demo_info_show_privacy')}
                </SingleLineText>
              </View>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'chevron_right'}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: getColor('right'),
                  }}
                />
              </View>
            }
          />

          <ListItem
            onClicked={onClickedAbout}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={mineInfo[1]!}
                  style={{ height: 28, width: 28, borderRadius: 8 }}
                />
                <View style={{ width: 8 }} />
                <SingleLineText
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('about')}
                </SingleLineText>
              </View>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'chevron_right'}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: getColor('right'),
                  }}
                />
              </View>
            }
          />

          {enableAccount === true ? (
            <ListItem
              header={
                <View
                  style={{
                    paddingHorizontal: 16,
                    height: 26,
                    justifyContent: 'center',
                  }}
                >
                  <SingleLineText
                    textType={'small'}
                    paletteType={'title'}
                    style={{ color: getColor('t3') }}
                  >
                    {tr('_demo_info_state_account')}
                  </SingleLineText>
                </View>
              }
              onClicked={onClickedLogout}
              // containerStyle={{ paddingHorizontal: 16 }}
              LeftName={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text1Button
                    sizesType={'middle'}
                    radiusType={input}
                    text={tr('_demo_info_logout')}
                    textStyle={{
                      fontSize: 16,
                      fontStyle: 'normal',
                      fontWeight: '500',
                    }}
                    onPress={onClickedLogout}
                  />
                </View>
              }
              RightIcon={
                <View style={{ flexDirection: 'row', alignItems: 'center' }} />
              }
            />
          ) : null}

          {enableAccount === true ? (
            demoType !== 3 || accountType === 'agora' ? null : (
              <ListItem
                // onClicked={onClickedDestroyAccount}
                // containerStyle={{ paddingHorizontal: 16 }}
                LeftName={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text2Button
                      sizesType={'middle'}
                      radiusType={input}
                      text={tr('_demo_info_account_destroy')}
                      textStyle={{
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: '500',
                        color: getColor('n'),
                      }}
                      onPress={onClickedDestroyAccount}
                    />
                  </View>
                }
                RightIcon={
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  />
                }
              />
            )
          ) : null}
        </ScrollView>

        <Alert ref={alertRef} />
        <BottomSheetNameMenu
          onRequestModalClose={onRequestCloseMenu}
          ref={menuRef}
        />
        <SimpleToast propsRef={toastRef} />
      </View>
    </GestureHandlerRootView>
  );
}
