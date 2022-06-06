import { useState, createContext } from 'react';
import { EmotePicker } from './EmotePicker';
import { TextInput } from './TextInput';

export const CountContext = createContext<number>(0);

function App() {
  const [count] = useState(0);

  return (
    <CountContext.Provider value={count}>
      <div style={{ width: '100%', maxWidth: '960px', margin: '24px auto' }}>
        <TextInput />
      </div>
    </CountContext.Provider>
  );
}

export default App;
