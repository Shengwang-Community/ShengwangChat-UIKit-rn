import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatMessageChatType,
  ChatMessageType,
  ContextNameMenuProps,
  ContextNameMenuRef,
  InitMenuItemsType,
  MessageView,
  MessageViewProps,
} from '../../rename.uikit';
import {
  ConversationDetail,
  ConversationDetailModelType,
  ConversationDetailRef,
  gCustomMessageCardEventType,
  GroupParticipantModel,
  MessageContent,
  MessageContentProps,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  MessageText,
  SystemMessageModel,
  TimeMessageModel,
  useChatContext,
  useI18nContext,
  useSimpleToastContext,
  uuid,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useOnce, useStackScreenRoute } from '../hooks';
import type { RootParamsName, RootScreenParamsList } from '../routes';

export function MyMessageContent(props: MessageContentProps) {
  const { msg, layoutType, isSupport, contentMaxWidth } = props;
  if (msg.body.type === ChatMessageType.TXT) {
    return (
      <MessageText
        msg={msg}
        layoutType={layoutType}
        isSupport={isSupport}
        maxWidth={contentMaxWidth}
      />
    );
  }
  return <MessageContent {...props} />;
}
// const MyMessageContentMemo = React.memo(MyMessageContent);

export function MyMessageView(props: MessageViewProps) {
  if (props.model.layoutType === 'left') {
    // todo: 如果是左边的消息，则不显示头像
    return <MessageView {...props} avatarIsVisible={false} />;
  }
  return MessageView(props);
}

export const MyMessageContextNameMenu = React.forwardRef<
  ContextNameMenuRef,
  ContextNameMenuProps
