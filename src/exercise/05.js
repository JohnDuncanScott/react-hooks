// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt';

function Tilt({children}) {
  const tiltRef = React.useRef();

  React.useEffect(
    () => {
      const tiltNode = tiltRef.current;

      VanillaTilt.init(tiltNode, {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.5,
      });

      // Cleanup
      return () => tiltNode.vanillaTilt.destroy();
    },
    // Performance optimisation - only care about mount and unmount, all other state changes are irrelevant to us
    []);

  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export default App;
