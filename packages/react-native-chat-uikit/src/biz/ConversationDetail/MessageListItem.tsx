import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  GestureResponderEvent,
  Linking,
  Platform,
  // Image as RNImage,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ICON_ASSETS, IconNameType } from '../../assets';
import {
  gCustomMessageCardEventType,
  gMessageAttributeQuote,
  gMessageAttributeTranslate,
  gMessageAttributeUrlPreview,
} from '../../chat';
import { userInfoFromMessage } from '../../chat/utils';
import { useConfigContext } from '../../config';
import { useColors, useGetStyleProps } from '../../hook';
import { useI18nContext } from '../../i18n';
import {
  ChatCombineMessageBody,
  ChatCustomMessageBody,
  ChatFileMessageBody,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVideoMessageBody,
  ChatVoiceMessageBody,
} from '../../rename.chat';
import { usePaletteContext, useThemeContext } from '../../theme';
import {
  DefaultImage,
  DynamicIcon,
  DynamicIconRef,
  Icon,
  LoadingIcon,
} from '../../ui/Image';
import { HighUrl, SingleLineText, Text } from '../../ui/Text';
import { formatTsForConvDetail } from '../../utils';
import { Avatar } from '../Avatar';
import { gMaxVoiceDuration } from '../const';
import { useMessageSnapshot, useUrlPreview } from '../hooks';
import { gMessageAvatarSize, gTriangleWidth } from './const';
import { MessageHistoryListItemMemo } from './MessageHistoryListItem';
import {
  getFileSize,
  getImageShowSize,
  getImageThumbUrl,
  getMessageBubblePadding,
  getMessageState,
  getPaddingWidth,
  getStateIcon,
  getStateIconColor,
  getSystemTip,
  getVideoThumbUrl,
  isQuoteMessage,
  isSupportMessage,
} from './MessageListItem.hooks';
import type {
  AvatarViewProps,
  CheckViewProps,
  MessageBubbleProps,
  MessageCombineProps,
  MessageContentProps,
  MessageCustomCardProps,
  MessageDefaultImageProps,
  MessageFileProps,
  MessageImageProps,
  MessageQuoteBubbleProps,
  MessageReactionProps,
  MessageTextProps,
  MessageThreadBubbleProps,
  MessageVideoProps,
  MessageViewProps,
  MessageVoiceProps,
  NameViewProps,
  StateViewProps,
  SystemTipViewProps,
  TimeTipViewProps,
  TimeViewProps,
} from './MessageListItem.type';
import type {
  MessageEditableStateType,
  MessageHistoryModel,
  MessageListItemProps,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export function MessageText(props: MessageTextProps) {
  const { layoutType, msg, isSupport, onLongPress } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getUrlListFromText } = useUrlPreview();
  const { getColor } = useColors({
    left_text: {
      light: colors.neutral[1],
      dark: colors.neutral[1],
    },
    left_url_text: {
      light: colors.primary[5],
      dark: colors.primary[5],
    },
    right_text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_text_flag: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[7],
    },
    right_text_flag: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    left_divider: {
      light: colors.neutralSpecial[8],
      dark: colors.primary[6],
    },
    right_divider: {
      light: colors.primary[8],
      dark: colors.primary[6],
    },
    url_text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    url_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    url_image_bg: {
      light: 'rgba(0, 0, 0, 0.05)',
      dark: 'rgba(0, 0, 0, 0.05)',
    },
    url_parsing: {
      light: colors.neutral[5],
      dark: colors.neutral[7],
    },
  });
  const body = msg.body as ChatTextMessageBody;
  // const content = emoji.toCodePointText(body.content);
  let content = body.content;
  const editable =
    body.modifyCount !== undefined && body.modifyCount > 0
      ? 'edited'
      : ('no-editable' as MessageEditableStateType);
  if (isSupport !== true) {
    content = tr('_uikit_msg_tip_not_support');
  }

  // const codes = body.targetLanguageCodes;
  // const translated = codes && codes?.length > 0;
  const translatedContent =
    body.translations &&
    body.targetLanguageCodes &&
    body.targetLanguageCodes?.length > 0
      ? body.translations[body.targetLanguageCodes[0]!]
      : undefined;

  const translated = msg.attributes?.[gMessageAttributeTranslate] as
    | boolean
    | undefined;
  const urlPreview = msg.attributes?.[gMessageAttributeUrlPreview] as {
    url: string;
    title: string | undefined;
    description: string | undefined;
    imageUrl: string | undefined;
  };
  const urls = getUrlListFromText(content);

  return (
    <View>
      <View
        style={{
          marginVertical: 8,
          marginBottom: translated === true ? 8 : 8,
          paddingHorizontal: 12,
        }}
      >
        {urls && urls.length >= 1 ? (
          <HighUrl
            content={content}
            urlStyle={{
              textDecorationLine: 'underline',
            }}
            urlColors={[
              getColor(layoutType === 'left' ? 'left_url_text' : 'right_text')!,
              getColor(layoutType === 'left' ? 'left_url_text' : 'right_text')!,
            ]}
            textColors={[
              getColor(layoutType === 'left' ? 'left_text' : 'right_text')!,
              getColor(layoutType === 'left' ? 'left_text' : 'right_text')!,
            ]}
            textType={'large'}
            paletteType={'body'}
            onClicked={(url) => {
              const _url = url.startsWith('http') ? url : `https://${url}`;
              Linking.openURL(_url);
            }}
            onLongPress={onLongPress}
          />
        ) : (
          <Text
            textType={'large'}
            paletteType={'body'}
            style={{
              color: getColor(
                layoutType === 'left' ? 'left_text' : 'right_text'
              ),
            }}
          >
            {content}
          </Text>
        )}

        {editable === 'edited' ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <Icon
              name={'slash_in_rectangle'}
              style={{
                height: 16,
                width: 16,
                tintColor: getColor(
                  layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
                ),
              }}
            />
            <SingleLineText
              textType={'extraSmall'}
              paletteType={'body'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
                ),
              }}
            >
              {tr('_uikit_msg_edit')}
            </SingleLineText>
          </View>
        ) : null}
      </View>

      {translated === true ? (
        <View
          style={{
            borderBottomColor: getColor(
              layoutType === 'left' ? 'left_divider' : 'right_divider'
            ),
            borderBottomWidth: 0.5,
            marginHorizontal: 0,
            paddingHorizontal: 12,
          }}
        />
      ) : null}

      <View
        style={{
          marginVertical: translated === true ? 8 : 0,
          paddingHorizontal: 12,
        }}
      >
        {translated === true ? (
          <Pressable onPress={() => {}}>
            <Text
              textType={'large'}
              paletteType={'body'}
              selectable={true}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
              }}
            >
              {translatedContent}
            </Text>
          </Pressable>
        ) : null}

        {translated === true ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <Icon
              name={'a_in_arrows_round'}
              style={{
                height: 16,
                width: 16,
                tintColor: getColor(
                  layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
                ),
              }}
            />
            <SingleLineText
              textType={'extraSmall'}
              paletteType={'body'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
                ),
              }}
            >
              {tr('_uikit_msg_translate')}
            </SingleLineText>
          </View>
        ) : null}
      </View>

      {urlPreview ? (
        urlPreview.title ? (
          <View>
            {urlPreview.imageUrl ? (
              <DefaultImage
                source={{
                  uri: urlPreview.imageUrl,
                }}
                style={[
                  {
                    width: '100%',
                    height: 118,
                    resizeMode: 'cover',
                  },
                ]}
                defaultSource={ICON_ASSETS.url_preview_placeholder('x')}
                defaultStyle={{
                  width: '100%',
                  height: 118,
                  tintColor: getColor('fg'),
                }}
                defaultContainerStyle={{
                  width: '100%',
                  height: 118,
                  backgroundColor: getColor('url_image_bg'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
                containerStyle={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    backgroundColor: getColor('url_bg'),
                  },
                ]}
              />
            ) : (
              <View
                style={{
                  borderBottomColor: getColor(
                    layoutType === 'left' ? 'left_divider' : 'right_divider'
                  ),
                  borderBottomWidth: 0.5,
                  marginHorizontal: 12,
                  paddingHorizontal: 12,
                }}
              />
            )}

            <SingleLineText
              paletteType={'headline'}
              textType={'small'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
                paddingTop: 8,
                paddingHorizontal: 12,
              }}
            >
              {urlPreview.title}
            </SingleLineText>
            <View style={{ height: 4 }} />
            <Text
              paletteType={'body'}
              textType={'medium'}
              numberOfLines={2}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
                paddingBottom: 8,
                paddingHorizontal: 12,
              }}
            >
              {urlPreview.description}
            </Text>
          </View>
        ) : null
      ) : urls && urls.length === 1 ? (
        <View style={{ backgroundColor: getColor('url_bg') }}>
          <SingleLineText
            paletteType={'body'}
            textType={'small'}
            style={{
              color: getColor('url_parsing'),
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            {tr('_uikit_message_url_parsing')}
          </SingleLineText>
        </View>
      ) : null}
    </View>
  );
}

