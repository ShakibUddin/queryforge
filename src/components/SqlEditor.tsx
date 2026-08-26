import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function SqlEditor({ value, onChange }: SqlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        sql(),
        oneDark,

        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div
      ref={editorRef}
      style={{
        border: "1px solid #444",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    />
  );
}

export default SqlEditor;
