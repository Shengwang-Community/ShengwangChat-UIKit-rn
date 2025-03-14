import type * as React from 'react';
import type {
  DefaultSectionT,
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import type { IconNameType } from '../assets';
import type { DataModelType } from '../chat';
import type { UIKitError } from '../error';
import type { MessageContextMenuStyle } from '../types';
import type { AlertRef } from '../ui/Alert';
import { ComponentArea } from '../ui/ContextMenu';
import type { FlatListProps, FlatListRef } from '../ui/FlatList';
import { SlideModalRef } from '../ui/Modal';
import type { SectionListProps, SectionListRef } from '../ui/SectionList';

export type MessageLayoutType = 'left' | 'right' | 'middle';
export type MessageBubbleType = 'content' | 'quote' | 'thread';

export type StatusType =
  | 'online'
  | 'offline'
  | 'busy'
  | 'leave'
  | 'no-disturb'
  | string;

export type PropsWithTest = { testMode?: 'only-ui' | undefined };
export type PropsWithError = { onError?: (error: UIKitError) => void };
export type PropsWithChildren = React.PropsWithChildren<{}>;
export type PropsWithInit<DataT = any> = {
  /**
   * This callback will be called during initialization or reloading.
   */
  onInitialized?: (data?: DataT) => void;
};
/**
 * Common properties.
 */
export type PropsWithBack<DataT = any> = {
  /**
   * Callback notification when the back button is clicked. Routing processing is usually required.
   */
  onBack?: (data?: DataT) => void;
};
/**
 * Common properties.
 */
export type PropsWithCancel<DataT = any> = {
  /**
   * Callback notification when the cancel button is clicked. Routing processing is usually required.
   */
  onCancel?: (data?: DataT) => void;
};
/**
 * Common properties.
 */
export type PropsWithSearch<DataT = any> = {
  /**
   * Checks whether the search style component is visible.
   */
  searchStyleVisible?: boolean;
  /**
   * Custom search style component.
   */
  customSearch?: React.ReactElement;
  /**
   * Callback notification when the search button is clicked.
   */
  onClickedSearch?: (data?: DataT) => void;
};
/**
 * Common properties.
 */
export type PropsWithNavigationBar = {
  /**
   * Whether to display the navigation bar.
   */
  navigationBarVisible?: boolean;
  /**
   * Custom navigation bar.
   */
  customNavigationBar?: React.ReactElement;
};
/**
 * Common properties.
 */
export type PropsWithFlatList<ListItemProps> = {
  /**
   * Properties of the list component. Currently, direct setting of ref, data, renderItem is not supported.
   */
  flatListProps?: Omit<
    FlatListProps<ListItemProps>,
    'ref' | 'data' | 'renderItem'
  >;
};
/**
 * Common properties.
 */
export type PropsWithSectionList<
  ListItemProps,
  SectionT extends DefaultSectionT = DefaultSectionT
> = {
  /**
   * Properties of the list component. Currently, direct setting of ref, data, renderItem is not supported.
   */
  sectionListProps?: Omit<
    SectionListProps<ListItemProps, SectionT>,
    'ref' | 'data' | 'renderItem'
  >;
};
/**
 * Common properties.
 */
export type PropsWithMenu = {
  /**
   * Custom menu items. Supports replacing and appending menu items.
   * @param initItems Default menu item list.
   * @returns New menu item list.
   */
  onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};

export type PropsWithRef<Ref> = {
  propsRef?: React.RefObject<Ref>;
};

/**
 * The type of contact component. Contact components can be used in multiple scenarios. For example: contact list, create new conversation, create group, add group members, share contact card, etc.
 */
export type ContactType =
  | 'contact-list'
  | 'new-conversation'
  | 'create-group'
  | 'add-group-member'
  | 'share-contact'
  | 'forward-message';

/**
 * Group member list component. This component can be used in multiple scenarios. For example: group member list, deleting group members, changing group owner, etc.
 */
export type GroupParticipantType =
  | 'common'
  | 'delete'
  | 'change-owner'
  | 'mention'
  | 'av-meeting';

/**
 * Search type. The search list component can be used in multiple scenarios. For example: conversation list search, contact list search, new conversation list search, create group list search, add group member list search, shared contact list search, etc.
 */
export type SearchType =
  | 'conv-list'
  | 'contact-list'
  | 'new-conversation'
  | 'create-group'
  | 'add-group-member'
  | 'share-contact'
  | 'group-list'
  | 'group-member-list'
  | 'request-list'
  | 'forward-message'
  | 'block-list';

/**
 * List item type. Mainly include: conversation list, contact list, group list, group member list.
 */
export type ListItemType =
  | 'conv-list'
  | 'contact-list'
  | 'group-list'
  | 'group-member-list';

/**
 * Choose a type. Includes single choice and multiple choice.
 */
export type ChoiceType = 'single' | 'multiple';

/**
 * ID.
 */
export type ListItemProps = {
  id: string;
};

/**
 * List item request properties.
 *
 * @resevered
 */
export type ListItemRequestProps<DataT> = {
  /**
   * Single request, supports asynchronous. If you need to get it over the network instead of locally, it is recommended to use `` to complete the provided data.
   * @params params -
   * - id: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestData?: (params: {
    id: string;
    result: (data?: DataT, error?: UIKitError) => void;
  }) => void | Promise<void>;
};

/**
 * List request properties.
 *
 * The name and avatar of the list item component need to be provided by the user. If provided, the callback notification needs to be registered. The component will obtain the data when loading the data.
 */
export type ListRequestProps<DataT> = {
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestData?: (params: {
    ids: string[];
    result: (data?: DataT[], error?: UIKitError) => void;
  }) => void | Promise<void>;
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - groupId: The id of the group.
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestGroupData?: (params: {
    groupId: string;
    ids: string[];
    result: (data?: DataT[], error?: UIKitError) => void;
  }) => void | Promise<void>;
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestMultiData?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
  }) => void | Promise<void>;
};