export function MessageCombine(props: MessageCombineProps) {
  const { layoutType, msg } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_text: {
      light: colors.neutral[1],
      dark: colors.neutral[1],
    },
    right_text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_text_flag: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[7],
    },
    right_text_flag: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    left_divider: {
      light: colors.neutralSpecial[8],
      dark: colors.primary[6],
    },
    right_divider: {
      light: colors.primary[8],
      dark: colors.primary[6],
    },
  });
  const body = msg.body as ChatCombineMessageBody;
  // const content = emoji.toCodePointText(body.content);
  let content = body.summary;

  return (
    <View>
      <Text
        textType={'large'}
        paletteType={'body'}
        style={{
          color: getColor(layoutType === 'left' ? 'left_text' : 'right_text'),
        }}
        numberOfLines={4}
      >
        {content}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <Icon
          name={'3pm'}
          style={{
            height: 16,
            width: 16,
            tintColor: getColor(
              layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
            ),
          }}
        />
        <SingleLineText
          textType={'extraSmall'}
          paletteType={'body'}
          style={{
            color: getColor(
              layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
            ),
          }}
        >
          {tr('_uikit_msg_record')}
        </SingleLineText>
      </View>
    </View>
  );
}

export function MessageDefaultImage(props: MessageDefaultImageProps) {
  const {
    url,
    width,
    height,
    thumbHeight,
    thumbWidth,
    iconName,
    onError,
    containerStyle,
  } = props;
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { releaseArea } = useConfigContext();
  const { getColor } = useColors({
    thumb: {
      light: colors.neutral[7],
      dark: colors.neutral[2],
    },
    border: {
      light: colors.neutral[9],
      dark: colors.neutral[3],
    },
  });
  return (
    <DefaultImage
      source={{
        uri: url,
      }}
      style={[
        {
          width: width,
          height: height,
        },
      ]}
      defaultSource={ICON_ASSETS[iconName]('3x')}
      defaultStyle={{
        width: thumbWidth,
        height: thumbHeight,
        tintColor: getColor('thumb'),
      }}
      defaultContainerStyle={{
        width: width,
        height: height,
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      onError={onError}
      containerStyle={[
        {
          borderWidth: 1,
          borderColor: getColor('border'),
          borderRadius: getBorderRadius({
            height: width + 1,
            crt:
              releaseArea === 'china' ? corner.bubble[0]! : corner.bubble[2]!,
            cr: cornerRadius,
          }),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        containerStyle,
      ]}
    />
  );
}

export function MessageImage(props: MessageImageProps) {
  const { msg, maxWidth } = props;
  // const url1 =
  //   '/storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url3 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718%23demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url5 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url2 =
  //   '/var/mobile/Containers/Data/Application/CC0AD493-D627-463B-B351-44500E6FB1E2/tmp/AD1256B8-B32C-4CFE-B5F5-ECA21662B4E8.jpg';

  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>(undefined);
  const { width, height } = getImageShowSize(msg, maxWidth);
  React.useEffect(() => {
    msg.status;
    getImageThumbUrl(msg)
      .then((url) => {
        setThumbUrl(url);
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <MessageDefaultImage
      url={thumbUrl}
      width={width}
      height={height}
      thumbWidth={64}
      thumbHeight={64}
      iconName={'img'}
    />
  );
}

export function MessageVoice(props: MessageVoiceProps) {
  const {
    msg,
    layoutType,
    isPlay: propsIsPlay = false,
    maxWidth: propsMaxWidth,
  } = props;
  const body = msg.body as ChatVoiceMessageBody;
  const { duration: propsDuration } = body;
  const safeDuration =
    propsDuration > 60 ? 60 : propsDuration < 1 ? 1 : propsDuration;
  const duration = safeDuration * 1000;
  const maxWidth = propsMaxWidth ?? Dimensions.get('window').width * 0.6;
  const minWidth = Dimensions.get('window').width * 0.1;
  const width =
    Math.floor(((maxWidth - minWidth) * duration) / gMaxVoiceDuration) +
    minWidth;
  const loopCount = -1;
  const ref = React.useRef<DynamicIconRef>({} as any);
  // const isPlayRef = React.useRef(false);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_voice: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    right_voice: {
      light: colors.neutral[98],
      dark: colors.neutral[95],
    },
    left_second: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_second: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const voiceIcons = React.useMemo((): IconNameType[] => {
    if (layoutType === 'left') {
      return [
        '1st_frame_lft_lgt_sdy',
        '2nd_frame_lft_lgt_sdy',
        '3th_frame_lft_lgt_sdy',
      ];
    } else {
      return [
        '1st_frame_rgt_lgt_sdy',
        '2nd_frame_rgt_lgt_sdy',
        '3th_frame_rgt_lgt_sdy',
      ];
    }
  }, [layoutType]);
  const seconds = safeDuration;

  React.useEffect(() => {
    if (propsIsPlay === true) {
      ref.current?.startPlay?.();
    } else {
      ref.current?.stopPlay?.();
    }
  }, [propsIsPlay]);

  return (
    <View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        maxWidth: maxWidth,
        width: Math.floor(width), // !!! Decimals cause errors. Appears only if aligned right. for example: 105.5
        alignItems: 'center',
      }}
    >
      <DynamicIcon
        propsRef={ref}
        names={voiceIcons}
        loopCount={loopCount}
        resolution={'3x'}
        // onPlayStart={onPlayStart}
        // onPlayFinished={onPlayFinished}
        initialIndex={2}
        style={{
          width: 20,
          height: 20,
          tintColor: getColor(
            layoutType === 'left' ? 'left_voice' : 'right_voice'
          ),
        }}
      />
      <View style={{ flexGrow: 1 }} />
      <Text
        textType={'large'}
        paletteType={'body'}
        style={{
          color: getColor(
            layoutType === 'left' ? 'left_second' : 'right_second'
          ),
        }}
      >{`${seconds}"`}</Text>
    </View>
  );
}

export function MessageVideo(props: MessageVideoProps) {
  const { msg, maxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();
  const { width, height } = getImageShowSize(msg, maxWidth);
  const [showTriangle, setShowTriangle] = React.useState(true);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    video: {
      light: colors.neutral[98],
      dark: colors.neutral[95],
    },
  });
  React.useEffect(() => {
    msg.status;
    getVideoThumbUrl(msg)
      .then((url) => {
        if (url) {
          setThumbUrl(url);
        }
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <View>
      <MessageDefaultImage
        url={thumbUrl}
        width={width}
        height={height}
        thumbWidth={64}
        thumbHeight={64}
        iconName={'triangle_in_rectangle'}
        onError={() => {
          setShowTriangle(false);
        }}
      />
      {showTriangle === true ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Icon
            name={'triangle_in_circle'}
            style={{ width: 64, height: 64, tintColor: getColor('video') }}
            resolution={'3x'}
          />
        </View>
      ) : null}
    </View>
  );
}

export function MessageFile(props: MessageFileProps) {
  const { msg, maxWidth, layoutType } = props;
  const body = msg.body as ChatFileMessageBody;
  const fileName = body.displayName;
  const fileSize = React.useMemo(
    () => getFileSize(body.fileSize),
    [body.fileSize]
  );
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { releaseArea } = useConfigContext();
  const { getColor } = useColors({
    left_file_bg: {
      light: colors.neutral[100],
      dark: colors.neutral[6],
    },
    right_file_bg: {
      light: colors.neutral[100],
      dark: colors.neutral[6],
    },
    left_file_fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    right_file_fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    left_name: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_name: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_size: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    right_size: {
      light: colors.neutral[95],
      dark: colors.neutralSpecial[6],
    },
  });
  return (
    <View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        width: maxWidth,
        padding: 8,
      }}
    >
      {layoutType !== 'right' ? null : <View style={{ flexGrow: 1 }} />}

      <View
        style={{
          maxWidth: '75%',
          paddingHorizontal: layoutType === 'left' ? undefined : 12,
          justifyContent: 'space-between',
        }}
      >
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_name' : 'right_name'),
          }}
        >
          {fileName}
        </SingleLineText>
        <SingleLineText
          textType={'medium'}
          paletteType={'body'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_size' : 'right_size'),
          }}
        >
          {fileSize}
        </SingleLineText>
      </View>

      {layoutType === 'left' ? <View style={{ flexGrow: 1 }} /> : null}

      <View
        style={{
          padding: 6,
          backgroundColor: getColor(
            layoutType === 'left' ? 'left_file_bg' : 'right_file_bg'
          ),
          borderRadius: getBorderRadius({
            height: 32,
            crt:
              releaseArea === 'china' ? corner.bubble[0]! : corner.bubble[2]!,
            cr: cornerRadius,
          }),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon
          name={'doc'}
          style={{
            width: 32,
            height: 32,
            tintColor: getColor(
              layoutType === 'left' ? 'left_file_fg' : 'right_file_fg'
            ),
          }}
        />
      </View>
    </View>
  );
}

export function MessageCustomCard(props: MessageCustomCardProps) {
  const { msg, maxWidth, layoutType } = props;
  const body = msg.body as ChatCustomMessageBody;
  const avatar = body.params?.avatar;
  const userId = body.params?.userId;
  const userName = body.params?.nickname;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_divider: {
      light: colors.neutralSpecial[8],
      dark: colors.primary[6],
    },
    right_divider: {
      light: colors.primary[8],
      dark: colors.primary[6],
    },
    left_name: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_name: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_name_small: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[3],
    },
    right_name_small: {
      light: colors.neutral[95],
      dark: colors.neutralSpecial[7],
    },
  });
  return (
    <View style={{ width: maxWidth }}>
      <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size={44} url={avatar} />
        <View style={{ width: 12 }} />
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_name' : 'right_name'),
            maxWidth: '70%',
          }}
        >
          {userName ?? userId}
        </SingleLineText>
      </View>
      <View
        style={{
          borderBottomColor: getColor(
            layoutType === 'left' ? 'left_divider' : 'right_divider'
          ),
          borderBottomWidth: 0.5,
          marginHorizontal: 12,
        }}
      />
      <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
        <SingleLineText
          textType={'extraSmall'}
          paletteType={'label'}
          style={{
            color: getColor(
              layoutType === 'left' ? 'left_name_small' : 'right_name_small'
            ),
            maxWidth: '100%',
          }}
        >
          {tr('_uikit_msg_custom_card')}
        </SingleLineText>
      </View>
    </View>
  );
}

