/**
 * Copyright (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 *
 * @emails oncall+recoil
 * @flow strict-local
 * @format
 */
'use strict';

import gkx from '../../util/Recoil_gkx';
gkx.setFail('recoil_async_selector_refactor');

import type {Store} from '../Recoil_State';

import * as React from 'React';
import * as ReactDOM from 'ReactDOM';
import ReactTestUtils from 'ReactTestUtils';

const {act} = ReactTestUtils;
import {useSetRecoilState} from '../../hooks/Recoil_Hooks';
import atom from '../../recoil_values/Recoil_atom';
import constSelector from '../../recoil_values/Recoil_constSelector';
import selector from '../../recoil_values/Recoil_selector';
import {ReadsAtom, renderElements} from '../../testing/Recoil_TestingUtils';
import {RecoilRoot} from '../Recoil_RecoilRoot.react';
import {useStoreRef} from '../Recoil_RecoilRoot.react';

describe('initializeState', () => {
  test('initialize atom', () => {
    const myAtom = atom({
      key: 'RecoilRoot - initializeState - atom',
      default: 'DEFAULT',
    });
    const mySelector = constSelector(myAtom);

    function initializeState({set, getLoadable}) {
      expect(getLoadable(myAtom).contents).toEqual('DEFAULT');
      expect(getLoadable(mySelector).contents).toEqual('DEFAULT');
      set(myAtom, 'INITIALIZE');
      expect(getLoadable(myAtom).contents).toEqual('INITIALIZE');
      expect(getLoadable(mySelector).contents).toEqual('INITIALIZE');
    }

    const container = document.createElement('div');
    act(() => {
      ReactDOM.render(
        <RecoilRoot initializeState={initializeState}>
          <ReadsAtom atom={myAtom} />
          <ReadsAtom atom={mySelector} />
        </RecoilRoot>,
        container,
      );
    });

    expect(container.textContent).toEqual('"INITIALIZE""INITIALIZE"');
  });

  test('initialize selector', () => {
    const myAtom = atom({
      key: 'RecoilRoot - initializeState - selector',
      default: 'DEFAULT',
    });
    const mySelector = selector({
      key: 'RecoilRoot - initializeState - selector selector',
      get: ({get}) => get(myAtom),
      set: ({set}, newValue) => set(myAtom, newValue),
    });

    function initializeState({set, getLoadable}) {
      expect(getLoadable(myAtom).contents).toEqual('DEFAULT');
      expect(getLoadable(mySelector).contents).toEqual('DEFAULT');
      set(mySelector, 'INITIALIZE');
      expect(getLoadable(myAtom).contents).toEqual('INITIALIZE');
      expect(getLoadable(mySelector).contents).toEqual('INITIALIZE');
    }

    const container = document.createElement('div');
    act(() => {
      ReactDOM.render(
        <RecoilRoot initializeState={initializeState}>
          <ReadsAtom atom={myAtom} />
          <ReadsAtom atom={mySelector} />
        </RecoilRoot>,
        container,
      );
    });

    expect(container.textContent).toEqual('"INITIALIZE""INITIALIZE"');
  });

  test('initialize with nested store', () => {
    const GetStore = ({children}: {children: Store => React.Node}) => {
      return children(useStoreRef().current);
    };

    const container = document.createElement('div');
    act(() => {
      ReactDOM.render(
        <RecoilRoot>
          <GetStore>
            {storeA => (
              <RecoilRoot store_INTERNAL={storeA}>
                <GetStore>
                  {storeB => {
                    expect(storeA === storeB).toBe(true);
                    return 'NESTED_ROOT/';
                  }}
                </GetStore>
              </RecoilRoot>
            )}
          </GetStore>
          ROOT
        </RecoilRoot>,
        container,
      );
    });

    expect(container.textContent).toEqual('NESTED_ROOT/ROOT');
  });
});

test('Impure state updater functions that trigger atom updates are detected', () => {
  // This test ensures that we throw a clean error rather than mysterious breakage
  // if the user supplies a state updater function that triggers another update
  // within its execution. These state updater functions are supposed to be pure.
  // We can't detect all forms of impurity but this one in particular will make
  // Recoil break, so we detect it and throw an error.

  const atomA = atom({
    key: 'RecoilRoot/impureUpdater/a',
    default: 0,
  });
  const atomB = atom({
    key: 'RecoilRoot/impureUpdater/b',
    default: 0,
  });

  let update;
  function Component() {
    const updateA = useSetRecoilState(atomA);
    const updateB = useSetRecoilState(atomB);
    update = () => {
      updateA(() => {
        updateB(1);
        return 1;
      });
    };
  }

  renderElements(<Component />);
  expect(() =>
    act(() => {
      update();
    }),
  ).toThrow('pure function');
});
