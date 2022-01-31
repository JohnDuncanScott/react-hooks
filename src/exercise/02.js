// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Custom hook
function useLocalStorageState(
    key,
    defaultValue = "",
    // the = {} fixes the error we would get from destructuring when no argument was passed
    // Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
    { serialize = JSON.stringify, deserialize = JSON.parse } = {}) {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key);

    if (localStorageValue) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place
      try {
        return deserialize(localStorageValue);
      } catch (error) {
        window.localStorage.removeItem(key);
      }
    }

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  })

  const previousKeyRef = React.useRef(key);

  React.useEffect(() => {
    const previousKey = previousKeyRef.current;

    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey);
    }

    previousKeyRef.current = key;
    window.localStorage.setItem(key, serialize(value));
  }, [key, value, serialize]);

  return [value, setValue];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState("name", initialName);

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="<Enter name>" />
}

export default App
