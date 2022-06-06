import { useMemo, useState } from 'react';
import { emoteData } from './parseText';

interface EmotePickerProps {
  onSelect: (emote: { id: string; codes: string[] }) => void;
}

export const EmotePicker: React.FC<EmotePickerProps> = ({ onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState<undefined | number>(0);
  const emoteList = useMemo(() => Object.entries(emoteData), []);
  const handleSelect = () => {
    if (typeof focusedIndex !== 'undefined') {
      onSelect({
        id: emoteList[focusedIndex][0],
        codes: emoteList[focusedIndex][1].codes,
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        width: 360,
        justifyContent: 'space-between',
        borderRadius: '12px',
        padding: '8px',
        border: '2px solid black',
        backgroundColor: 'white',
      }}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.code === 'ArrowDown') {
          setFocusedIndex((index) => {
            if (typeof index === 'undefined') return 0;
            if (index === emoteList.length - 1) {
              return 0;
            }
            return index + 1;
          });
        } else if (e.code === 'ArrowUp') {
          setFocusedIndex((index) => {
            if (typeof index === 'undefined') return 0;
            if (index === 0) {
              return emoteList.length - 1;
            }
            return index - 1;
          });
        } else if (e.code === 'Enter') {
          handleSelect();
        }
      }}
      onBlur={() => setFocusedIndex(undefined)}
    >
      {emoteList.map(([id, { codes }], index) => (
        <div
          key={id}
          style={{
            height: 24,
            borderRadius: '4px',
            padding: '2px',
            backgroundColor: focusedIndex === index ? '#ccc' : 'unset',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setFocusedIndex(index)}
          onClick={() => handleSelect()}
        >
          <img
            src={`https://raw.githubusercontent.com/redphx/yahoo-messenger-emoticons-for-facebook/master/emoticons/${id}.gif`}
            style={{ display: 'block', height: '100%', width: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
};
