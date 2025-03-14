import * as React from 'react';
import { SectionListData, View } from 'react-native';

import {
  ChatServiceListener,
  ContactModel,
  NewRequestModel,
  UIContactListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { RequestListListener } from '../../chat/requestList.types';
import { uilog } from '../../const';
import { AsyncStorageBasic } from '../../db';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { ChatConversationType, ChatMultiDeviceEvent } from '../../rename.chat';
import type { AlertRef } from '../../ui/Alert';
import type { SectionListRef } from '../../ui/SectionList';
import { SingleLineText } from '../../ui/Text';
import { getPinyin, SingletonObjects } from '../../utils';
import { Badges } from '../Badges';
import { g_index_alphabet_range, g_index_alphabet_range_array } from '../const';
import { useMineInfoActions } from '../hooks';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useContactListMoreActions } from '../hooks/useContactListMoreActions';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { ContextNameMenuRef } from '../types';
import type { ChoiceType, ListStateType } from '../types';
import {
  ContactItem,
  ContactListItemHeaderMemo,
  ContactListItemMemo,
} from './ContactList.item';
import type {
  ContactListItemComponentType,
  ContactListItemHeaderComponentType,
  ContactListItemProps,
  ContactListProps,
} from './types';

/**
 * Contact list hook.
 */