>(function (
  props: ContextNameMenuProps,
  ref?: React.ForwardedRef<ContextNameMenuRef>
) {
  const {} = props;
  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {},
        startHide: (_onFinished?: () => void) => {},
        startShowWithInit: (_initItems: InitMenuItemsType[], _?: any) => {},
        startShowWithProps: (_props: ContextNameMenuProps) => {},
        getData: () => {
          return undefined;
        },
      };
    },
    []
  );
  ref;
  return <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />;
});

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const name = route.name as RootParamsName;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const messageId = ((route.params as any)?.params as any)?.messageId;
  const selectType = ((route.params as any)?.params as any)?.selectType;
  const thread = ((route.params as any)?.params as any)?.thread;
  const firstMessage = ((route.params as any)?.params as any)?.firstMessage;
  const editedData = ((route.params as any)?.params as any)?.editedData;
  const editType = ((route.params as any)?.params as any)?.editType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const selectedContacts = ((route.params as any)?.params as any)
    ?.selectedContacts;
  const selectedMembers = ((route.params as any)?.params as any)
    ?.selectedMembers as GroupParticipantModel[] | undefined;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const im = useChatContext();
  const { start, stop } = useOnce();
  const { top, bottom } = useSafeAreaInsets();
  const convRef = React.useRef<ConversationDetailRef>({} as any);
  const comType = React.useRef<ConversationDetailModelType>(
    name === 'ConversationDetail'
      ? 'chat'
      : name === 'MessageThreadDetail'
      ? 'thread'
      : name === 'MessageHistory'
      ? 'search'
      : 'create_thread'
  ).current;
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { getSimpleToastRef } = useSimpleToastContext();
  const { tr } = useI18nContext();

  const getSelectedMembers = React.useCallback(() => {
    return selectedMembers;
  }, [selectedMembers]);

  const onClickedVideo = React.useCallback(() => {
    if (comType !== 'chat' && comType !== 'search') {
      return;
    }
    avTypeRef.current = 'video';
    if (convType === 0) {
    } else if (convType === 1) {
      start(() => {
        navi.push({
          to: 'AVSelectGroupParticipant',
          props: {
            groupId: convId,
          },
        });
      });
    }
  }, [comType, convId, convType, navi, start]);
  const onClickedVoice = React.useCallback(() => {
    if (comType !== 'chat' && comType !== 'search') {
      return;
    }
    avTypeRef.current = 'voice';
    if (convType === 0) {
    } else if (convType === 1) {
      start(() => {
        navi.push({
          to: 'AVSelectGroupParticipant',
          props: {
            groupId: convId,
          },
        });
      });
    }
  }, [comType, convId, convType, navi, start]);

  React.useEffect(() => {
    hash;
    if (from === 'MessageForwardSelector') {
      stop(() => {
        convRef.current?.changeSelectType(selectType);
      });
    } else if (from === 'AVSelectGroupParticipant') {
      if (comType !== 'chat' && comType !== 'search') {
        return;
      }
      stop(() => {});
    } else if (from === 'ShareContact') {
      if (comType !== 'chat' && comType !== 'search') {
        return;
      }
      stop(() => {
        convRef.current?.sendCardMessage({
          ...selectedContacts,
          type: 'card',
        });
      });
    } else if (from === 'EditInfo') {
      if (comType !== 'thread') {
        return;
      }
      stop(() => {
        if (editType === 'threadName') {
          im.updateThreadName({
            threadId: convId,
            name: editedData,
          });
        }
      });
    }
  }, [
    from,
    selectType,
    stop,
    comType,
    getSelectedMembers,
    selectedContacts,
    im,
    editedData,
    editType,
    hash,
    convId,
    convType,
  ]);

  return (
    <SafeAreaViewFragment>
      <ConversationDetail
        propsRef={convRef}
        type={comType}
        convId={convId}
        convType={convType}
        thread={thread}
        firstMessage={firstMessage}
        msgId={messageId}
        selectType={selectType}
        input={{
          ref: inputRef,
          props: {
            top,
            bottom,
            // onInputMention: (groupId: string) => {
            //   // todo : select group member.
            //   navi.push('SelectSingleParticipant', {
            //     params: {
            //       groupId,
            //     },
            //   });
            // },
            onClickedCardMenu: () => {
              if (comType === 'create_thread') {
                return;
              }
              start(() => {
                navi.push({
                  to: 'ShareContact',
                  props: {
                    convId,
                    convType,
                  },
                });
              });
            },
            // onInitMenu: (menu) => {
            //   return [
            //     ...menu,
            //     {
            //       name: 'test',
            //       isHigh: false,
            //       icon: 'bell',
            //       onClicked: () => {
            //         console.log('test');
            //         listRef.current?.addSendMessage({
            //           type: 'custom',
            //           msg: ChatMessage.createCustomMessage(convId, 'test', 1, {
            //             params: { test: '111' },
            //           }),
            //         });
            //       },
            //     },
            //   ];
            // },
          },
        }}
        list={{
          ref: listRef,
          props: {
            // containerStyle: { backgroundColor: 'red' },
            // backgroundImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
            // onInitMenu: (menu) => {
            //   return [
            //     ...menu,
            //     {
            //       name: 'test',
            //       isHigh: false,
            //       icon: 'bell',
            //       onClicked: () => {
            //         console.log('test');
            //         listRef.current?.addSendMessage({
            //           type: 'custom',
            //           msg: ChatMessage.createCustomMessage(convId, 'test', 1, {
            //             params: { test: '111' },
            //           }),
            //         });
            //       },
            //     },
            //   ];
            // },
            onClickedItem: (
              _id: string,
              model: SystemMessageModel | TimeMessageModel | MessageModel
            ) => {
              if (comType === 'create_thread') {
                return;
              }
              if (model.modelType !== 'message') {
                return;
              }
              const msgModel = model as MessageModel;
              if (msgModel.msg.body.type === ChatMessageType.IMAGE) {
                navi.push({
                  to: 'ImageMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
                navi.push({
                  to: 'VideoMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.FILE) {
                navi.push({
                  to: 'FileMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.CUSTOM) {
                const body = msgModel.msg.body as ChatCustomMessageBody;
                const event = body.event;
                const params = body.params;
                if (event === gCustomMessageCardEventType) {
                  const cardParams = params as {
                    userId: string;
                    nickname: string;
                    avatar: string;
                  };
                  navi.push({
                    to: 'ContactInfo',
                    props: {
                      userId: cardParams.userId,
                    },
                  });
                }
              }
            },
            onClickedItemAvatar: (_id, model) => {
              if (comType === 'create_thread') {
                return;
              }
              if (model.modelType !== 'message') {
                return;
              }
              const msgModel = model as MessageModel;
              const userId = msgModel.msg.from;

              const userType = msgModel.msg.chatType as number;
              if (userType === ChatMessageChatType.PeerChat) {
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              } else if (userType === ChatMessageChatType.GroupChat) {
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              }
            },
            // reportMessageCustomList: [{ key: '1', value: 'test' }],
            listItemRenderProps: {
              MessageContent: MyMessageContent,
              // MessageView: MyMessageView,
            },
            // messageLayoutType: 'left',
            onNoMoreMessage: React.useCallback(() => {
              console.log('onNoMoreMessage');
            }, []),
            onClickedEditThreadName: (thread) => {
              if (comType !== 'thread') {
                return;
              }
              start(() => {
                navi.push({
                  to: 'EditInfo',
                  props: {
                    backName: tr('_demo_edit_thread_name'),
                    saveName: tr('done'),
                    initialData: thread.threadName,
                    editType: 'threadName',
                    maxLength: 64,
                  },
                });
              });
            },
            onClickedOpenThreadMemberList: (thread) => {
              if (comType !== 'thread') {
                return;
              }
              navi.push({
                to: 'MessageThreadMemberList',
                props: {
                  thread,
                },
              });
            },
            onClickedLeaveThread: (threadId) => {
              if (comType !== 'thread') {
                return;
              }
              im.leaveThread({ threadId });
              navi.goBack();
            },
            onClickedDestroyThread: (threadId) => {
              if (comType !== 'thread') {
                return;
              }
              im.destroyThread({ threadId });
              navi.goBack();
            },
            onCreateThread: (params) => {
              if (comType !== 'chat' && comType !== 'search') {
                return;
              }
              navi.navigate({
                to: 'CreateThread',
                props: {
                  ...params,
                  convId: uuid(),
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onOpenThread: (params) => {
              if (comType !== 'chat' && comType !== 'search') {
                return;
              }
              navi.navigate({
                to: 'MessageThreadDetail',
                props: {
                  thread: params,
                  convId: params.threadId,
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onClickedHistoryDetail: (item) => {
              if (comType !== 'chat' && comType !== 'search') {
                return;
              }
              navi.navigate({
                to: 'MessageHistoryList',
                props: {
                  message: item.msg,
                },
              });
            },
            onCopyFinished: () => {
              getSimpleToastRef().show({
                message: tr('copy_success'),
              });
            },
          },
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedAvatar={(params: {
          convId: string;
          convType: ChatConversationType;
          ownerId?: string | undefined;
        }) => {
          if (params.convType === ChatConversationType.PeerChat) {
            navi.navigate({
              to: 'ContactInfo',
              props: { userId: params.convId },
              merge: true,
            });
          } else if (params.convType === ChatConversationType.GroupChat) {
            navi.navigate({
              to: 'GroupInfo',
              props: {
                groupId: params.convId,
                ownerId: params.ownerId,
              },
              merge: true,
            });
          }
        }}
        onClickedThread={() => {
          navi.navigate({
            to: 'MessageThreadList',
            props: { parentId: convId },
          });
        }}
        onForwardMessage={(msgs) => {
          start(() => {
            navi.push({
              to: 'MessageForwardSelector',
              props: {
                msgs,
                convId,
                convType,
              },
            });
          });
        }}
        onClickedVideo={onClickedVideo}
        onClickedVoice={onClickedVoice}
        // NavigationBar={
        //   <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />
        // }
        // enableNavigationBar={true}
        // MessageCustomLongPressMenu={MyMessageContextNameMenu}
      />
    </SafeAreaViewFragment>
  );
}
