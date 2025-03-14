import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { useGroupParticipantList } from './GroupParticipantList.hooks';
import { GroupParticipantListNavigationBar } from './GroupParticipantList.navi';
import type {
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

const FlatList = FlatListFactory<GroupParticipantListItemProps>();

/**
 * Group Participant List Component.
 */
export function GroupParticipantList(props: GroupParticipantListProps) {
  const {
    containerStyle,
    onBack,
    participantType,
    navigationBarVisible,
    customNavigationBar,
  } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    onClicked,
    onLongPressed,
    participantCount,
    onClickedAddParticipant,
    onClickedDelParticipant,
    selectedCount,
    onDelParticipant,
    onSelectParticipant,
    alertRef,
    onCheckClicked,
    menuRef,
    onRequestCloseMenu,
    ListItemRender,
    groupId,
    ownerId,
    onReload,
  } = useGroupParticipantList(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        <GroupParticipantListNavigationBar
          groupId={groupId}
          ownerId={ownerId}
          participantType={participantType}
          onBack={onBack}
          onDelParticipant={onDelParticipant}
          onSelectParticipant={onSelectParticipant}
          selectedCount={selectedCount}
          participantCount={participantCount}
          onClickedAddParticipant={onClickedAddParticipant}
          onClickedDelParticipant={onClickedDelParticipant}
          customNavigationBar={customNavigationBar}
        />
      ) : null}

      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            // height: '100%',
            // height: 400,
            // backgroundColor: 'yellow',
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(
            info: ListRenderItemInfo<GroupParticipantListItemProps>
          ) => {
            const { item } = info;
            return (
              <ListItemRender
                {...item}
                onClicked={onClicked}
                onCheckClicked={onCheckClicked}
                onLongPressed={onLongPressed}
              />
            );
          }}
          keyExtractor={(item: GroupParticipantListItemProps) => {
            return item.id;
          }}
          onEndReached={onMore}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  onReload?.();
                }}
              />
            ) : null
          }
        />
      </View>
      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
