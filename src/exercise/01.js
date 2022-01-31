// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Greeting({initialName}) {
  const [name, setName] = React.useState(initialName);

  function handleChange(event) {
    let name = event.target.value;

    if (!name) {
      name = initialName;
    }

    setName(name);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="<Type your name>" />
}

export default App