export function MessageContent(props: MessageContentProps) {
  const {
    msg,
    isSupport,
    layoutType,
    contentMaxWidth,
    isVoicePlaying,
    ...others
  } = props;
  if (isSupport === true) {
    switch (msg.body.type) {
      case ChatMessageType.TXT: {
        return (
          <MessageText
            msg={msg}
            layoutType={layoutType}
            isSupport={isSupport}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.IMAGE: {
        return (
          <MessageImage
            layoutType={layoutType}
            msg={msg}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.VOICE: {
        return (
          <MessageVoice
            msg={msg}
            layoutType={layoutType}
            isPlay={isVoicePlaying}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.VIDEO: {
        return (
          <MessageVideo
            msg={msg}
            layoutType={layoutType}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.FILE: {
        return (
          <MessageFile
            msg={msg}
            layoutType={layoutType}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.COMBINE: {
        return (
          <MessageCombine
            msg={msg}
            layoutType={layoutType}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      case ChatMessageType.CUSTOM: {
        const body = msg.body as ChatCustomMessageBody;
        if (body.event === gCustomMessageCardEventType) {
          return (
            <MessageCustomCard
              msg={msg}
              layoutType={layoutType}
              maxWidth={contentMaxWidth}
              {...others}
            />
          );
        }
        return (
          <MessageText
            msg={msg}
            layoutType={layoutType}
            isSupport={isSupport}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
      default: {
        return (
          <MessageText
            msg={msg}
            layoutType={layoutType}
            isSupport={isSupport}
            maxWidth={contentMaxWidth}
            {...others}
          />
        );
      }
    }
  } else {
    return (
      <MessageText
        msg={msg}
        layoutType={layoutType}
        isSupport={isSupport}
        {...others}
      />
    );
  }
}

export function MessageBubble(props: MessageBubbleProps) {
  const {
    hasTriangle = true,
    model,
    containerStyle,
    onClicked,
    onLongPress,
    maxWidth,
    MessageContent: propsMessageContent,
    onClickedChecked,
  } = props;
  const checked = (model as MessageModel)?.checked;
  const _MessageContent = propsMessageContent ?? MessageContent;
  const {
    layoutType,
    msg,
    isVoicePlaying,
    quoteMsg,
    thread: threadMsg,
  } = model;
  const touchRef = React.useRef<View>(null);
  const { releaseArea } = useConfigContext();
  const { paddingHorizontal, paddingVertical, hasBorderRadius } = React.useMemo(
    () => getMessageBubblePadding(msg),
    [msg]
  );
  const hasQuote = quoteMsg !== undefined;
  const hasThread = threadMsg !== undefined;
  const triangleWidth = releaseArea === 'china' ? gTriangleWidth : 0;
  const isSupport = isSupportMessage(msg);
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getMessageBubbleBorderRadius, getBorderRadius } = useGetStyleProps();
  const { getColor } = useColors({
    left_bg: {
      light: colors.primary[95],
      dark: colors.primary[6],
    },
    right_bg: {
      light: colors.primary[5],
      dark: colors.primary[2],
    },
    url_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
  });
  const isShowTriangle = React.useMemo(() => {
    return (
      hasTriangle === true &&
      msg.body.type !== ChatMessageType.IMAGE &&
      msg.body.type !== ChatMessageType.VIDEO
    );
  }, [hasTriangle, msg.body.type]);
  const contentMaxWidth = React.useMemo(() => {
    const _maxWidth = maxWidth
      ? maxWidth - (paddingHorizontal ?? 0) * 2
      : undefined;
    if (isShowTriangle === true) {
      return _maxWidth ? _maxWidth - triangleWidth : undefined;
    } else {
      return _maxWidth;
    }
  }, [isShowTriangle, maxWidth, paddingHorizontal, triangleWidth]);

  const _onClicked = React.useCallback(
    (event?: GestureResponderEvent) => {
      if (checked !== undefined) {
        onClickedChecked?.();
      } else {
        if (onClicked) {
          if (event) {
            const pressedX = event.nativeEvent.pageX;
            const pressedY = event.nativeEvent.pageY;

            touchRef.current?.measure((_, __, width, height, pageX, pageY) => {
              onClicked(msg.msgId.toString(), model, {
                pressedX: pressedX,
                pressedY: pressedY,
                componentHeight: height,
                componentWidth: width,
                componentX: pageX,
                componentY: pageY,
              });
            });
          } else {
            onClicked(msg.msgId.toString(), model);
          }
        }
      }
    },
    [checked, model, msg.msgId, onClicked, onClickedChecked]
  );

  const _onLongPress = React.useCallback(
    (event?: GestureResponderEvent) => {
      if (checked !== undefined) {
        onClickedChecked?.();
      } else {
        if (onLongPress) {
          if (event) {
            const pressedX = event.nativeEvent.pageX;
            const pressedY = event.nativeEvent.pageY;

            touchRef.current?.measure((_, __, width, height, pageX, pageY) => {
              onLongPress(msg.msgId.toString(), model, {
                pressedX: pressedX,
                pressedY: pressedY,
                componentHeight: height,
                componentWidth: width,
                componentX: pageX,
                componentY: pageY,
              });
            });
          } else {
            onLongPress(msg.msgId.toString(), model);
          }
        }
      }
    },
    [checked, model, msg.msgId, onClickedChecked, onLongPress]
  );

  const _onClickedContent = _onClicked;

  const _onLongPressContent = _onLongPress;

  return (
    <View
      style={[
        {
          flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
          maxWidth: maxWidth ?? '60%',
        },
        containerStyle,
      ]}
    >
      {isShowTriangle ? (
        <View style={{ paddingBottom: 10 }}>
          <View style={{ flexGrow: 1 }} />
          <Icon
            name={
              layoutType === 'left' ? 'message_arrow_lft' : 'message_arrow_rgt'
            }
            style={{
              width: triangleWidth,
              height: 8,
              tintColor: getColor(
                layoutType === 'left' ? 'left_bg' : 'right_bg'
              ),
            }}
          />
        </View>
      ) : null}

      <Pressable
        ref={touchRef}
        style={[
          styles.bubble,
          {
            backgroundColor: getColor(
              layoutType === 'left' ? 'left_bg' : 'right_bg'
            ),
            paddingHorizontal: paddingHorizontal,
            paddingVertical: paddingVertical,
          },
          hasBorderRadius
            ? undefined
            : getMessageBubbleBorderRadius({
                height: 0,
                layoutType: layoutType,
                hasTopNeighbor: hasQuote,
                hasBottomNeighbor: hasThread,
                messageBubbleType: 'content',
              }),
          hasBorderRadius
            ? {
                borderRadius: getBorderRadius({
                  height: 0,
                  crt:
                    releaseArea === 'china'
                      ? corner.bubble[0]!
                      : corner.bubble[2]!,
                  cr: cornerRadius,
                }),
              }
            : undefined,
        ]}
        onPress={_onClicked}
        onLongPress={_onLongPress}
      >
        {/* <MessageContent
          isSupport={isSupport}
          msg={msg}
          layoutType={layoutType}
          isVoicePlaying={isVoicePlaying}
          contentMaxWidth={contentMaxWidth}
        /> */}
        {_MessageContent({
          isSupport,
          msg,
          layoutType,
          isVoicePlaying,
          contentMaxWidth,
          onClicked: _onClickedContent,
          onLongPress: _onLongPressContent,
        })}
      </Pressable>
    </View>
  );
}

export function AvatarView(props: AvatarViewProps) {
  const { isVisible = true, layoutType, avatar, onAvatarClicked } = props;
  return (
    <Pressable
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? undefined : 8,
        paddingRight: layoutType === 'left' ? 8 : undefined,
      }}
      onPress={onAvatarClicked}
    >
      <View style={{ flexGrow: 1 }} />
      <Avatar size={gMessageAvatarSize} url={avatar} />
    </Pressable>
  );
}

export function NameView(props: NameViewProps) {
  const { isVisible = true, layoutType, name, hasAvatar, hasTriangle } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
  });

  const paddingWidth = getPaddingWidth({
    avatarWidth: hasAvatar ? gMessageAvatarSize : 0,
    triangleWidth: hasTriangle ? gTriangleWidth : 0,
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? paddingWidth : undefined,
        paddingRight: layoutType === 'left' ? undefined : paddingWidth,
        marginBottom: 2,
      }}
    >
      <SingleLineText
        textType={'small'}
        paletteType={'label'}
        style={{
          color: getColor('text'),
        }}
      >
        {name}
      </SingleLineText>
    </View>
  );
}

export function TimeView(props: TimeViewProps) {
  const {
    isVisible = true,
    layoutType,
    timestamp,
    hasAvatar,
    hasTriangle,
  } = props;
  const { formatTime } = useConfigContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  const time = formatTime?.conversationDetailCallback
    ? formatTime.conversationDetailCallback(timestamp)
    : formatTsForConvDetail(timestamp);
  const paddingWidth = getPaddingWidth({
    avatarWidth: hasAvatar ? gMessageAvatarSize : 0,
    triangleWidth: hasTriangle ? gTriangleWidth : 0,
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? paddingWidth : undefined,
        paddingRight: layoutType === 'left' ? undefined : paddingWidth,
        marginTop: 2,
      }}
    >
      <Text
        textType={'small'}
        paletteType={'body'}
        style={{ color: getColor('text') }}
      >
        {time}
      </Text>
    </View>
  );
}

export function StateView(props: StateViewProps) {
  const { isVisible = true, layoutType, state, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    common: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    red: {
      light: colors.error[5],
      dark: colors.error[6],
    },
    green: {
      light: colors.secondary[4],
      dark: colors.secondary[5],
    },
  });

  const isStop = React.useMemo(() => {
    return state !== 'loading-attachment' && state !== 'sending';
  }, [state]);
  const iconName = React.useMemo(() => getStateIcon(state), [state]);
  const iconColor = React.useMemo(() => getStateIconColor(state), [state]);
  return (
    <Pressable
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 4 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 4,
      }}
      onPress={onClicked}
    >
      <View style={{ flexGrow: 1 }} />
      {isStop === true ? (
        <Icon
          name={iconName}
          style={{
            height: 20,
            width: 20,
            tintColor: getColor(iconColor),
          }}
        />
      ) : (
        <LoadingIcon
          isStop={isStop}
          name={iconName}
          style={{
            width: 20,
            height: 20,
            tintColor: getColor(iconColor),
          }}
        />
      )}
    </Pressable>
  );
}

export function CheckView(props: CheckViewProps) {
  const { isVisible = false, layoutType, children, checked, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    uncheck: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    checked: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <Pressable
      style={{
        display: isVisible === false ? 'flex' : 'none',
        paddingLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width,
      }}
      onPress={onClicked}
    >
      <Icon
        name={checked === true ? 'checked_rectangle' : 'unchecked_rectangle'}
        style={{
          width: 28,
          height: 28,
          tintColor: getColor(checked === true ? 'checked' : 'uncheck'),
        }}
      />
      <View
        style={{
          flexGrow: layoutType === 'left' ? undefined : 1,
          height: 10,
        }}
      />
      {children}
    </Pressable>
  );
}

export function MessageThreadBubble(props: MessageThreadBubbleProps) {
  const { thread, hasAvatar, hasTriangle, layoutType, onClicked, maxWidth } =
    props;
  const { colors } = usePaletteContext();
  const { getMessageBubbleBorderRadius } = useGetStyleProps();
  const { fontFamily } = useConfigContext();
  const { tr } = useI18nContext();
  const { getMessageSnapshot } = useMessageSnapshot();
  const { getColor } = useColors({
    common: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    dis: {
      light: colors.neutral[3],
      dark: colors.neutral[7],
    },
    text2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  const paddingWidth = getPaddingWidth({
    avatarWidth: hasAvatar ? gMessageAvatarSize : 0,
    triangleWidth: hasTriangle ? gTriangleWidth : 0,
  });

  const onLongPress = React.useCallback(() => {
    if (thread) {
      onClicked?.(thread.threadId);
    }
  }, [onClicked, thread]);

  if (!thread) {
    return null;
  }

  return (
    <Pressable
      style={[
        {
          flexDirection: 'column',
          // alignItems: 'center',
          marginLeft: layoutType === 'left' ? paddingWidth : undefined,
          marginRight: layoutType === 'left' ? undefined : paddingWidth,
          marginTop: 2,
          backgroundColor: getColor('bg2'),
          width: maxWidth,
        },
        getMessageBubbleBorderRadius({
          height: 0,
          layoutType: layoutType,
          hasTopNeighbor: true,
          hasBottomNeighbor: false,
          messageBubbleType: 'thread',
        }),
      ]}
      onPress={onLongPress}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingTop: 8,
        }}
      >
        <Icon
          name={'hashtag_in_bubble_fill' as IconNameType}
          style={{
            width: 20,
            height: 20,
            margin: 4,
            tintColor: getColor('dis'),
          }}
        />
        <SingleLineText
          paletteType={'label'}
          textType={'medium'}
          style={{
            color: getColor('dis'),
            fontFamily: fontFamily,
            maxWidth: '60%',
          }}
        >
          {thread.threadName ?? thread.threadId}
        </SingleLineText>
        <View style={{ flexGrow: 1 }} />
        <SingleLineText
          paletteType={'label'}
          textType={'small'}
          style={{
            color: getColor('common'),
            fontFamily: fontFamily,
          }}
        >
          {tr(
            '_uikit_thread_msg_count',
            `${thread.msgCount > 99 ? '+99' : thread.msgCount}`
          )}
        </SingleLineText>
        <Icon
          name={'chevron_right_small' as IconNameType}
          style={{
            width: 16,
            height: 16,
            margin: -4,
            tintColor: getColor('common'),
          }}
        />
      </View>
      <SingleLineText
        paletteType={'label'}
        textType={'medium'}
        style={{
          color: getColor('text2'),
          fontFamily: fontFamily,
          paddingHorizontal: 12,
          paddingBottom: 8,
          maxWidth: '100%',
        }}
      >
        {getMessageSnapshot(thread.lastMessage)}
      </SingleLineText>
    </Pressable>
  );
}

export function MessageReaction(props: MessageReactionProps) {
  const {
    reactions,
    hasAvatar,
    hasTriangle,
    layoutType,
    onClicked,
    onLongPress,
  } = props;
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { fontFamily } = useConfigContext();
  const { releaseArea } = useConfigContext();
  const { getColor } = useColors({
    common: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    dis: {
      light: colors.neutral[3],
      dark: colors.neutral[7],
    },
    green: {
      light: colors.secondary[4],
      dark: colors.secondary[5],
    },
    plus: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  const paddingWidth = getPaddingWidth({
    avatarWidth: hasAvatar ? gMessageAvatarSize : 0,
    triangleWidth: hasTriangle ? gTriangleWidth : 0,
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: layoutType === 'left' ? paddingWidth : undefined,
        paddingRight: layoutType === 'left' ? undefined : paddingWidth,
        marginTop: 2,
      }}
    >
      {reactions?.map((v, i) => {
        if (i >= 0 && i < 4) {
          const r = v.reaction;
          return (
            <Pressable
              key={i}
              onPress={() => onClicked?.(v.reaction)}
              onLongPress={() => onLongPress?.(v.reaction)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: getColor(v.isAddedBySelf ? 'common' : 'bg2'),
                  borderWidth: 1,
                  marginRight: layoutType === 'left' ? 4 : undefined,
                  marginLeft: layoutType === 'left' ? undefined : 4,
                  paddingRight: 8,
                  paddingLeft: 6,
                  backgroundColor: getColor('bg2'),
                  borderRadius: getBorderRadius({
                    height: 36,
                    crt:
                      releaseArea === 'china'
                        ? corner.bubble[0]!
                        : corner.bubble[2]!,
                    cr: cornerRadius,
                  }),
                  maxHeight: 28,
                }}
              >
                <Text
                  style={{
                    fontSize: Platform.OS === 'ios' ? 15 : 15,
                    fontFamily: fontFamily,
                    marginVertical: 2,
                  }}
                >
                  {r}
                </Text>
                <View style={{ width: 6 }} />
                <Text
                  paletteType={'label'}
                  textType={'medium'}
                  style={{
                    color: getColor(v.isAddedBySelf ? 'common' : 'dis'),
                  }}
                >
                  {v.count > 99 ? '+99' : v.count}
                </Text>
              </View>
            </Pressable>
          );
        } else {
          return null;
        }
      })}
      <Pressable
        style={{
          borderColor: getColor('bg2'),
          backgroundColor: getColor('bg2'),
          borderWidth: 1,
          paddingRight: 8,
          paddingLeft: 6,
          marginRight: layoutType === 'left' ? 4 : undefined,
          marginLeft: layoutType === 'left' ? undefined : 4,
          borderRadius: getBorderRadius({
            height: 36,
            crt:
              releaseArea === 'china' ? corner.bubble[0]! : corner.bubble[2]!,
            cr: cornerRadius,
          }),
          maxHeight: 24,
        }}
        key={reactions?.length ?? 99}
        onPress={() => onClicked?.('faceplus')}
      >
        <Icon
          name={'ellipsis_horizontally' as IconNameType}
          style={{
            width: 20,
            height: 20,
            marginVertical: 2,
            tintColor: getColor('plus'),
          }}
        />
      </Pressable>
    </View>
  );
}

export function MessageQuoteBubble(props: MessageQuoteBubbleProps) {
  const {
    hasAvatar,
    hasTriangle,
    model,
    containerStyle,
    maxWidth,
    onQuoteClicked,
    onClickedChecked,
  } = props;
  const checked = (model as MessageModel)?.checked;
  const { layoutType, quoteMsg, msg: originalMsg } = model;
  const { paddingHorizontal, paddingVertical } = React.useMemo(() => {
    return {
      paddingHorizontal: 12,
      paddingVertical: 8,
    };
  }, []);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getMessageBubbleBorderRadius } = useGetStyleProps();
  const { getColor } = useColors({
    left_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[6],
    },
    right_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    left_name: {
      light: colors.neutralSpecial[6],
      dark: colors.neutralSpecial[7],
    },
    right_name: {
      light: colors.neutralSpecial[6],
      dark: colors.neutralSpecial[7],
    },
    left_text: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    right_text: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const marginWidth = getPaddingWidth({
    avatarWidth: hasAvatar ? gMessageAvatarSize : 0,
    triangleWidth: hasTriangle ? gTriangleWidth : 0,
  });

  const getContent = (originalMsg: ChatMessage, quoteMsg?: ChatMessage) => {
    const user = userInfoFromMessage(quoteMsg);
    switch (quoteMsg?.body.type) {
      case ChatMessageType.TXT: {
        const body = quoteMsg?.body as ChatTextMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? quoteMsg.from}
            </SingleLineText>
            <Text
              textType={'medium'}
              paletteType={'label'}
              numberOfLines={2}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
              }}
            >
              {body.content}
            </Text>
          </View>
        );
      }
      case ChatMessageType.IMAGE: {
        const body = quoteMsg.body as ChatImageMessageBody;
        return (
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                paddingRight: 12,
                justifyContent: 'space-between',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_name' : 'right_name'
                  ),
                }}
              >
                {user?.userName ?? user?.userId ?? quoteMsg.from}
              </SingleLineText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'img'}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: getColor(
                      layoutType === 'left' ? 'left_text' : 'left_text'
                    ),
                  }}
                />
                <View style={{ width: 2 }} />
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {tr('picture')}
                </Text>
              </View>
            </View>
            <MessageDefaultImage
              url={
                body.thumbnailRemotePath
                  ? body.thumbnailRemotePath
                  : body.thumbnailLocalPath
              }
              width={36}
              height={36}
              thumbWidth={24}
              thumbHeight={24}
              iconName={'img'}
              containerStyle={{ borderWidth: 0 }}
            />
          </View>
        );
      }
      case ChatMessageType.VOICE: {
        const body = quoteMsg?.body as ChatVoiceMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
                alignSelf: layoutType === 'left' ? 'flex-start' : 'flex-end',
              }}
            >
              {user?.userName ?? user?.userId ?? quoteMsg.from}
            </SingleLineText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'3th_frame_lft_lgt_sdy'}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: getColor(
                    layoutType === 'left' ? 'left_text' : 'left_text'
                  ),
                }}
              />
              <Text
                textType={'medium'}
                paletteType={'label'}
                numberOfLines={2}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_text' : 'right_text'
                  ),
                }}
              >
                {tr('voice')}
                <Text
                  textType={'medium'}
                  paletteType={'body'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {`: ${Math.floor(body.duration)}`}
                </Text>
              </Text>
            </View>
          </View>
        );
      }
      case ChatMessageType.VIDEO: {
        const body = quoteMsg.body as ChatVideoMessageBody;
        return (
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                paddingRight: 12,
                justifyContent: 'space-between',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_name' : 'right_name'
                  ),
                }}
              >
                {user?.userName ?? user?.userId ?? quoteMsg.from}
              </SingleLineText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'triangle_in_rectangle'}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: getColor(
                      layoutType === 'left' ? 'left_text' : 'left_text'
                    ),
                  }}
                />
                <View style={{ width: 2 }} />
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {tr('video')}
                </Text>
              </View>
            </View>
            <MessageDefaultImage
              url={
                body.thumbnailRemotePath
                  ? body.thumbnailRemotePath
                  : body.thumbnailLocalPath
              }
              width={36}
              height={36}
              thumbWidth={24}
              thumbHeight={24}
              iconName={'triangle_in_rectangle'}
              containerStyle={{ borderWidth: 0 }}
            />
          </View>
        );
      }
      case ChatMessageType.FILE: {
        const body = quoteMsg?.body as ChatFileMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? quoteMsg.from}
            </SingleLineText>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon
                name={'doc'}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: getColor(
                    layoutType === 'left' ? 'left_text' : 'left_text'
                  ),
                }}
              />
              <Text
                textType={'medium'}
                paletteType={'label'}
                numberOfLines={2}
                style={{
                  width: '90%',
                  color: getColor(
                    layoutType === 'left' ? 'left_text' : 'right_text'
                  ),
                }}
              >
                {tr('file')}
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                    flexWrap: 'wrap',
                  }}
                >
                  {`: ${body.displayName}`}
                </Text>
              </Text>
            </View>
          </View>
        );
      }
      case ChatMessageType.COMBINE: {
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? quoteMsg.from}
            </SingleLineText>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon
                name={'3pm'}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: getColor(
                    layoutType === 'left' ? 'left_text' : 'left_text'
                  ),
                }}
              />
              <SingleLineText
                textType={'medium'}
                paletteType={'label'}
                numberOfLines={2}
                style={{
                  width: '90%',
                  color: getColor(
                    layoutType === 'left' ? 'left_text' : 'right_text'
                  ),
                }}
              >
                {tr('_uikit_msg_record')}
              </SingleLineText>
            </View>
          </View>
        );
      }
      case ChatMessageType.CUSTOM: {
        const body = quoteMsg?.body as ChatCustomMessageBody;
        if (body.event === gCustomMessageCardEventType) {
          const cardParams = body.params as {
            userId: string;
            nickname: string;
            avatar: string;
          };
          return (
            <View>
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_name' : 'right_name'
                  ),
                  alignSelf: layoutType === 'left' ? 'flex-start' : 'flex-end',
                }}
              >
                {user?.userName ?? user?.userId ?? quoteMsg.from}
              </SingleLineText>
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name={'person_single_fill'}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: getColor(
                      layoutType === 'left' ? 'left_text' : 'left_text'
                    ),
                  }}
                />
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {tr('card')}
                  <Text
                    textType={'medium'}
                    paletteType={'body'}
                    numberOfLines={2}
                    style={{
                      color: getColor(
                        layoutType === 'left' ? 'left_text' : 'right_text'
                      ),
                    }}
                  >
                    {`: ${cardParams.nickname ?? cardParams.userId}`}
                  </Text>
                </Text>
              </View>
            </View>
          );
        }
        return (
          <Text
            textType={'large'}
            paletteType={'body'}
            style={{
              color: getColor(
                layoutType === 'left' ? 'left_text' : 'right_text'
              ),
            }}
          >
            {tr('_uikit_msg_tip_not_support')}
          </Text>
        );
      }
      default: {
        if (originalMsg.attributes?.[gMessageAttributeQuote] && !quoteMsg) {
          return (
            <Text
              textType={'large'}
              paletteType={'body'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
              }}
            >
              {tr('_uikit_msg_tip_msg_not_exist')}
            </Text>
          );
        } else {
          return (
            <Text
              textType={'large'}
              paletteType={'body'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
              }}
            >
              {tr('_uikit_msg_tip_not_support')}
            </Text>
          );
        }
      }
    }
  };

  const _onClicked = (msg: ChatMessage, quoteMsg?: ChatMessage) => {
    if (checked !== undefined) {
      onClickedChecked?.();
    } else {
      if (onQuoteClicked) {
        const quote = msg.attributes[gMessageAttributeQuote];
        onQuoteClicked?.(quoteMsg ? quoteMsg.msgId : quote.msgID, model);
      }
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
          maxWidth: maxWidth ?? '70%',
          marginLeft: layoutType === 'left' ? marginWidth : marginWidth,
          marginBottom: 2,
        },
        containerStyle,
      ]}
    >
      <Pressable
        style={[
          styles.bubble,
          {
            backgroundColor: getColor(
              layoutType === 'left' ? 'left_bg' : 'right_bg'
            ),
            paddingHorizontal: paddingHorizontal,
            paddingVertical: paddingVertical,
          },
          getMessageBubbleBorderRadius({
            height: 0,
            layoutType: layoutType,
            hasTopNeighbor: false,
            hasBottomNeighbor: true,
            messageBubbleType: 'quote',
          }),
        ]}
        onPress={() => _onClicked(originalMsg, quoteMsg)}
      >
        {getContent(originalMsg, quoteMsg)}
      </Pressable>
    </View>
  );
}

