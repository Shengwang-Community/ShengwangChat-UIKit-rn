import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import {
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
  ImageMessagePreview,
  Services,
  useChatContext,
  useI18nContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useSaveFileToAlbum, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ImageMessagePreviewScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { saveToAlbum2 } = useSaveFileToAlbum();
  const im = useChatContext();
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  const msg = ((route.params as any)?.params as any)?.msg as
    | ChatMessage
    | undefined;

  const getLocalPath = React.useCallback(async () => {
    let ret: string | undefined;
    if (msg) {
      if (msg.body.type === ChatMessageType.IMAGE) {
        ret = (msg.body as ChatImageMessageBody).localPath;
      }
    } else if (msgId) {
      const msg = await im.getMessage(msgId);
      if (msg && msg.body.type === ChatMessageType.IMAGE) {
        ret = (msg.body as ChatImageMessageBody).localPath;
      }
    }
    if (ret) {
      const isExisted = await Services.dcs.isExistedFile(ret);
      if (isExisted) {
        return ret;
      } else {
        ret = undefined;
      }
    }
    return ret;
  }, [im, msg, msgId]);
  return (
    <SafeAreaViewFragment>
      <ImageMessagePreview
        msgId={msgId}
        msg={msg}
        localMsgId={localMsgId}
        onBack={() => {
          navi.goBack();
        }}
        onShowBottomSheet={(menuRef) => {
          menuRef.current?.startShowWithInit([
            {
              name: tr('save'),
              isHigh: false,
              onClicked: async () => {
                const path = await getLocalPath();
                if (path) {
                  await saveToAlbum2(path);
                  im.sendFinished({ event: 'imageSaved' });
                }
                menuRef.current?.startHide();
              },
            },
          ]);
        }}
      />
    </SafeAreaViewFragment>
  );
}
