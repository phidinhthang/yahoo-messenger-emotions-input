import React, { useState, useContext, useLayoutEffect } from 'react';
import { createEditor, Descendant, Editor, Text, Transforms } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { CountContext } from './App';
import { EmotePicker } from './EmotePicker';
import { emoteMap, parseText } from './parseText';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

type Token = {
  type: string;
  value: string;
  raw: string;
};

const getLength = (token: Token | string) => {
  if (typeof token === 'string') {
    return token.length;
  }
  return token.raw.length;
};

const withYahooEmoticon = (editor: Editor) => {
  const { normalizeNode, isVoid } = editor;

  editor.isVoid = (element) =>
    element.type === 'emote' ? true : isVoid(element);
  editor.isInline = (element) =>
    element.type === 'emote' ? true : isVoid(element);

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Text.isText(node)) {
      const text = node.text;
      const tokens = parseText(text);
      let start = 0;
      let stop = false;

      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== 'string') {
          if (token.type === 'emote' && !stop) {
            Transforms.select(editor, {
              anchor: { path, offset: start },
              focus: { path, offset: end },
            });
            Transforms.insertNodes(editor, [
              {
                type: 'emote',
                children: [{ text: '' }],
                id: emoteMap[token.value],
              },
              { text: ' ' },
            ]);
          }
        }
        start = end;
      }
    }
    return normalizeNode(entry);
  };
  return editor;
};

export const TextInput: React.FC<{}> = () => {
  const editor = React.useMemo(
    () => withYahooEmoticon(withReact(createEditor())),
    []
  );
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  useContext(CountContext);

  useLayoutEffect(() => {
    ReactEditor.focus(editor);
  }, [editor]);

  return (
    <div
      style={{
        border: '2px solid black',
        padding: '8px 12px',
        display: 'flex',
        gap: 4,
        position: 'relative',
        borderRadius: '12px',
      }}
    >
      <Slate value={initialValue} editor={editor}>
        <Editable
          placeholder='Write something...'
          spellCheck={false}
          style={{ flexGrow: 1 }}
          renderElement={(props) => {
            const { element, attributes, children } = props;

            switch (element.type) {
              case 'emote':
                return (
                  <span {...attributes}>
                    <img
                      src={`https://raw.githubusercontent.com/redphx/yahoo-messenger-emoticons-for-facebook/master/emoticons/${element.id}.gif`}
                      style={{ transform: 'translateY(2px)', marginTop: -2 }}
                    />
                    {children}
                  </span>
                );
              default:
                return (
                  <p
                    {...attributes}
                    style={{ margin: '0px', lineHeight: '1.2' }}
                  >
                    {children}
                  </p>
                );
            }
          }}
          renderLeaf={(props) => {
            const { attributes, children } = props;
            return <span {...attributes}>{children}</span>;
          }}
        />
      </Slate>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setShowEmotePicker((show) => !show);
        }}
      >
        <img src='https://raw.githubusercontent.com/redphx/yahoo-messenger-emoticons-for-facebook/master/emoticons/1.gif' />
      </div>
      {showEmotePicker ? (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '-4px',
          }}
        >
          <EmotePicker
            onSelect={(emote) => {
              Transforms.insertNodes(editor, [
                { type: 'emote', children: [{ text: '' }], id: emote.id },
                { text: ' ' },
              ]);
              setShowEmotePicker(false);
              ReactEditor.focus(editor);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