export function MessageView(props: MessageViewProps) {
  const {
    isVisible = true,
    model,
    avatarIsVisible = true,
    nameIsVisible = true,
    timeIsVisible = true,
    onQuoteClicked,
    onAvatarClicked,
    onStateClicked,
    MessageQuoteBubble: propsMessageQuoteBubble,
    MessageBubble: propsMessageBubble,
    MessageThreadBubble: propsMessageThreadBubble,
    MessageReaction: propsMessageReaction,
    onReactionClicked,
    onThreadClicked,
    onClickedChecked,
    onReactionLongPress,
    ...others
  } = props;
  const checked = (model as MessageModel)?.checked;
  const _MessageQuoteBubble = propsMessageQuoteBubble ?? MessageQuoteBubble;
  const _MessageBubble = propsMessageBubble ?? MessageBubble;
  const _MessageThreadBubble = propsMessageThreadBubble ?? MessageThreadBubble;
  const _MessageReaction = propsMessageReaction ?? MessageReaction;
  const { layoutType, reactions, thread, isHighBackground } = model;
  const { enableThread, enableReaction, releaseArea } = useConfigContext();
  const state = getMessageState(model.msg);
  const maxWidth = Dimensions.get('window').width * 0.6;
  const time = model.msg.localTime ?? model.msg.serverTime;
  const bubblePadding = 12;
  const hasTriangle = releaseArea === 'china' ? true : false;
  const isQuote = isQuoteMessage(model.msg, model.quoteMsg);
  const isSingleChat = React.useRef(
    model.msg.chatType === ChatMessageChatType.PeerChat
  ).current;
  const userName = model.userName ?? model.userId;
  const userAvatar = model.userAvatar;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    h: {
      light: colors.neutral[95],
      dark: colors.neutral[6],
    },
  });
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      getColor('bg') as string,
      getColor('h') as string,
      getColor('bg') as string,
    ],
  });
  const onClickedAvatar = React.useCallback(() => {
    if (checked !== undefined) {
      onClickedChecked?.();
    } else {
      onAvatarClicked?.(model.msg.msgId, model);
    }
  }, [checked, model, onAvatarClicked, onClickedChecked]);

  const onClickedState = React.useCallback(() => {
    if (checked !== undefined) {
      onClickedChecked?.();
    } else {
      onStateClicked?.(model.msg.msgId, model);
    }
  }, [checked, model, onClickedChecked, onStateClicked]);

  const _onReactionClicked = React.useCallback(
    (face: string) => {
      if (checked !== undefined) {
        onClickedChecked?.();
      } else {
        onReactionClicked?.(model.msg.msgId, model, face);
      }
    },
    [checked, model, onClickedChecked, onReactionClicked]
  );
  const _onReactionLongPress = React.useCallback(
    (face: string) => {
      if (checked !== undefined) {
      } else {
        onReactionLongPress?.(model.msg.msgId, model, face);
      }
    },
    [checked, model, onReactionLongPress]
  );
  const _onThreadClicked = React.useCallback(() => {
    if (checked !== undefined) {
      onClickedChecked?.();
    } else {
      onThreadClicked?.(model.msg.msgId, model);
    }
  }, [checked, model, onClickedChecked, onThreadClicked]);

  React.useEffect(() => {
    if (isHighBackground !== undefined) {
      if (isHighBackground === true) {
        Animated.loop(
          Animated.timing(animatedValue, {
            useNativeDriver: false,
            duration: 1000,
            toValue: 1,
            easing: Easing.linear,
          })
        ).start();
      } else {
        animatedValue.stopAnimation();
      }
    }
  }, [isHighBackground, animatedValue]);

  return (
    <Animated.View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        display: isVisible === true ? 'flex' : 'none',
        backgroundColor:
          isHighBackground !== undefined ? backgroundColor : undefined,
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: layoutType === 'left' ? 'flex-start' : 'flex-end',
        }}
      >
        {nameIsVisible && isSingleChat !== true ? (
          <NameView
            layoutType={layoutType}
            name={userName}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
          />
        ) : null}
        {isQuote ? (
          <_MessageQuoteBubble
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
            onQuoteClicked={onQuoteClicked}
            maxWidth={maxWidth}
            model={model}
            onClickedChecked={onClickedChecked}
          />
        ) : null}
        <View
          style={{
            flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
            paddingHorizontal: bubblePadding,
          }}
        >
          {avatarIsVisible ? (
            <AvatarView
              layoutType={layoutType}
              avatar={userAvatar}
              onAvatarClicked={onClickedAvatar}
            />
          ) : null}
          <_MessageBubble
            model={model}
            maxWidth={maxWidth}
            hasTriangle={hasTriangle}
            onClickedChecked={onClickedChecked}
            {...others}
          />
          {state !== 'none' ? (
            <StateView
              layoutType={layoutType}
              state={state}
              onClicked={onClickedState}
            />
          ) : null}
        </View>
        {thread && enableThread === true ? (
          <_MessageThreadBubble
            layoutType={layoutType}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
            onClicked={_onThreadClicked}
            maxWidth={maxWidth}
            thread={thread}
          />
        ) : null}
        {reactions && reactions?.length > 0 && enableReaction === true ? (
          <_MessageReaction
            layoutType={layoutType}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
            onClicked={_onReactionClicked}
            onLongPress={_onReactionLongPress}
            reactions={reactions}
          />
        ) : null}
        {timeIsVisible ? (
          <TimeView
            layoutType={layoutType}
            timestamp={time}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
          />
        ) : null}
      </View>
    </Animated.View>
  );
}

