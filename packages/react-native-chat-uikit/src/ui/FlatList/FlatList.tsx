import * as React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  View,
} from 'react-native';

import { getElement } from '../../hook';

export type FlatListRef<ItemT> = RNFlatList<ItemT>;

export type FlatListProps<ItemT> = RNFlatListProps<ItemT> & {
  /**
   * Rendered when the list is error. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListErrorComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  /**
   * Rendered when the list is loading. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListLoadingComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
};

export const _FlatList = <ItemT,>(
  props: FlatListProps<ItemT>,
  ref?: React.ForwardedRef<FlatListRef<ItemT>>
) => {
  const { ListErrorComponent, ListLoadingComponent, ListEmptyComponent, data } =
    props;

  // !!! https://github.com/facebook/react-native/issues/42967
  // !!! https://github.com/facebook/react-native/issues/36766
  // !!! https://github.com/facebook/react-native/issues/39421
  return (
    <View
      style={{
        flexGrow: 1,
        // height: 400,
        // flex: 1,
      }}
    >
      {data?.length !== 0 && <RNFlatList ref={ref} {...props} />}
      {data?.length === 0 && getElement(ListEmptyComponent)}
      {getElement(ListErrorComponent)}
      {getElement(ListLoadingComponent)}
    </View>
  );
};

/**
 * @example
 *
 * export const FlatList = FlatListFactory<{ id: string }>();
 * export function FlatList() {}
 * @returns
 */
export function FlatListFactory<ItemT = any>() {
  return React.forwardRef<FlatListRef<ItemT>, FlatListProps<ItemT>>(_FlatList);
}

export type FlatListFactoryReturn<ItemT> = ReturnType<
  typeof FlatListFactory<ItemT>
>;
