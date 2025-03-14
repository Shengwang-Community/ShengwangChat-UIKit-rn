import * as React from 'react';

import {
  ChatServiceListener,
  GroupParticipantModel,
  UIGroupParticipantListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useFlatList } from '../List';
import type { ContextNameMenuRef } from '../types';
import { ListStateType } from '../types';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
import type {
  GroupParticipantListItemComponentType,
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

export function useGroupParticipantList(props: GroupParticipantListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    groupId,
    participantType,
    onClickedAddParticipant,
    onClickedDelParticipant,
    onDelParticipant,
    onSelectParticipant,
    onChangeOwner,
    ListItemRender: propsListItemRender,
    onKicked: propsOnKicked,
    onStateChanged,
    // onRequestGroupData,
  } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    listState: 'loading',
  });
  const { setData, dataRef, setListState } = flatListProps;
  const [participantCount, setParticipantCount] = React.useState(0);
  const [selectedCount, setSelectedCount] = React.useState(0);
  const menuRef = React.useRef<ContextNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<GroupParticipantListItemComponentType>(
    propsListItemRender ?? GroupParticipantListItemMemo
  );
  const [ownerId, setOwnerId] = React.useState<string | undefined>(undefined);

  const im = useChatContext();
  const { tr } = useI18nContext();

  const updateState = React.useCallback(
    (state: ListStateType) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      const ret = onClickedItem?.(data);
      if (ret !== false) {
        if (participantType === 'change-owner') {
          alertRef.current.alertWithInit({
            title: tr(
              '_uikit_group_alert_change_owner_title',
              data?.memberName ?? data?.memberId
            ),
            buttons: [
              {
                text: tr('cancel'),
                onPress: () => {
                  alertRef.current.close?.();
                },
              },
              {
                text: tr('confirm'),
                isPreferred: true,
                onPress: () => {
                  alertRef.current.close?.();
                  onChangeOwner?.(data);
                },
              },
            ],
          });
        }
      }
    },
    [onChangeOwner, onClickedItem, participantType, tr]
  );

  const onLongPressedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const calculateSelectCount = React.useCallback(() => {
    if (participantType !== 'delete' && participantType !== 'av-meeting') {
      return;
    }
    let count = 0;
    dataRef.current = dataRef.current.map((item) => {
      if (item) {
        if (item.data.checked === true) {
          count++;
        }
      }
      return item;
    });
    setSelectedCount(count);
  }, [dataRef, participantType]);

  const refreshToUI = React.useCallback(() => {
    calculateSelectCount();
    const uniqueList = dataRef.current.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.data.memberId === item.data.memberId)
    );
    dataRef.current = uniqueList;
    setData([...dataRef.current]);
  }, [calculateSelectCount, dataRef, setData]);

  const onCheckClickedCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      if (participantType === 'delete' || participantType === 'av-meeting') {
        if (data?.checked !== undefined) {
          im.setModelState({
            tag: groupId,
            id: data.memberId,
            state: { checked: !data.checked },
          });
          dataRef.current = dataRef.current.map((item) => {
            if (item) {
              if (item.id === data.memberId) {
                return {
                  ...item,
                  data: { ...item.data, checked: !data.checked },
                };
              }
            }
            return item;
          });
          refreshToUI();
        }
      }
    },
    [dataRef, groupId, im, refreshToUI, participantType]
  );

  const init = React.useCallback(async () => {
    // im.setGroupParticipantOnRequestData(onRequestGroupData);
    const owner = await im.getGroupOwner({ groupId });
    if (owner) {
      setOwnerId(owner.memberId);
    }
    if (participantType === 'delete' || participantType === 'av-meeting') {
      im.clearModelState({ tag: groupId });
    }
    updateState('loading');
    im.getGroupAllMembers({
      groupId: groupId,
      owner,
      isReset:
        participantType === undefined || participantType === 'common'
          ? true
          : false,
      onResult: (result) => {
        const { isOk, value } = result;
        if (isOk === true && value) {
          dataRef.current = value.map((item) => {
            if (participantType === 'delete') {
              const modelState = im.getModelState({
                tag: groupId,
                id: item.memberId,
              });
              return {
                id: item.memberId,
                data: {
                  ...item,
                  isOwner: item.memberId === owner?.memberId,
                  checked: modelState?.checked ?? false,
                },
              } as GroupParticipantListItemProps;
            } else if (participantType === 'av-meeting') {
              const modelState = im.getModelState({
                tag: groupId,
                id: item.memberId,
              });
              return {
                id: item.memberId,
                data: {
                  ...item,
                  isOwner: item.memberId === owner?.memberId,
                  checked:
                    im.userId === item.memberId
                      ? true
                      : modelState?.checked ?? false,
                  disable: im.userId === item.memberId ? true : undefined,
                },
              } as GroupParticipantListItemProps;
            } else {
              return {
                id: item.memberId,
                data: {
                  ...item,
                  isOwner: item.memberId === owner?.memberId,
                  checked: undefined,
                },
              } as GroupParticipantListItemProps;
            }
          });
          if (participantType === 'change-owner') {
            dataRef.current = dataRef.current.filter((item) => {
              return (
                item.data.memberId !== im.userId || item.data.isOwner !== true
              );
            });
          } else if (participantType === 'delete') {
            dataRef.current = dataRef.current.filter((item) => {
              return (
                item.data.memberId !== im.userId || item.data.isOwner !== true
              );
            });
          } else if (participantType === 'av-meeting') {
          } else if (participantType === 'mention') {
            dataRef.current.unshift({
              id: 'All',
              data: {
                memberId: 'All',
                memberName: 'All',
              } as GroupParticipantModel,
            });
          }
          refreshToUI();
          setParticipantCount(dataRef.current.length);
          updateState('normal');
        } else {
          updateState('error');
        }
      },
    });
  }, [dataRef, groupId, im, participantType, refreshToUI, updateState]);

  const onClickedAddParticipantCallback = React.useCallback(() => {
    if (onClickedAddParticipant) {
      onClickedAddParticipant();
    }
  }, [onClickedAddParticipant]);
  const onClickedDelParticipantCallback = React.useCallback(() => {
    if (onClickedDelParticipant) {
      onClickedDelParticipant();
    }
  }, [onClickedDelParticipant]);
  const onDelParticipantCallback = React.useCallback(() => {
    if (participantType !== 'delete') {
      return;
    }

    if (onDelParticipant) {
      const list = dataRef.current
        .filter((item) => {
          return item.data.checked === true;
        })
        .map((item) => item.data);
      const names = list.map((item) => item.memberName ?? item.memberId);
      alertRef.current.alertWithInit({
        message: tr('_uikit_group_alert_del_member_title', names.join(',')),
        buttons: [
          {
            text: tr('cancel'),
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: tr('confirm'),
            isPreferred: true,
            onPress: () => {
              alertRef.current.close?.();
              onDelParticipant?.(list);
            },
          },
        ],
      });
    }
  }, [dataRef, onDelParticipant, participantType, tr]);

  const onSelectParticipantCallback = React.useCallback(() => {
    if (participantType !== 'av-meeting') {
      return;
    }

    if (onSelectParticipant) {
      const list = dataRef.current
        .filter((item) => {
          return item.data.checked === true;
        })
        .map((item) => item.data);
      onSelectParticipant?.(list);
    }
  }, [dataRef, onSelectParticipant, participantType]);

  const addDataToUI = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const groupMember = im.getGroupMember({
        groupId,
        userId: memberId,
      });
      if (groupMember) {
        dataRef.current.push({
          id: groupMember.memberId,
          data: groupMember,
        });
      } else {
        dataRef.current.push({
          id: memberId,
          data: {
            memberId: memberId,
            memberName: memberId,
          },
        });
      }
      refreshToUI();
    }
  };
  const removeDataToUI = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const index = dataRef.current.findIndex((item) => item.id === memberId);
      if (index !== -1) {
        dataRef.current.splice(index, 1);
      }
      refreshToUI();
    }
  };

  const onReload = React.useCallback(() => {
    init();
  }, [init]);

  const chatListenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (_params: { groupId: string; groupName?: string }) => {
      propsOnKicked?.(groupId);
    },
    onMemberJoined: (params: { groupId: string; member: string }) => {
      addDataToUI(params.groupId, params.member);
    },
    onMemberExited: (params: { groupId: string; member: string }) => {
      removeDataToUI(params.groupId, params.member);
      if (params.member === im.userId) {
        return;
      }
      setParticipantCount((prev) => prev - 1);
    },
  });
  useChatListener(chatListenerRef.current);

  React.useEffect(() => {
    const uiListener: UIGroupParticipantListListener = {
      onUpdatedEvent: (_data) => {},
      onDeletedEvent: (data) => {
        dataRef.current = dataRef.current.filter(
          (item) => item.data.memberId !== data.memberId
        );
        refreshToUI();
      },
      onAddedEvent: (data) => {
        if (data.memberId === im.userId) {
          return;
        }
        setParticipantCount((prev) => prev + 1);
        dataRef.current.push({
          id: data.memberId,
          data: data,
        });
        refreshToUI();
      },
      onRequestRefreshEvent: (id) => {
        if (id === groupId) {
          refreshToUI();
        }
      },
      onRequestReloadEvent: (id) => {
        if (id === groupId) {
          init();
        }
      },
      type: UIListenerType.GroupParticipant,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [dataRef, groupId, im, init, refreshToUI]);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressedCallback,
    onCheckClicked: onCheckClickedCallback,
    participantCount: participantCount,
    onClickedAddParticipant: onClickedAddParticipantCallback,
    onClickedDelParticipant: onClickedDelParticipantCallback,
    selectedCount: selectedCount,
    onDelParticipant: onDelParticipantCallback,
    onSelectParticipant: onSelectParticipantCallback,
    alertRef,
    menuRef,
    onRequestCloseMenu: closeMenu,
    ListItemRender: ListItemRenderRef.current,
    groupId,
    ownerId,
    onReload,
  };
}
