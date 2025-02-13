/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { useEffect } from "react";

const DEBOUNCE_TIMEOUT = 100;

export function useDebouncedCallback<T extends any[]>(
    enabled: boolean,
    callback: (...params: T) => void,
    params: T,
) {
    useEffect(() => {
        let handle: number | null = null;
        const doSearch = () => {
            handle = null;
            callback(...params);
        };
        if (enabled !== false) {
            handle = window.setTimeout(doSearch, DEBOUNCE_TIMEOUT);
            return () => {
                if (handle) {
                    clearTimeout(handle);
                }
            };
        }
    }, [enabled, callback, params]);
}
