import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { addHint } from "../utils";

const PopupBase = styled.div`
    background-color: white;
    border: 1px solid black;
    padding: 10px;

    display: flex;
    flex-direction: column;

    textarea {
        width: 400px;
        height: 100px;
        margin-bottom: 2px;
    }

    button {
        flex-grow: 1;
    }
`;

export function SKUHintPopup(props: { initial?: string; onClose: () => void }) {
  const [v, setV] = useState(props.initial ?? "");

  const textBoxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textBoxRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, []);

  async function onSave() {
    await addHint(v);

    props.onClose();
  }

  return (
    <PopupBase>
      <textarea
        ref={textBoxRef}
        value={v}
        onChange={(x) => setV(x.target.value)}
      ></textarea>
      <div style={{ display: "flex" }}>
        <button onClick={onSave}>Add</button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </PopupBase>
  );
}