export function useContactList(props: ContactListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    onSort: propsOnSort,
    onClickedNewContact: propsOnClickedNewContact,
    onCreateGroupResultValue,
    contactType,
    selectedData,
    groupId,
    onAddGroupParticipantResult,
    ListItemRender: propsListItemRender,
    ListItemHeaderRender: propsListItemHeaderRender,
    propsRef,
    onInitialized,
    sectionListProps: propsSectionListProps,
    onStateChanged,
    onInitListItemActions: propsOnInitListItemActions,
    onClickedNewRequest,
    onClickedGroupList,
    onForwardMessage,
    onChangeRequestCount,
    getFullLetter: propsGetFullLetter,
    indexList: propsIndexList = g_index_alphabet_range_array,
    visibleEmptyIndex: propsVisibleEmptyIndex,
  } = props;
  const sectionListProps = useSectionList<
    ContactListItemProps,
    IndexModel,
    ListIndexProps
  >({
    listState: 'loading',
  });
  const {
    isSort,
    setIndexTitles,
    setSection,
    sectionsRef,
    ref: sectionListRef,
    isAutoLoad,
    setListState,
  } = sectionListProps;
  const [userId, setUserId] = React.useState<string | undefined>(undefined);
  const [selectedCount, setSelectedCount] = React.useState(0);
  const [selectedMemberCount, setSelectedMemberCount] =
    React.useState<number>(0);
  const choiceType = React.useRef<ChoiceType>('multiple').current;
  const [_requestCount, setRequestCount] = React.useState(0);
  const rememberCountRef = React.useRef<number>(0);
  const rememberCountTmpRef = React.useRef<number>(0);
  const [groupCount] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState<string>();
  const { tr } = useI18nContext();
  const im = useChatContext();
  const { getColor } = useColors();
  const menuRef = React.useRef<ContextNameMenuRef>(null);
  const alertRef = React.useRef<AlertRef>(null);
  const { onShowMineInfoActions } = useMineInfoActions({ menuRef, alertRef });
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<ContactListItemComponentType>(
    propsListItemRender ?? ContactListItemMemo
  );
  const ListItemHeaderRenderRef =
    React.useRef<ContactListItemHeaderComponentType>(
      propsListItemHeaderRender ?? ContactListItemHeaderMemo
    );
  const { onShowContactListMoreActions } = useContactListMoreActions({
    menuRef,
    alertRef,
  });
  const dbRef = React.useRef(
    SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${im.id()}`,
    })
  );

  const updateState = React.useCallback(
    (state: ListStateType) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

  const onSort = React.useCallback(
    (
      prevProps: ContactListItemProps,
      nextProps: ContactListItemProps
    ): number => {
      if (propsOnSort) {
        return propsOnSort(prevProps, nextProps);
      } else {
        return _sortContact(prevProps, nextProps);
      }
    },
    [propsOnSort]
  );

  const onClickedCallback = React.useCallback(
    (data?: ContactModel | undefined) => {
      onClickedItem?.(data);
    },
    [onClickedItem]
  );

  const onLongPressCallback = React.useCallback(
    (data?: ContactModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const removeDuplicateData = React.useCallback(
    (list: ContactListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.section.userId === item.section.userId)
      );
      return uniqueList;
    },
    []
  );

  const calculateGroupCount = React.useCallback(() => {
    if (contactType !== 'create-group') {
      return;
    }
    let count = 0;
    sectionsRef.current.forEach((section) => {
      section.data.forEach((item) => {
        if (item.section.checked === true) {
          count++;
        }
      });
    });
    setSelectedCount(count);
  }, [contactType, sectionsRef]);

  const calculateAddedGroupMemberCount = React.useCallback(() => {
    if (contactType !== 'add-group-member') {
      return;
    }
    let count = 0;
    sectionsRef.current.forEach((section) => {
      section.data.forEach((item) => {
        if (item.section.checked === true) {
          if (groupId) {
            const isExisted = im.getGroupMember({
              groupId: groupId,
              userId: item.section.userId,
            });
            if (isExisted === undefined) {
              count++;
            }
          }
        }
      });
    });
    setSelectedMemberCount(count);
  }, [contactType, groupId, im, sectionsRef]);

  const onChangeGroupCount = React.useCallback(() => {
    // im.fetchJoinedGroupCount({
    //   onResult: (result) => {
    //     if (result.isOk === true && result.value) {
    //       setGroupCount(result.value);
    //     }
    //   },
    // });
  }, []);

  const getNickName = React.useCallback((section: ContactModel) => {
    return _getNickName(section);
  }, []);

  const updatePinyin = React.useCallback(
    (list: ContactListItemProps[]) => {
      list.forEach((item) => {
        const name = getNickName(item.section);
        if (propsGetFullLetter) {
          item.section.pinyin = propsGetFullLetter(name);
        } else {
          item.section.pinyin = getPinyin(name);
        }
      });
    },
    [getNickName, propsGetFullLetter]
  );

  const initIndexList = React.useCallback(
    (
      sortList: (IndexModel & {
        data: ContactListItemProps[];
      })[]
    ) => {
      propsIndexList.forEach((i) => {
        sortList.push({
          indexTitle: i,
          data: [],
        });
      });
    },
    [propsIndexList]
  );
  const filterEmptyIndex = React.useCallback(
    (
      sortList: (IndexModel & {
        data: ContactListItemProps[];
      })[]
    ) => {
      return sortList.filter((item) => {
        return item.data.length > 0;
      });
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: ContactListItemProps[]) => {
      updatePinyin(list);

      if (isSort === true) {
        list.sort(onSort);
      }

      const uniqueList = removeDuplicateData(list);

      const sortList: (IndexModel & { data: ContactListItemProps[] })[] = [];
      initIndexList(sortList);

      uniqueList.forEach((item) => {
        const first = item.section.pinyin?.[0]?.toLocaleUpperCase();
        // const name = getNickName(item.section);
        // const first = getFirst(name?.[0]?.toLocaleUpperCase());
        const indexTitle = first
          ? g_index_alphabet_range.includes(first)
            ? first
            : '#'
          : '#';
        const index = sortList.findIndex((section) => {
          return section.indexTitle === indexTitle;
        });
        if (index === -1) {
          sortList.push({
            indexTitle: indexTitle,
            data: [item],
          });
        } else {
          sortList[index]?.data.push(item);
        }
      });
      if (propsVisibleEmptyIndex !== true) {
        sectionsRef.current = filterEmptyIndex(sortList);
      } else {
        sectionsRef.current = sortList;
      }

      calculateGroupCount();
      calculateAddedGroupMemberCount();

      setIndexTitles(sectionsRef.current.map((item) => item.indexTitle));
      setSection(sectionsRef.current);
    },
    [
      calculateAddedGroupMemberCount,
      calculateGroupCount,
      filterEmptyIndex,
      initIndexList,
      isSort,
      onSort,
      propsVisibleEmptyIndex,
      removeDuplicateData,
      sectionsRef,
      setIndexTitles,
      setSection,
      updatePinyin,
    ]
  );

  const flatList = React.useCallback(
    (sectionList: SectionListData<ContactListItemProps, IndexModel>[]) => {
      return sectionList
        .map((section) => {
          return section.data.map((item) => {
            return item;
          });
        })
        .flat();
    },
    []
  );

  const addContactToUI = React.useCallback(
    (data: ContactModel) => {
      const list = flatList(sectionsRef.current);
      list.push({
        id: data.userId,
        section: data,
      } as ContactListItemProps);
      refreshToUI(list);
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const removeContactToUI = React.useCallback(
    (userId: string) => {
      sectionsRef.current = sectionsRef.current.filter((section) => {
        section.data = section.data.filter((item) => {
          return item.section.userId !== userId;
        });
        return section.data.length > 0;
      });
      refreshToUI(flatList(sectionsRef.current));
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const updateContactToUI = React.useCallback(
    (data: ContactModel) => {
      const list = flatList(sectionsRef.current);
      const isExisted = list.find((item) => {
        if (item.id === data.userId) {
          item.section = {
            ...item.section,
            ...data,
          };
          return true;
        }
        return false;
      });
      if (isExisted !== undefined) {
        if (data.checked !== undefined) {
          if (contactType === 'create-group') {
            im.setModelState({
              tag: contactType,
              id: data.userId,
              state: { checked: data.checked },
            });
          } else if (contactType === 'add-group-member') {
            if (groupId) {
              im.setModelState({
                tag: groupId,
                id: data.userId,
                state: { checked: data.checked },
              });
            }
          }
        }
        if (data.forwarded !== undefined) {
          if (contactType === 'forward-message') {
            im.setModelState({
              tag: contactType,
              id: data.userId,
              state: { forwarded: data.forwarded },
            });
          }
        }

        refreshToUI(list);
      }
    },
    [contactType, flatList, groupId, im, refreshToUI, sectionsRef]
  );

  const onCheckClickedCallback = React.useCallback(
    (data?: ContactModel) => {
      if (
        contactType !== 'create-group' &&
        contactType !== 'add-group-member'
      ) {
        return;
      }
      if (data && data.checked !== undefined) {
        if (choiceType === 'single') {
        } else if (choiceType === 'multiple') {
          const tmp = { ...data, checked: !data.checked };
          updateContactToUI(tmp);
        }
      }
    },
    [choiceType, contactType, updateContactToUI]
  );

  const onClickedForward = React.useCallback(
    (data?: ContactModel) => {
      if (contactType === 'forward-message' && data) {
        if (data.forwarded !== true) {
          const tmp = { ...data, forwarded: !data.forwarded };
          updateContactToUI(tmp);
          onForwardMessage?.(data);
        }
      }
    },
    [contactType, onForwardMessage, updateContactToUI]
  );

  const onIndexSelected = React.useCallback(
    (index: number) => {
      sectionListRef?.current?.scrollToLocation?.({
        sectionIndex: index,
        itemIndex: 1,
      });
    },
    [sectionListRef]
  );

  const onRememberRequestCount = React.useCallback(() => {
    dbRef.current.setCurrentId(im.userId ?? 'unknown');
    rememberCountRef.current = rememberCountTmpRef.current;
    dbRef.current
      .setDataWithUser({
        key: 'profile/contact_request_count',
        value: `${rememberCountRef.current}`,
      })
      .catch((error) => {
        uilog.warn('dev:onRememberRequestCount:error:', error);
      });
  }, [im.userId]);

  const _onClickedNewRequest = React.useCallback(() => {
    onRememberRequestCount();
    setRequestCount(0);
    onChangeRequestCount?.(0);
    onClickedNewRequest?.();
  }, [onChangeRequestCount, onClickedNewRequest, onRememberRequestCount]);

  const onClickedAvatar = React.useCallback(() => {
    onShowMineInfoActions();
  }, [onShowMineInfoActions]);

  const init = React.useCallback(
    async (params: {
      isClearState?: boolean;
      requestServer?: boolean;
      onFinished?: () => void;
    }) => {
      const { isClearState, onFinished, requestServer } = params;
      const url = im.user(im.userId)?.avatarURL;
      if (url) {
        setAvatarUrl(url);
      }
      if (im.userId) {
        setUserId(im.userId);
      }
      if (isAutoLoad === true) {
        if (isClearState === undefined || isClearState === true) {
          if (contactType === 'create-group') {
            im.clearModelState({ tag: contactType });
          } else if (contactType === 'add-group-member') {
            if (groupId) {
              im.clearModelState({ tag: groupId });
            }
          } else if (contactType === 'forward-message') {
            im.clearModelState({ tag: contactType });
          }
        }

        const s = await im.loginState();
        if (s === 'logged') {
          updateState('loading');
          if (contactType === 'add-group-member') {
            im.getAllContacts2({
              onResult: async (result) => {
                const { isOk, value } = result;
                if (isOk === true && value && groupId) {
                  im.getGroupAllMembers({
                    groupId,
                    onResult: (res) => {
                      if (res.isOk === true && res.value) {
                        const groupMembers = res.value ?? [];
                        const list = value.map((item) => {
                          const isExisted = groupMembers.find((member) => {
                            return member.memberId === item.userId;
                          });
                          return {
                            id: item.userId,
                            section: {
                              ...item,
                              checked:
                                isExisted !== undefined
                                  ? true
                                  : im.getModelState({
                                      tag: groupId,
                                      id: item.userId,
                                    })?.checked ?? false,
                              disable: isExisted !== undefined,
                            },
                            contactType: contactType,
                          } as ContactListItemProps;
                        });
                        refreshToUI(list);
                        updateState('normal');
                      } else {
                        updateState('error');
                      }
                    },
                  });
                } else {
                  updateState('error');
                }
                onFinished?.();
              },
            });
          } else {
            im.getAllContacts2({
              requestServer: requestServer,
              onResult: (result) => {
                const { isOk, value } = result;
                if (isOk === true && value) {
                  const list = value.map((item) => {
                    return {
                      id: item.userId,
                      section:
                        contactType === 'create-group'
                          ? {
                              ...item,
                              checked:
                                im.getModelState({
                                  tag: contactType,
                                  id: item.userId,
                                })?.checked ?? false,
                            }
                          : contactType === 'forward-message'
                          ? {
                              ...item,
                              forwarded:
                                im.getModelState({
                                  tag: contactType,
                                  id: item.userId,
                                })?.forwarded ?? false,
                            }
                          : item,
                      contactType: contactType,
                    } as ContactListItemProps;
                  });
                  refreshToUI(list);
                  updateState('normal');
                } else {
                  updateState('error');
                }
                onFinished?.();
              },
            });
          }
          onChangeGroupCount();
        } else {
          updateState('error');
        }
      }
    },
    [
      contactType,
      groupId,
      im,
      isAutoLoad,
      onChangeGroupCount,
      refreshToUI,
      setUserId,
      updateState,
    ]
  );

  const contactItems = React.useCallback(
    ({ requestCount }: { requestCount: number; groupCount: number }) => {
      if (contactType !== 'contact-list') {
        return null;
      }
      const items = [
        <ContactItem
          key={'_uikit_contact_new_request'}
          name={tr('_uikit_contact_new_request')}
          count={<Badges count={requestCount} />}
          hasArrow={true}
          onClicked={_onClickedNewRequest}
        />,
        <ContactItem
          key={'_uikit_contact_group_list'}
          name={tr('_uikit_contact_group_list')}
          count={
            <SingleLineText
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('fg') }}
            >
              {null}
            </SingleLineText>
          }
          hasArrow={true}
          onClicked={onClickedGroupList}
        />,
      ];
      const newContactItems = propsOnInitListItemActions
        ? propsOnInitListItemActions(items)
        : items;
      return newContactItems;
    },
    [
      _onClickedNewRequest,
      contactType,
      getColor,
      onClickedGroupList,
      propsOnInitListItemActions,
      tr,
    ]
  );

  useChatListener(
    React.useMemo(() => {
      return {
        onContactAdded: async (_userId: string) => {
          // onAddedContact(userId);
          init({ requestServer: true });
        },
        onContactDeleted: async (userId: string) => {
          removeContactToUI(userId);
        },
        onConversationEvent: (
          event?: ChatMultiDeviceEvent,
          convId?: string,
          _convType?: ChatConversationType
        ) => {
          if (event === ChatMultiDeviceEvent.CONTACT_REMOVE) {
            if (convId) {
              removeContactToUI(convId);
            }
          }
        },
        onContactEvent: (event) => {
          if (
            event === ChatMultiDeviceEvent.CONTACT_ACCEPT ||
            event === ChatMultiDeviceEvent.CONTACT_REMOVE
          ) {
            init({});
          }
        },
      } as ChatServiceListener;
    }, [init, removeContactToUI])
  );

  const onCreateGroupCallback = React.useCallback(() => {
    if (contactType !== 'create-group') {
      return;
    }
    const list = flatList(sectionsRef.current)
      .filter((item) => {
        return item.section.checked === true;
      })
      .map((item) => {
        return item.section;
      });
    onCreateGroupResultValue?.(list);
  }, [contactType, flatList, onCreateGroupResultValue, sectionsRef]);

  const onClickedAddGroupParticipant = React.useCallback(() => {
    if (contactType !== 'add-group-member') {
      return;
    }
    const list = flatList(sectionsRef.current)
      .filter((item) => {
        if (item.section.checked === true) {
          if (groupId) {
            const isExisted = im.getGroupMember({
              groupId: groupId,
              userId: item.section.userId,
            });
            return isExisted === undefined;
          }
        }
        return false;
      })
      .map((item) => {
        return item.section;
      });
    onAddGroupParticipantResult?.(list);
  }, [
    contactType,
    flatList,
    groupId,
    im,
    onAddGroupParticipantResult,
    sectionsRef,
  ]);

  const addContact = React.useCallback(
    (userId: string) => {
      if (contactType !== 'contact-list') {
        return;
      }
      im.addNewContact({
        userId: userId,
        reason: 'add contact',
      });
    },
    [contactType, im]
  );

  const removeContact = React.useCallback(
    (item: ContactModel) => {
      if (contactType !== 'contact-list') {
        return;
      }
      im.removeContact({
        userId: item.userId,
      });
    },
    [contactType, im]
  );

  const removeConversation = React.useCallback(
    (userId: string) => {
      im.removeConversation({ convId: userId });
    },
    [im]
  );

  const setContactRemark = React.useCallback(
    (item: ContactModel) => {
      if (item.remark && item.remark.length > 0) {
        im.setContactRemark({
          userId: item.userId,
          remark: item.remark,
        });
      }
    },
    [im]
  );

  const onClickedNewContact = React.useCallback(() => {
    if (propsOnClickedNewContact) {
      propsOnClickedNewContact();
    } else {
      onShowContactListMoreActions(addContact);
    }
  }, [addContact, onShowContactListMoreActions, propsOnClickedNewContact]);

  const ListHeaderComponent = React.useCallback(() => {
    const ret = contactItems({ groupCount, requestCount: _requestCount });
    return <View>{ret}</View>;
  }, [contactItems, groupCount, _requestCount]);

  const onReload = React.useCallback(() => {
    init({ requestServer: true });
  }, [init]);

  if (propsRef?.current) {
    propsRef.current.addItem = (item) => {
      addContact(item.userId);
    };
    propsRef.current.closeMenu = () => closeMenu();
    propsRef.current.deleteItem = (item) => {
      removeContact(item);
      removeConversation(item.userId);
    };
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getList = () => {
      return flatList(sectionsRef.current).map((item) => item.section);
    };
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getSectionListRef = () => {
      return sectionListRef as React.RefObject<
        SectionListRef<ContactListItemProps, IndexModel>
      >;
    };
    propsRef.current.refreshList = () => {
      refreshToUI(flatList(sectionsRef.current));
    };
    propsRef.current.reloadList = () => {
      init({ requestServer: true, onFinished: onInitialized });
    };
    propsRef.current.showMenu = () => {
      onShowContactListMoreActions(addContact);
    };
    propsRef.current.updateItem = (item) => {
      setContactRemark(item);
    };
  }

  React.useEffect(() => {
    const listener: UIContactListListener = {
      onAddedEvent: (data) => {
        addContactToUI(data);
      },
      onDeletedEvent: (data) => {
        removeContactToUI(data.userId);
      },
      onUpdatedEvent: (data) => {
        updateContactToUI(data);
      },
      onRequestRefreshEvent: () => {
        refreshToUI(flatList(sectionsRef.current));
      },
      onRequestReloadEvent: () => {
        init({ onFinished: onInitialized });
      },
      type: UIListenerType.Contact,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [
    addContactToUI,
    flatList,
    im,
    init,
    onInitialized,
    refreshToUI,
    removeContactToUI,
    sectionsRef,
    updateContactToUI,
  ]);

  React.useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      setSelectedCount(selectedData.length);
      init({ isClearState: false });
    } else {
      init({});
    }
  }, [init, selectedData]);

  React.useEffect(() => {
    const listener: RequestListListener = {
      onNewRequestListChanged: (list: NewRequestModel[], changed: number) => {
        const count = list.length;

        if (rememberCountTmpRef.current + changed === list.length) {
          if (changed < 0) {
            rememberCountRef.current += changed;
            if (rememberCountRef.current < 0) {
              rememberCountRef.current = 0;
            }
          }
        }

        rememberCountTmpRef.current = count;
        const c =
          count - rememberCountRef.current > 0
            ? count - rememberCountRef.current
            : 0;
        setRequestCount(c);
        onChangeRequestCount?.(c);
      },
    };
    im.requestList.addListener('ContactList', listener);
    return () => {
      im.requestList.removeListener('ContactList');
    };
  }, [im.requestList, onChangeGroupCount, onChangeRequestCount]);

  React.useEffect(() => {
    im.requestList.getRequestList({
      onResult: async (result) => {
        dbRef.current.setCurrentId(im.userId ?? 'unknown');
        const ret = await dbRef.current.getDataWithUser({
          key: 'profile/contact_request_count',
        });
        if (ret.value) {
          rememberCountRef.current = parseInt(ret.value, 10);
          const count = result.value?.length ?? 0;
          const c =
            count - rememberCountRef.current > 0
              ? count - rememberCountRef.current
              : 0;
          setRequestCount(c);
          onChangeRequestCount?.(c);
          rememberCountTmpRef.current = count;
        } else {
          setRequestCount(result.value?.length ?? 0);
          onChangeRequestCount?.(result.value?.length ?? 0);
        }
      },
    });
  }, [im.requestList, im.userId, onChangeRequestCount]);

  return {
    ...sectionListProps,
    sectionListProps: propsSectionListProps,
    propsSectionListProps,
    onIndexSelected,
    onRequestCloseMenu: closeMenu,
    onClickedNewContact,
    menuRef,
    alertRef,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressCallback,
    onCheckClicked: onCheckClickedCallback,
    selectedCount,
    onClickedCreateGroup: onCreateGroupCallback,
    selectedMemberCount,
    onClickedAddGroupParticipant,
    requestCount: _requestCount,
    groupCount,
    avatarUrl,
    tr,
    ListItemRender: ListItemRenderRef.current,
    ListItemHeaderRender: ListItemHeaderRenderRef.current,
    contactItems,
    ListHeaderComponent,
    onClickedForward,
    onReload,
    userId,
    onClickedAvatar,
  };
}

const _getNickName = (section: ContactModel) => {
  if (section.remark && section.remark.length > 0) {
    return section.remark;
  } else if (section.userName && section.userName.length > 0) {
    return section.userName;
  } else {
    return section.userId;
  }
};

const _sortContact = (
  prevProps: ContactListItemProps,
  nextProps: ContactListItemProps
): number => {
  if (
    prevProps.section.pinyin &&
    prevProps.section.pinyin.length > 0 &&
    nextProps.section.pinyin &&
    nextProps.section.pinyin.length > 0
  ) {
    const prevFirstLetter = prevProps.section.pinyin;
    const nextFirstLetter = nextProps.section.pinyin;

    if (prevFirstLetter < nextFirstLetter) {
      return -1;
    } else if (prevFirstLetter > nextFirstLetter) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
