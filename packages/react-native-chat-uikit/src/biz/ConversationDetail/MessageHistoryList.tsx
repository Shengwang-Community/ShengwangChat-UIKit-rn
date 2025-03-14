import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { FlatListFactory } from '../../ui/FlatList';
import { useFlatList } from '../List';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { TopNavigationBar, TopNavigationBarLeft } from '../TopNavigationBar';
import { MessageHistoryListItemMemo } from './MessageHistoryListItem';
import type {
  MessageHistoryListItemProps,
  MessageHistoryListProps,
  MessageHistoryModel,
} from './types';

export function MessageHistoryList(props: MessageHistoryListProps) {
  const { containerStyle, onBack, navigationBarVisible, customNavigationBar } =
    props;
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageHistoryListItemProps>(),
    []
  );
  const { tr } = useI18nContext();
  const { getColor } = useColors();

  const { data, listState, onClickedItem } = useMessageHistoryList(props);

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flex: 1,
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <TopNavigationBarLeft
                onBack={onBack}
                content={tr('_uikit_history_record')}
              />
            }
            Right={<View style={{ width: 32, height: 32 }} />}
          />
        )
      ) : null}
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          style={[{ flexGrow: 1 }]}
          contentContainerStyle={[{ flexGrow: 1 }]}
          data={data}
          renderItem={(
            info: ListRenderItemInfo<MessageHistoryListItemProps>
          ) => {
            const { item } = info;
            return (
              <MessageHistoryListItemMemo {...item} onClicked={onClickedItem} />
            );
          }}
          keyExtractor={(item: MessageHistoryListItemProps) => {
            return item.model.msg.msgId;
          }}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder onClicked={() => {}} />
            ) : null
          }
          ListLoadingComponent={
            listState === 'loading' ? <LoadingPlaceholder /> : null
          }
        />
      </View>
    </View>
  );
}

function useMessageHistoryList(props: MessageHistoryListProps) {
  const { testMode, message, onClickedItem: propsOnClickedItem } = props;
  const im = useChatContext();
  const flatListProps = useFlatList<MessageHistoryListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
  });
  const { dataRef, setData } = flatListProps;

  const onClickedItem = React.useCallback(
    (model: MessageHistoryModel) => {
      propsOnClickedItem?.(model);
    },
    [propsOnClickedItem]
  );

  const init = React.useCallback(async () => {
    const list = await im.fetchCombineMessageDetail({ msg: message });
    if (list && list.length > 0) {
      list.forEach((item) => {
        dataRef.current.push({
          model: { msg: item, modelType: 'history', userId: item.from },
        });
      });
      setData([...dataRef.current]);
    }
  }, [dataRef, im, message, setData]);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    ...flatListProps,
    onClickedItem,
  };
}
