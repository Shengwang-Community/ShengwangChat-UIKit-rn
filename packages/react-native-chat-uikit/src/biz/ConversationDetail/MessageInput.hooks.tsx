import * as React from 'react';
import type { TextInputKeyPressEventData } from 'react-native';
import {
  Keyboard,
  LayoutAnimation,
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import emoji from 'twemoji';

import type { IconNameType } from '../../assets';
import { useConfigContext } from '../../config';
import { uilog } from '../../const';
import {
  useDelayExecTask,
  useForceUpdate,
  useKeyboardHeight,
} from '../../hook';
import type { ChatTextMessageBody } from '../../rename.chat';
import type { AlertRef } from '../../ui/Alert';
import { timeoutTask } from '../../utils';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { FACE_ASSETS_UTF16 } from '../EmojiList';
import { useMessageInputExtendActions } from '../hooks/useMessageInputExtendActions';
import {
  selectCamera,
  selectFile,
  selectOnePicture,
  selectOneShortVideo,
} from '../hooks/useSelectFile';
import {
  MESSAGE_INPUT_BAR_EXTENSION_NAME_MENU_HEIGHT,
  MessageInputBarExtensionNameMenu,
} from '../MessageInputBarExtension';
import type { ContextNameMenuRef } from '../types';
import type { EmojiIconItem } from '../types';
import type { BottomVoiceBarRef, VoiceBarState } from '../VoiceBar';
import type { MessageInputEditMessageRef } from './MessageInputEditMessage';
import { useMessagePin } from './MessagePin.hooks';
import type {
  MessageInputProps,
  MessageInputRef,
  MessageInputState,
  MessageModel,
  SendFileProps,
  SendImageProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';

export function useMessageInput(
  props: MessageInputProps,
  ref?: React.ForwardedRef<MessageInputRef>
) {
  const {
    bottom,
    onClickedSend: propsOnClickedSend,
    closeAfterSend,
    onHeightChange,
    convId,
    onEditMessageFinished: propsOnEditMessageFinished,
    // onInputMention: propsOnInputMention,
    onClickedCardMenu: propsOnClickedCardMenu,
    onInitMenu,
    emojiList,
    selectType = 'common',
    onClickedMultiSelectDeleteButton,
    onClickedMultiSelectShareButton,
    multiSelectCount,
    onChangeValue: propsOnChangeValue,
  } = props;
  const { keyboardHeight, keyboardCurrentHeight } = useKeyboardHeight();
  const inputRef = React.useRef<RNTextInput>({} as any);
  const [_value, _setValue] = React.useState('');
  const [emojiHeight, _setEmojiHeight] = React.useState(0);
  const isClosedEmoji = React.useRef(true);
  const isClosedExtension = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const isClosedVoiceBar = React.useRef(true);
  const [emojiIconName, setEmojiIconName] =
    React.useState<IconNameType>('face');
  const [sendIconName, setSendIconName] =
    React.useState<IconNameType>('plus_in_circle');
  const valueRef = React.useRef('');
  const rawValue = React.useRef('');
  /// !!! tell me why? inputBarState
  const [inputBarState, setInputBarState] =
    React.useState<MessageInputState>('normal');
  const { messageInputBarStyle } = useConfigContext();
  const MessageInputBarMenu = React.useMemo(() => {
    if (messageInputBarStyle === 'bottom-sheet') {
      return BottomSheetNameMenu;
    } else if (messageInputBarStyle === 'extension') {
      return MessageInputBarExtensionNameMenu;
    } else {
      return null;
    }
  }, [messageInputBarStyle]);
  const inputBarStateRef = React.useRef<MessageInputState>('normal');
  const hasLayoutAnimation = React.useRef(false);
  const voiceBarRef = React.useRef<BottomVoiceBarRef>({} as any);
  const voiceBarStateRef = React.useRef<VoiceBarState>('idle');
  const menuRef = React.useRef<ContextNameMenuRef>(null);
  const extensionHeightRef = React.useRef<number>(
    MESSAGE_INPUT_BAR_EXTENSION_NAME_MENU_HEIGHT
  );
  const quoteMessageRef = React.useRef<MessageModel | undefined>(undefined);
  const [showQuote, setShowQuote] = React.useState(false);
  const editRef = React.useRef<MessageInputEditMessageRef>({} as any);
  const msgModelRef = React.useRef<MessageModel>();
  const mentionListRef = React.useRef<{ id: string; name: string }[]>([]);
  const alertRef = React.useRef<AlertRef>(null);
  const emojiListRef = React.useRef<EmojiIconItem[] | undefined>(
    emojiList?.map((v) => {
      return { name: v, state: 'common' } as EmojiIconItem;
    })
  );
  const [multiSelectVisible, setMultiSelectVisible] = React.useState(false);
  const msgPinHeightRef = React.useRef(0);
  const { msgPinBackgroundCurrentOpacity, msgPinBackgroundOpacityAnimate } =
    useMessagePin({});
  const { updater } = useForceUpdate();

  const onSetInputBarState = (state: MessageInputState) => {
    inputBarStateRef.current = state;
    setInputBarState(state);
  };

  const _onValue = (v: string) => {
    if (
      v.length > 0 &&
      (inputBarStateRef.current === 'keyboard' ||
        inputBarStateRef.current === 'emoji')
    ) {
      setSendIconName('airplane');
    } else {
      setSendIconName('plus_in_circle');
    }
    _setValue(v);
    propsOnChangeValue?.(v);
  };

  const changeInputBarState = (nextState: MessageInputState) => {
    if (nextState === 'normal') {
      isClosedEmoji.current = true;
      isClosedExtension.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      onSetInputBarState('normal');
      setEmojiIconName('face');
      setSendIconName('plus_in_circle');
      closeExtension();
      closeEmojiList();
      closeVoiceBar();
      closeKeyboard();
      hideMultiSelectBar();
    } else if (nextState === 'emoji') {
      isClosedEmoji.current = false;
      isClosedExtension.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      onSetInputBarState('emoji');
      setEmojiIconName('keyboard2');
      closeKeyboard();
      closeVoiceBar();
      closeExtension();
      showEmojiList();
      hideMultiSelectBar();
    } else if (nextState === 'extension') {
      isClosedEmoji.current = true;
      isClosedExtension.current = false;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      onSetInputBarState('extension');
      setEmojiIconName('face');
      setSendIconName('xmark_in_circle');
      closeKeyboard();
      closeVoiceBar();
      closeEmojiList();
      hideMultiSelectBar();
    } else if (nextState === 'voice') {
      isClosedEmoji.current = true;
      isClosedExtension.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = false;
      onSetInputBarState('voice');
      setEmojiIconName('face');
      closeKeyboard();
      closeEmojiList();
      closeExtension();
      showVoiceBar();
      hideMultiSelectBar();
    } else if (nextState === 'multi-select') {
      isClosedEmoji.current = true;
      isClosedExtension.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      onSetInputBarState('multi-select');
      setEmojiIconName('face');
      closeKeyboard();
      closeEmojiList();
      closeExtension();
      onCloseVoiceBar();
      showMultiSelectBar();
    } else if (nextState === 'keyboard') {
      isClosedKeyboard.current = false;
      onSetInputBarState('keyboard');
      if (valueRef.current.length === 0) {
        setSendIconName('plus_in_circle');
      }
      setEmojiIconName('face');
      if (Platform.OS !== 'ios') {
        isClosedEmoji.current = true;
        isClosedExtension.current = true;
        isClosedVoiceBar.current = true;
        closeEmojiList();
        closeExtension();
        closeVoiceBar();
        hideMultiSelectBar();
      }
    }
  };

  const onFocus = () => {
    changeInputBarState('keyboard');
  };
  const onBlur = () => {
    setLayoutAnimation();

    if (isClosedEmoji.current === true) {
      setEmojiIconName('face');
      closeEmojiList();
    } else {
      setEmojiIconName('keyboard2');
      showEmojiList();
    }
    if (isClosedExtension.current === true) {
      closeExtension();
    }
    if (isClosedVoiceBar.current === true) {
      closeVoiceBar();
    }
  };

  const setInputValue = (
    text: string,
    op?: 'add_face' | 'del_face' | 'del_c',
    face?: string
  ) => {
    if (op) {
      if (op === 'add_face') {
        rawValue.current += face;
        valueRef.current =
          valueRef.current + emoji.convert.fromCodePoint(face!.substring(2));
        _onValue(valueRef.current);
      } else if (op === 'del_face') {
        const rawFace = emoji.convert.toCodePoint(face!);
        rawValue.current = rawValue.current.substring(
          0,
          rawValue.current.length - rawFace.length - 2
        );
        valueRef.current = valueRef.current.substring(
          0,
          valueRef.current.length - 2
        );
        _onValue(valueRef.current);
      } else if (op === 'del_c') {
        rawValue.current = rawValue.current.substring(
          0,
          rawValue.current.length - 1
        );
        valueRef.current = valueRef.current.substring(
          0,
          valueRef.current.length - 1
        );
        _onValue(valueRef.current);
      }
    } else {
      if (valueRef.current !== text) {
        if (valueRef.current.length > text.length) {
          // const tmp = findLastMention(valueRef.current);
          // if (tmp) {
          //   text = tmp;
          // }
          rawValue.current = rawValue.current.substring(
            0,
            rawValue.current.length - (valueRef.current.length - text.length)
          );
        } else {
          // if (convType === ChatConversationType.GroupChat) {
          //   if (text.length > 0 && text[text.length - 1] === '@') {
          //     propsOnInputMention?.(convId);
          //   }
          // }
          rawValue.current += text.substring(valueRef.current.length);
        }
      }
      if (text.length === 0) {
        clearMentionList();
      }
      valueRef.current = text;
      _onValue(valueRef.current);
    }
  };

  const onClickedFaceListItem = (face: string) => {
    setInputValue(valueRef.current, 'add_face', face);
  };

  const onClickedDelButton = () => {
    if (valueRef.current.length >= 2) {
      const face = valueRef.current.substring(valueRef.current.length - 2);
      let lastIsFace = false;
      FACE_ASSETS_UTF16.forEach((v) => {
        if (face === v) {
          lastIsFace = true;
          setInputValue(valueRef.current, 'del_face', face);
        }
      });
      if (lastIsFace === false) {
        setInputValue(valueRef.current, 'del_c');
      }
    } else if (valueRef.current.length > 0) {
      setInputValue(valueRef.current, 'del_c');
    }
  };
  const onClickedClearButton = () => {
    // !!! https://github.com/facebook/react-native/issues/37979
    // !!! https://github.com/facebook/react-native/commit/a804c0f22b4b11b3d9632dc59a6da14f6c4325e3
    valueRef.current = '';
    rawValue.current = '';
    // inputRef.current?.clear();
    setInputValue(valueRef.current);
    clearMentionList();
    // _onValue(valueRef.current);
  };

  const onClickedEmojiButton = () => {
    if (emojiIconName === 'face') {
      changeInputBarState('emoji');
    } else {
      isClosedKeyboard.current = false;
      inputRef.current?.focus();
    }
  };

  const onClickedVoiceButton = () => {
    changeInputBarState('voice');
  };

  const { delayExecTask: resetLayoutAnimation } = useDelayExecTask(
    175,
    React.useCallback(() => {
      if (hasLayoutAnimation.current === true) {
        hasLayoutAnimation.current = false;
      }
    }, [])
  );

  const setLayoutAnimation = React.useCallback(() => {
    if (hasLayoutAnimation.current === false) {
      hasLayoutAnimation.current = true;
      LayoutAnimation.configureNext({
        duration: 250, // from keyboard event
        update: {
          duration: 250,
          type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
        },
      });
    }
    resetLayoutAnimation();
  }, [resetLayoutAnimation]);

  const setEmojiHeight = React.useCallback(
    (h: number) => {
      setLayoutAnimation();
      _setEmojiHeight(h);
    },
    [setLayoutAnimation]
  );

  const closeExtension = React.useCallback(() => {
    if (messageInputBarStyle === 'extension') {
      menuRef.current?.startHide?.();
    }
  }, [messageInputBarStyle]);

  const closeKeyboard = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);
  const closeEmojiList = React.useCallback(() => {
    if (isClosedExtension.current === false) {
      setEmojiHeight(extensionHeightRef.current);
    } else {
      setEmojiHeight(0);
    }
  }, [setEmojiHeight]);
  const closeVoiceBar = React.useCallback(() => {
    // setVoiceHeight(0);
    voiceBarRef.current?.startHide?.();
  }, []);

  const showEmojiList = React.useCallback(() => {
    if (isClosedExtension.current === false) {
      setEmojiHeight(extensionHeightRef.current);
    } else {
      const tmp = keyboardHeight === 0 ? 300 : keyboardHeight;
      setEmojiHeight(tmp - (bottom ?? 0));
    }
  }, [bottom, keyboardHeight, setEmojiHeight]);

  const showVoiceBar = React.useCallback(() => {
    // setVoiceHeight(gVoiceBarHeight + (bottom ?? 0));
    voiceBarRef.current?.startShow?.();
  }, []);

  const showMultiSelectBar = React.useCallback(() => {
    setMultiSelectVisible(true);
  }, []);

  const hideMultiSelectBar = React.useCallback(() => {
    setMultiSelectVisible(false);
  }, []);

  const onCloseVoiceBar = () => {
    if (voiceBarStateRef.current === 'recording') {
      return;
    }
    voiceBarRef.current?.startHide?.();
  };

  const onVoiceStateChange = (state: VoiceBarState) => {
    voiceBarStateRef.current = state;
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onClickedEmojiSend = React.useCallback(() => {
    // !!! warning: valueRef.current is not the latest value
    const content = valueRef.current;
    propsOnClickedSend?.({
      type: 'text',
      content: content,
    });
    onClickedClearButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickedSend = () => {
    if (sendIconName === 'airplane') {
      const content = valueRef.current;
      if (quoteMessageRef.current !== undefined) {
        // !!! only support text message for quote
        propsOnClickedSend?.({
          type: 'text',
          content: content,
          quote: quoteMessageRef.current,
        });
        onHideQuoteMessage();
      } else {
        propsOnClickedSend?.({
          type: 'text',
          content: content,
        });
      }

      onClickedClearButton();

      if (closeAfterSend === true) {
        timeoutTask(0, closeKeyboard);
      }
    } else {
      onShowMessageInputExtendActions();
      if (messageInputBarStyle === 'extension') {
        changeInputBarState('extension');
      }
    }
  };

  const onSelectSendImage = (props: SendImageProps) => {
    setTimeout(() => {
      propsOnClickedSend?.(props);
    }, 250);
  };
  const onSelectSendVoice = (props: SendVoiceProps) => {
    changeInputBarState('normal');
    setTimeout(() => {
      propsOnClickedSend?.(props);
    }, 250);
  };
  const onSelectSendVideo = (props: SendVideoProps) => {
    setTimeout(() => {
      propsOnClickedSend?.(props);
    }, 250);
  };
  const onSelectSendFile = (props: SendFileProps) => {
    setTimeout(() => {
      propsOnClickedSend?.(props);
    }, 250);
  };
  const onSelectSendCard = () => {
    setTimeout(() => {
      propsOnClickedCardMenu?.();
    }, 250);
  };

  const onBeforeShowMessageInputExtendActions = () => {
    changeInputBarState('normal');
  };

  const { onShowMessageInputExtendActions, setMessageInputExtendCallback } =
    useMessageInputExtendActions({
      menuRef,
      convId,
      alertRef,
      onSelectOnePicture: selectOnePicture,
      onSelectOnePictureFromCamera: selectCamera,
      onSelectFile: selectFile,
      onSelectOneShortVideo: selectOneShortVideo,
      onSelectSendCard,
      onSelectFileResult: onSelectSendFile,
      onSelectOnePictureResult: onSelectSendImage,
      onSelectOneShortVideoResult: onSelectSendVideo,
      onInit: onInitMenu,
      onBeforeCall: onBeforeShowMessageInputExtendActions,
    });

  const onVoiceFailed = React.useCallback(
    (error: { reason: string; error: any }) => {
      let e = error;
      try {
        e.error = JSON.stringify(error);
      } catch {}
      uilog.warn('dev:voice:failed:', e);
    },
    []
  );

  const onShowQuoteMessage = React.useCallback((model: MessageModel) => {
    quoteMessageRef.current = model;
    isClosedKeyboard.current = false;
    inputRef.current?.focus();
    setShowQuote(true);
  }, []);
  const onHideQuoteMessage = React.useCallback(() => {
    quoteMessageRef.current = undefined;
    setShowQuote(false);
  }, []);

  const onRequestCloseEdit = React.useCallback(() => {
    editRef.current?.startHide?.();
  }, []);

  const onShowEditMessage = React.useCallback((model: MessageModel) => {
    msgModelRef.current = model;
    editRef.current?.startShowWithInit?.(model.msg);
  }, []);

  const onEditMessageFinished = React.useCallback(
    (msgId: string, text: string) => {
      editRef.current?.startHide?.(() => {
        if (msgModelRef.current?.msg.msgId === msgId) {
          const body = msgModelRef.current.msg.body as ChatTextMessageBody;
          body.content = text;
          propsOnEditMessageFinished?.(msgModelRef.current);
        }
      });
    },
    [propsOnEditMessageFinished]
  );

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      // timeoutTask(100, onClickedSend);
    }
  };

  React.useEffect(() => {
    if (
      (keyboardCurrentHeight > 0 && emojiHeight === 0) ||
      (emojiHeight > 0 && keyboardCurrentHeight === 0) ||
      (emojiHeight === 0 && keyboardCurrentHeight === 0)
    ) {
      // !!! height is pseudo.
      onHeightChange?.(
        emojiHeight === 0 && keyboardCurrentHeight === 0 ? 0 : 1
      );
    }
  }, [keyboardCurrentHeight, emojiHeight, onHeightChange]);

  React.useEffect(() => {
    setMessageInputExtendCallback((height) => {
      extensionHeightRef.current = height;
    });
  }, [setMessageInputExtendCallback]);

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        if (selectType === 'common') {
          changeInputBarState('normal');
        }
      },
      quoteMessage: (model) => {
        onShowQuoteMessage(model);
      },
      editMessage: (model) => {
        onShowEditMessage(model);
      },
      // mentionSelected: (list: { id: string; name: string }[]) => {
      //   mentionListRef.current.push(...list);
      //   // !!! only support one mention
      //   const text = valueRef.current;
      //   const index = text.lastIndexOf('@');
      //   if (index !== -1) {
      //     const pre = text.substring(0, index);
      //     const post = text.substring(index + 1);
      //     const mention = list[0];
      //     const mentionText = `@${mention!.name} `;
      //     const newText = `${pre}${mentionText}${post}`;
      //     setInputValue(newText);
      //   }
      // },
      showMultiSelect: () => {
        changeInputBarState('multi-select');
      },
      hideMultiSelect: () => {
        changeInputBarState('normal');
      },
      showMask: () => {
        msgPinHeightRef.current = 0;
        msgPinBackgroundOpacityAnimate(0);
        updater();
      },
      hideMask: () => {
        msgPinHeightRef.current = 1;
        msgPinBackgroundOpacityAnimate(1);
        updater();
      },
    };
  });

  // const deleteLastMentionFromList = React.useCallback((name: string) => {
  //   const index = mentionListRef.current
  //     .reverse()
  //     .findIndex((v) => v.name === name);
  //   if (index !== -1) {
  //     mentionListRef.current.splice(index, 1);
  //   }
  // }, []);

  // const findLastMention = React.useCallback(
  //   (text: string) => {
  //     if (mentionListRef.current.length > 0) {
  //       const last = mentionListRef.current[mentionListRef.current.length - 1];
  //       if (last) {
  //         // const index = text.lastIndexOf(`@${last.name} `);
  //         const key = `@${last.name}`;
  //         const index = text.lastIndexOf(key);
  //         if (index !== -1) {
  //           const start = index;
  //           const end = index + last.name.length + 1;
  //           if (end + 1 === text.length) {
  //             deleteLastMentionFromList(last.name);
  //             return text.replace(text.substring(start, end), '');
  //           }
  //         }
  //       }
  //     }
  //     return undefined;
  //   },
  //   [deleteLastMentionFromList]
  // );

  const clearMentionList = React.useCallback(() => {
    if (mentionListRef.current.length > 0) {
      mentionListRef.current = [];
    }
  }, []);

  const _onClickedMultiSelectDeleteButton = React.useCallback(() => {
    if (multiSelectCount !== undefined && multiSelectCount > 0) {
      onClickedMultiSelectDeleteButton?.();
    }
  }, [multiSelectCount, onClickedMultiSelectDeleteButton]);
  const _onClickedMultiSelectShareButton = React.useCallback(() => {
    if (multiSelectCount !== undefined && multiSelectCount > 0) {
      onClickedMultiSelectShareButton?.();
    }
  }, [multiSelectCount, onClickedMultiSelectShareButton]);

  return {
    value: _value,
    setValue: setInputValue,
    onClickedFaceListItem,
    onClickedDelButton,
    onClickedClearButton,
    onClickedEmojiButton,
    onClickedVoiceButton,
    inputRef,
    emojiHeight,
    emojiIconName,
    onFocus,
    onBlur,
    inputBarState,
    changeInputBarState,
    voiceBarRef,
    onCloseVoiceBar,
    onVoiceStateChange,
    onSelectSendVoice,
    onRequestCloseMenu,
    menuRef,
    sendIconName,
    onClickedSend,
    onVoiceFailed,
    showQuote,
    onHideQuoteMessage,
    onRequestCloseEdit,
    editRef,
    onEditMessageFinished,
    quoteMsg: quoteMessageRef.current?.msg,
    onClickedEmojiSend,
    emojiList: emojiListRef.current,
    multiSelectVisible,
    onClickedMultiSelectDeleteButton: _onClickedMultiSelectDeleteButton,
    onClickedMultiSelectShareButton: _onClickedMultiSelectShareButton,
    onKeyPress,
    msgPinBackgroundCurrentOpacity,
    msgPinHeightRef,
    MessageInputBarMenu,
    messageInputBarStyle,
  };
}
