import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import type {
  ChatMessage,
  ChatMessageReaction,
  ChatMessageThread,
} from '../../rename.chat';
import { MessageLayoutType } from '../types';
import type {
  MessageListItemActionsProps,
  MessageListItemRenders,
  MessageModel,
  MessageStateType,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

/**
 * Message Basic Component properties.
 */
export type MessageBasicProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  maxWidth?: number;
  onClicked?: () => void;
  onLongPress?: () => void;
};

/**
 * Message Text Component properties.
 */
export type MessageTextProps = MessageBasicProps & {
  isSupport: boolean;
};
/**
 * Message Text component render type.
 */
export type MessageTextRender = React.FC<MessageTextProps>;

/**
 * Message Default Image Component properties.
 */
export type MessageDefaultImageProps = {
  url?: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  iconName: IconNameType;
  onError?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};
/**
 * Message Default Image component render type.
 */
export type MessageDefaultImageRender = React.FC<MessageDefaultImageProps>;

/**
 * Message Image Component properties.
 */
export type MessageImageProps = MessageBasicProps & {};
/**
 * Message Image component render type.
 */
export type MessageImageRender = React.FC<MessageImageProps>;

/**
 * Message Voice Component properties.
 */
export type MessageVoiceProps = MessageBasicProps & {
  isPlay?: boolean;
};
/**
 * Message Voice component render type.
 */
export type MessageVoiceRender = React.FC<MessageVoiceProps>;

/**
 * Message Video Component properties.
 */
export type MessageVideoProps = MessageBasicProps & {};
/**
 * Message Video component render type.
 */
export type MessageVideoRender = React.FC<MessageVideoProps>;

/**
 * Message File Component properties.
 */
export type MessageFileProps = MessageBasicProps & {};
/**
 * Message File component render type.
 */
export type MessageFileRender = React.FC<MessageFileProps>;

/**
 * Message Location Component properties.
 */
export type MessageCustomCardProps = MessageBasicProps & {};
/**
 * Message Location component render type.
 */
export type MessageCustomCardRender = React.FC<MessageCustomCardProps>;

/**
 * Message Combine Component properties.
 */
export type MessageCombineProps = MessageBasicProps & {};
/**
 * Message Combine component render type.
 */
export type MessageCombineRender = React.FC<MessageCombineProps>;

/**
 * Message Location Component properties.
 */
export type MessageContentProps = {
  msg: ChatMessage;
  isSupport: boolean;
  layoutType: MessageLayoutType;
  contentMaxWidth?: number | undefined;
  isVoicePlaying?: boolean | undefined;
  onClicked?: (event?: GestureResponderEvent) => void;
  onLongPress?: (event?: GestureResponderEvent) => void;
};
/**
 * Message Location component render type.
 */
export type MessageContentRender = React.FC<MessageContentProps>;

/**
 * Message Bubble Component properties.
 */
export type MessageBubbleProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    hasTriangle?: boolean;
    model: MessageModel;
    containerStyle?: StyleProp<ViewStyle>;
    maxWidth?: number;
    onClickedChecked?: () => void;
  };
/**
 * Message Bubble component render type.
 */
export type MessageBubbleRender = React.FC<MessageBubbleProps>;

/**
 * Message Avatar Component properties.
 */
export type AvatarViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  avatar?: string;
  onAvatarClicked?: () => void;
};
/**
 * Message Avatar component render type.
 */
export type AvatarViewRender = React.FC<AvatarViewProps>;

/**
 * Message Name Component properties.
 */
export type NameViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  name: string;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
/**
 * Message Name component render type.
 */
export type NameViewRender = React.FC<NameViewProps>;

/**
 * Message Time Component properties.
 */
export type TimeViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  timestamp: number;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
/**
 * Message Time component render type.
 */
export type TimeViewRender = React.FC<TimeViewProps>;

/**
 * Message State Component properties.
 */
export type StateViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  state: MessageStateType;
  onClicked?: () => void;
};
/**
 * Message State component render type.
 */
export type StateViewRender = React.FC<StateViewProps>;

/**
 * Message Check Component properties.
 */
export type CheckViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  children?: React.ReactNode;
  /**
   * The item check state.
   *
   * true is checked.
   * false is uncheck.
   * undefined is hide.
   */
  checked: boolean;
  onClicked?: () => void;
};
/**
 * Message Check component render type.
 */
export type CheckViewRender = React.FC<CheckViewProps>;

/**
 * Message Quote Bubble Component properties.
 */
export type MessageQuoteBubbleProps = MessageListItemActionsProps & {
  hasAvatar: boolean;
  hasTriangle: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
  onClickedChecked?: () => void;
};
/**
 * Message Quote Bubble component render type.
 */
export type MessageQuoteBubbleRender = React.FC<MessageQuoteBubbleProps>;

/**
 * Message Quote Content Component properties.
 */
export type MessageViewProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    isVisible?: boolean;
    model: MessageModel;
    avatarIsVisible?: boolean;
    nameIsVisible?: boolean;
    timeIsVisible?: boolean;
    onClickedChecked?: () => void;
  };
/**
 * Message Quote Content component render type.
 */
export type MessageViewRender = React.FC<MessageViewProps>;

/**
 * Message System Tip Component properties.
 */
export type SystemTipViewProps = {
  isVisible?: boolean;
  model: SystemMessageModel;
};
/**
 * Message System Tip component render type.
 */
export type SystemTipViewRender = React.FC<SystemTipViewProps>;

/**
 * Message Time Tip Component properties.
 */
export type TimeTipViewProps = {
  isVisible?: boolean;
  model: TimeMessageModel;
};
/**
 * Message Time Tip component render type.
 */
export type TimeTipViewRender = React.FC<TimeTipViewProps>;

export type MessageReactionItemProps = ChatMessageReaction;

/**
 * Message Reaction Component properties.
 */
export type MessageReactionProps = {
  layoutType: MessageLayoutType;
  hasAvatar: boolean;
  hasTriangle: boolean;
  reactions?: ChatMessageReaction[];
  onClicked?: (face: string) => void;
  onLongPress?: (face: string) => void;
};

/**
 * Message Reaction component render type.
 */
export type MessageReactionRender = React.FC<MessageReactionProps>;

/**
 * Message Thread Component properties.
 */
export type MessageThreadBubbleProps = {
  layoutType: MessageLayoutType;
  hasAvatar: boolean;
  hasTriangle: boolean;
  thread?: ChatMessageThread;
  maxWidth?: number;
  onClicked?: (threadId: string) => void;
};
/**
 * Message Thread component render type.
 */
export type MessageThreadRender = React.FC<MessageThreadBubbleProps>;
