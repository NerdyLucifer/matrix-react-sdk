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

import { MutableRefObject, useCallback, useEffect, useRef } from "react";

import useFocus from "../../../../../hooks/useFocus";
import { setSelection } from "../utils/selection";

type SubSelection = Pick<Selection, 'anchorNode' | 'anchorOffset' | 'focusNode' | 'focusOffset'>;

function setSelectionRef(selectionRef: MutableRefObject<SubSelection>) {
    const selection = document.getSelection();

    if (selection) {
        selectionRef.current = {
            anchorNode: selection.anchorNode,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode,
            focusOffset: selection.focusOffset,
        };
    }
}

export function useSelection() {
    const selectionRef = useRef<SubSelection>({
        anchorNode: null,
        anchorOffset: 0,
        focusNode: null,
        focusOffset: 0,
    });
    const [isFocused, focusProps] = useFocus();

    useEffect(() => {
        function onSelectionChange() {
            setSelectionRef(selectionRef);
        }

        if (isFocused) {
            document.addEventListener('selectionchange', onSelectionChange);
        }

        return () => document.removeEventListener('selectionchange', onSelectionChange);
    }, [isFocused]);

    const onInput = useCallback(() => {
        setSelectionRef(selectionRef);
    }, []);

    const selectPreviousSelection = useCallback(() => {
        setSelection(selectionRef.current);
    }, []);

    return { ...focusProps, selectPreviousSelection, onInput };
}