/**
 * List state type.
 */
export type ListStateType = 'loading' | 'empty' | 'error' | 'normal';

/**
 * List basic hooks properties.
 */
export type UseListBasicReturn<ItemT> = {
  /**
   * @description The type of list.
   */
  listType: 'FlatList' | 'SectionList';
  /**
   * @description The state of the list.
   */
  listState?: ListStateType;
  /**
   * Refresh callback.
   */
  onRefresh?: () => void;
  /**
   * Load more callback.
   */
  onMore?: () => void;
  /**
   * There are no more callback notifications.
   */
  onNoMore?: () => void;
  /**
   * Whether to load.
   */
  isAutoLoad?: boolean;
  /**
   * Whether to load all.
   */
  isLoadAll?: boolean;
  /**
   * Whether to display after loading.
   */
  isShowAfterLoaded?: boolean;
  /**
   * Load data once or multiple times.
   */
  loadType?: 'once' | 'multiple';
  /**
   * Whether to update when the list is visible.
   */
  isVisibleUpdate?: boolean;
  /**
   * Whether to update automatically.
   */
  isAutoUpdate?: boolean;
  /**
   * Whether to update when the event occurs.
   */
  isEventUpdate?: boolean;
  /**
   * Whether to sort.
   */
  isSort?: boolean;
  /**
   * Sorting strategy callback.
   */
  onSort?: (prevProps: ItemT, nextProps: ItemT) => number;
  /**
   * Whether it is refreshing.
   */
  refreshing?: boolean;
  /**
   * Visibility configuration.
   */
  viewabilityConfig?: ViewabilityConfig;
  /**
   * Visible item callback notification.
   */
  onViewableItemsChanged?: (info: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => void;
  /**
   * Delayed search callback notification.
   */
  deferSearch?: (key: string) => void;
};

/**
 * Flat list hooks properties.
 */
export type UseFlatListReturn<ItemT> = UseListBasicReturn<ItemT> & {
  /**
   * @description The data source of the list.
   */
  data: ReadonlyArray<ItemT>;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<FlatListRef<ItemT>>;
};

/**
 * Section list hooks properties.
 */
export type UseSectionListReturn<
  ItemT,
  SectionT extends DefaultSectionT,
  ListIndexPropsT extends DefaultListIndexPropsT
> = UseListBasicReturn<ItemT> & {
  /**
   * @description The data source of the list.
   */
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
  /**
   * @description The index titles of the list.
   */
  indexTitles: ReadonlyArray<string>;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * The list item header component.
   */
  ListItemHeader?: React.ComponentType<SectionListData<ItemT, SectionT>>;
  /**
   * The list index component.
   */
  AlphabeticIndex?: React.ComponentType<ListIndexPropsT>;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<SectionListRef<ItemT, SectionT>>;
  /**
   * @description The callback function when the index is selected.
   */
  onIndexSelected?: (index: number) => void;
};

/**
 * List item actions properties.
 */
export type ListItemActions<DataT> = {
  /**
   * Callback notification when a list item is clicked. If the return result is true, execution continues, otherwise it terminates.
   */
  onClicked?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is long pressed. If the return result is true, execution continues, otherwise it terminates.
   */
  onLongPressed?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is swiped to the left. If the return result is true, execution continues, otherwise it terminates.
   */
  onToRightSlide?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is swiped to the right. If the return result is true, execution continues, otherwise it terminates.
   */
  onToLeftSlide?: ((data?: DataT) => void) | undefined;
};

/**
 * List actions properties.
 */
export type ListActions<DataT> = {
  /**
   * Callback notification when a list item is clicked. If the return result is true, execution continues, otherwise it terminates.
   *
   * If the return result is false, the default behavior is prevented.
   */
  onClickedItem?: ((data?: DataT) => boolean | void) | undefined;
  /**
   * Callback notification when a list item is long pressed. If the return result is true, execution continues, otherwise it terminates.
   *
   * If the return result is false, the default behavior is prevented.
   */
  onLongPressedItem?: ((data?: DataT) => boolean | void) | undefined;
  /**
   * Callback notification when a list item is swiped to the left. If the return result is true, execution continues, otherwise it terminates.
   *
   * If the return result is false, the default behavior is prevented.
   */
  onToRightSlideItem?: ((data?: DataT) => boolean | void) | undefined;
  /**
   * Callback notification when a list item is swiped to the right. If the return result is true, execution continues, otherwise it terminates.
   *
   * If the return result is false, the default behavior is prevented.
   */
  onToLeftSlideItem?: ((data?: DataT) => boolean | void) | undefined;
};

/**
 * List index properties.
 */
export type DefaultListIndexPropsT = {
  /**
   * Header of alphabetical list. For example: A, B, C, etc.
   */
  indexTitles: ReadonlyArray<string>;
  /**
   * Callback notification when the index is selected.
   */
  onIndexSelected?: (index: number) => void;
};

/**
 * List component reference.
 */
export type BasicListRefType<DataModel> = {
  /**
   * get data model list.
   */
  getList: () => DataModel[];
  /**
   * add data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   *
   * ** To create a new data, you need to send the data through the contact details page, group details page, group member details page, or create a new data through the data extension menu. No direct support is provided here. **
   */
  addItem: (items: DataModel) => void;
  /**
   * remove data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   *
   * You can also delete a data by long-pressing the data list item to pop up the menu.
   */
  deleteItem: (items: DataModel) => void;
  /**
   * update data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  updateItem: (items: DataModel) => void;
  /**
   * clear data model list.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  clearItem: () => void;
  /**
   * refresh data model list.
   */
  refreshList: () => void;
  /**
   * reload data model list. Compared with `refreshList`, data will be retrieved from native, which may solve some temporary problems.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  reloadList: () => void;
  /**
   * Display the session list menu. Menu customization needs to be implemented through `onInitMenu`. If you need complete customization, you can use `menuRef` and `alertRef` directly for more control. Some menus need to pop up a confirmation dialog box, which can be controlled using `alertRef`.
   */
  showMenu: () => void;
  /**
   * Close the menu.
   * @param onFinished Close the callback notification after the menu is completed.
   */
  closeMenu: (onFinished?: () => void) => void;
  /**
   * Gets a reference to the menu component of the content.
   */
  getMenuRef: () => React.RefObject<ContextNameMenuRef>;
  /**
   * Gets a reference to the alert component of the content.
   */
  getAlertRef: () => React.RefObject<AlertRef>;
};

/**
 * Flat list component reference.
 */
export type FlatListRefType<DataModel, ListItemProps> =
  BasicListRefType<DataModel> & {
    /**
     * Get the flat list component reference.
     */
    getFlatListRef: () => React.RefObject<FlatListRef<ListItemProps>>;
  };

/**
 * Section list component reference.
 */
export type SectionListRefType<
  DataModel,
  ListItemProps,
  SectionT extends DefaultSectionT = DefaultSectionT
> = BasicListRefType<DataModel> & {
  /**
   * Get the section list component reference.
   */
  getSectionListRef: () => React.RefObject<
    SectionListRef<ListItemProps, SectionT>
  >;
};

export type EmojiIconStateType = 'selected' | 'common';
export type EmojiIconItem = {
  name: IconNameType | string;
  state: EmojiIconStateType;
};

export type MessageMenuHeaderType =
  | React.FC<MessageMenuHeaderProps>
  | React.ReactElement<MessageMenuHeaderProps>;

export type MessageMenuHeaderProps = {
  emojiList?: EmojiIconItem[];
  onClickedEmoji?: (emoji: IconNameType | string) => void;
  /**
   * Whether to use the emoji chat mode.
   *
   * Its setting will affect the type of the return value of `onClickedEmoji`. If true, returns the emoji string, otherwise returns the `U+xxxxx` string.
   *
   * @default false
   */
  isEmojiCharacter?: boolean;
  /**
   * The message long press menu style.
   *
   * Detail for `BottomSheetNameMenu` and `BottomSheetNameMenu`.
   */
  messageMenuStyle?: MessageContextMenuStyle;
};
export type InitMenuItemsType = {
  /**
   * The text to be displayed.
   */
  name: string;
  /**
   * Whether the text is highlighted.
   */
  isHigh: boolean;
  /**
   * The icon to be displayed.
   */
  icon?: IconNameType;
  /**
   * The callback function when the text is clicked.
   *
   * @param name The text to be displayed.
   * @param others Other parameters. You can pass in the parameters you need. For example, you can pass in the user ID.
   */
  onClicked?: (name: string, others?: any) => void;
};

/**
 * Referencing Values of the `MessageMenu` component.
 */
export type BizContextMenuRef = SlideModalRef & {
  /**
   * While displaying the component, the menu items will also be dynamically changed.
   */
  startShowWithInit: (initItems: React.ReactElement[], others?: any) => void;
  /**
   * Start displaying the component with the specified properties.
   */
  startShowWithProps: (props: BizContextMenuProps) => void;

  /**
   * Get the data of the component.
   */
  getData: () => any;
};

export type ContextNameMenuRef = Omit<
  BizContextMenuRef,
  'startShowWithInit' | 'startShowWithProps'
> & {
  startShowWithInit: (initItems: InitMenuItemsType[], others?: any) => void;
  startShowWithProps: (props: ContextNameMenuProps) => void;
};

export type ContextBaseMenuProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * If no title is specified, it will not be displayed.
   *
   * This property is only valid for the built-in component `BottomSheetMenu`, and not for the built-in component `MessageContextMenu`
   */
  title?: string;
  /**
   * The emotion list header component's properties.
   */
  headerProps?: MessageMenuHeaderProps;
  /**
   * The emotion list header component.
   */
  header?: MessageMenuHeaderType;
};