export function SystemTipView(props: SystemTipViewProps) {
  const { isVisible = true, model } = props;
  const { msg } = model;
  const { onSystemTip } = useConfigContext();
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t1: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });

  const systemTip = React.useCallback(
    (msg: ChatMessage, tr: (key: string, ...args: any[]) => string) => {
      return onSystemTip?.(msg, tr) ?? getSystemTip(msg, tr);
    },
    [onSystemTip]
  );

  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text
        style={{
          flexWrap: 'wrap',
          textAlign: 'center',
          color: getColor('t1'),
        }}
      >
        {systemTip(msg, tr)}
      </Text>
    </View>
  );
}

export function TimeTipView(props: TimeTipViewProps) {
  const { isVisible = true, model } = props;
  const { timestamp } = model;
  const date = new Date(timestamp);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t1: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text
        style={{
          flexWrap: 'wrap',
          textAlign: 'center',
          color: getColor('t1'),
        }}
      >
        {date.toDateString()}
      </Text>
    </View>
  );
}

export function MessageListItem(props: MessageListItemProps) {
  const {
    id,
    model,
    MessageView: propsMessageView,
    SystemTipView: propsSystemTipView,
    TimeTipView: propsTimeTipView,
    onChecked: propsOnChecked,
    ...others
  } = props;
  const { modelType } = model;
  const _MessageView = propsMessageView ?? MessageView;
  const _SystemTipView = propsSystemTipView ?? SystemTipView;
  const _TimeTipView = propsTimeTipView ?? TimeTipView;
  const checked = (model as MessageModel)?.checked;

  const _onChecked = React.useCallback(() => {
    if (propsOnChecked) {
      propsOnChecked(id, model);
    }
  }, [id, model, propsOnChecked]);

  return (
    <View
      style={{
        paddingVertical: 8,
        flexDirection: 'column',
      }}
    >
      {modelType === 'message' ? (
        checked !== undefined ? (
          <CheckView
            layoutType={(model as MessageModel).layoutType}
            checked={checked}
            onClicked={_onChecked}
          >
            <_MessageView
              isVisible={modelType === 'message' ? true : false}
              model={model as MessageModel}
              onClickedChecked={_onChecked}
              {...others}
            />
          </CheckView>
        ) : (
          <_MessageView
            isVisible={modelType === 'message' ? true : false}
            model={model as MessageModel}
            {...others}
          />
        )
      ) : null}
      {modelType === 'system' ? (
        <_SystemTipView
          isVisible={modelType === 'system' ? true : false}
          model={model as SystemMessageModel}
        />
      ) : null}
      {modelType === 'time' ? (
        <_TimeTipView
          isVisible={modelType === 'time' ? true : false}
          model={model as TimeMessageModel}
        />
      ) : null}
      {modelType === 'history' ? (
        <MessageHistoryListItemMemo
          model={model as MessageHistoryModel}
          // containerStyle={{
          //   borderTopWidth: 0.5,
          //   borderTopColor: getColor('divider'),
          // }}
        />
      ) : null}
    </View>
  );
}

export const MessageListItemMemo = React.memo(MessageListItem);

const styles = StyleSheet.create({
  bubble: {
    overflow: 'hidden',
  },
});
