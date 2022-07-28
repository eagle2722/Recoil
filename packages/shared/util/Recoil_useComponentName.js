/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall recoil
 */
'use strict';

/**
 * THIS CODE HAS BEEN COMMENTED OUT INTENTIONALLY
 *
 * This technique of getting the component name is imperfect, since it both only
 * works in a non-minified code base, and more importantly introduces performance
 * problems since it relies in throwing errors which is an expensive operation.
 *
 * At some point we may want to reevaluate this technique hence why we have commented
 * this code out, rather than delete it all together.
 */

// const {useRef} = require('react');
// const gkx = require('recoil-shared/util/Recoil_gkx');
// const stackTraceParser = require('recoil-shared/util/Recoil_stackTraceParser');

function useComponentName(): string {
  // const nameRef = useRef();
  // if (__DEV__) {
  //   if (gkx('recoil_infer_component_names')) {
  //     if (nameRef.current === undefined) {
  //       // There is no blessed way to determine the calling React component from
  //       // within a hook. This hack uses the fact that hooks must start with 'use'
  //       // and that hooks are either called by React Components or other hooks. It
  //       // follows therefore, that to find the calling component, you simply need
  //       // to look down the stack and find the first function which doesn't start
  //       // with 'use'. We are only enabling this in dev for now, since once the
  //       // codebase is minified, the naming assumptions no longer hold true.

  //       // eslint-disable-next-line fb-www/no-new-error
  //       const frames = stackTraceParser(new Error().stack);
  //       for (const {methodName} of frames) {
  //         // I observed cases where the frame was of the form 'Object.useXXX'
  //         // hence why I'm searching for hooks following a word boundary
  //         if (!methodName.match(/\buse[^\b]+$/)) {
  //           return (nameRef.current = methodName);
  //         }
  //       }
  //       nameRef.current = null;
  //     }
  //     return nameRef.current ?? '<unable to determine component name>';
  //   }
  // }
  // @fb-only: return "<component name only available when both in dev mode and when passing GK 'recoil_infer_component_names'>";
  return '<component name not available>'; // @oss-only
}

module.exports = useComponentName;