/**
 * Properties of the `MessageMenu` component.
 */
export type BizContextMenuProps = ContextBaseMenuProps & {
  /**
   * initialization component items.
   *
   * If it is not set here, it can be set dynamically when calling `startShowWithInit`.
   */
  initItems?: React.ReactElement[];
  /**
   * The maximum height of the component.
   *
   * @default half of the entire screen.
   */
  maxHeight?: number;
};

export type ContextNameMenuProps = Omit<BizContextMenuProps, 'initItems'> & {
  /**
   * initialization component items.
   */
  initItems?: InitMenuItemsType[];
  /**
   * The layout type of the component.
   *
   * This property is only valid for the built-in component `BottomSheetMenu`.
   */
  layoutType?: 'left' | 'center';
  /**
   * Whether to display the cancel button.
   *
   * This property is only valid for the built-in component `BottomSheetMenu`.
   */
  hasCancel?: boolean;
  /**
   * The display position is suggested by the caller, but the final display position may be adjusted dynamically due to factors such as component layout and component layout.
   *
   * This property is only valid for the built-in component `MessageContextMenu`.
   */
  suggestedPosition?: {
    x: number;
    y: number;
  };
  /**
   * Areas that are prohibited from being covered. If there is a blank area, it will be used first. If there is no blank area, the covered area or the default area will be used.
   *
   * This property is only valid for the built-in component `MessageContextMenu`.
   */
  noCoverageArea?: ComponentArea;
  /**
   * The maximum number of rows for a component.
   *
   * The default maximum is 3 rows for `MessageContextMenu`, and more content will not be displayed.
   *
   * The default maximum is 2 rows for `MessageInputBarExtensionNameMenu`, and more content will not be displayed.
   *
   * This property is only valid for the built-in component `MessageContextMenu` or `MessageInputBarExtensionNameMenu`.
   *
   */
  maxRowCount?: number;
  /**
   * The count per row for the `MessageContextMenu` component.
   *
   * default is 5 for `MessageContextMenu`.
   *
   * default is 4 for `MessageInputBarExtensionNameMenu`
   *
   * This property is only valid for the built-in component `MessageContextMenu` or `MessageInputBarExtensionNameMenu`.
   *
   */
  unitCountPerRow?: number;
  /**
   * The emoji list position.
   *
   * default is `bottom` for `MessageMenuHeaderType`.
   *
   * This property is only valid for the built-in component `MessageContextMenu`.
   */
  emojiListPosition?: 'top' | 'bottom';
};

export type PressedComponentEvent = {
  pressedX: number;
  pressedY: number;
  componentX: number;
  componentY: number;
  componentWidth: number;
  componentHeight: number;
};
