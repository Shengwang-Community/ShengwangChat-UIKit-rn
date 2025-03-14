import * as React from 'react';
import {
  DefaultSectionT,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { Alert } from '../../ui/Alert';
import { SectionListFactory } from '../../ui/SectionList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { IndexModel } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { useContactList } from './ContactList.hooks';
import { ContactListNavigationBar } from './ContactList.navi';
import type { ContactListItemProps, ContactListProps } from './types';

const SectionList = SectionListFactory<ContactListItemProps, IndexModel>();

/**
 * The contact list component mainly consists of four parts, including navigation component, search style component, individual list item component, and list component. Supports displaying bottom menu components and warning components. The navigation bar component can be set to display or not, customize the style, or even replace it as a whole. The search style component supports whether to display, and the individual list item component supports whether to display, add or replace any multiple components. List components support more property settings.
 */
export function ContactList(props: ContactListProps) {
  const {
    containerStyle,
    contactType,
    onBack,
    navigationBarVisible,
    customNavigationBar,
    searchStyleVisible,
    customSearch,
    onClickedSearch,
    isVisibleItemHeader = true,
    isVisibleIndex = true,
  } = props;
  const {
    ref,
    sections,
    indexTitles,
    onRefresh,
    refreshing,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    AlphabeticIndex,
    onIndexSelected,
    onRequestCloseMenu,
    menuRef,
    onClickedNewContact,
    alertRef,
    onClicked,
    onLongPressed,
    onCheckClicked,
    selectedCount,
    onClickedCreateGroup,
    selectedMemberCount,
    onClickedAddGroupParticipant,
    avatarUrl,
    tr,
    ListItemRender,
    ListItemHeaderRender,
    sectionListProps,
    ListHeaderComponent,
    onClickedForward,
    userId,
    onReload,
    onClickedAvatar,
  } = useContactList(props);
  const {
    style,
    contentContainerStyle,
    refreshing: propsRefreshing,
    onRefresh: propsOnRefresh,
    onEndReached: propsOnEndReached,
    viewabilityConfig: propsViewabilityConfig,
    onViewableItemsChanged: propsOnViewableItemsChanged,
    showsVerticalScrollIndicator,
    ...others
  } = sectionListProps ?? {};
  const { getColor } = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        <ContactListNavigationBar
          userId={userId}
          contactType={contactType}
          selectedCount={selectedCount}
          selectedMemberCount={selectedMemberCount}
          avatarUrl={avatarUrl}
          onClickedNewContact={onClickedNewContact}
          onBack={onBack}
          onClickedCreateGroup={onClickedCreateGroup}
          onClickedAddGroupParticipant={onClickedAddGroupParticipant}
          customNavigationBar={customNavigationBar}
          onClickedAvatar={onClickedAvatar}
        />
      ) : null}

      {searchStyleVisible !== false ? (
        customSearch ? (
          <>{customSearch}</>
        ) : (
          <SearchStyle
            title={tr('_uikit_contact_search_placeholder')}
            onPress={() => {
              onClickedSearch?.(contactType);
            }}
          />
        )
      ) : null}

      {/* {contactItems({ groupCount, requestCount })} */}

      <View style={{ flex: 1 }}>
        {ListHeaderComponent()}
        <SectionList
          // ListHeaderComponent={ListHeaderComponent}
          ref={ref}
          style={[{ flex: 1 }, style]}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          sections={sections}
          // !!! https://github.com/facebook/react-native/issues/42967
          // !!! https://github.com/facebook/react-native/issues/36766
          initialNumToRender={9999}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? false}
          refreshing={propsRefreshing ?? refreshing}
          onRefresh={propsOnRefresh ?? onRefresh}
          renderItem={(
            info: SectionListRenderItemInfo<
              ContactListItemProps,
              DefaultSectionT
            >
          ) => {
            const { item } = info;
            return (
              <ListItemRender
                {...item}
                onClicked={onClicked}
                onLongPressed={onLongPressed}
                onCheckClicked={onCheckClicked}
                onForwardClicked={onClickedForward}
              />
            );
          }}
          keyExtractor={(item: ContactListItemProps) => {
            return item.id;
          }}
          renderSectionHeader={
            isVisibleItemHeader === true
              ? (info: {
                  section: SectionListData<ContactListItemProps, IndexModel>;
                }) => {
                  const { section } = info;
                  return <ListItemHeaderRender {...section} />;
                }
              : undefined
          }
          onEndReached={propsOnEndReached ?? onMore}
          viewabilityConfig={propsViewabilityConfig ?? viewabilityConfig}
          onViewableItemsChanged={
            propsOnViewableItemsChanged ?? onViewableItemsChanged
          }
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
          {...others}
        />
        {isVisibleIndex === true && AlphabeticIndex ? (
          <View
            pointerEvents={'box-none'}
            style={[
              StyleSheet.absoluteFill,
              {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                right: 2,
                left: 0,
              },
            ]}
          >
            <AlphabeticIndex
              indexTitles={indexTitles}
              onIndexSelected={onIndexSelected}
            />
          </View>
        ) : null}
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
