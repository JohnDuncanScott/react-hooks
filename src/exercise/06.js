// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonForm} from "../pokemon";

// Replace custom ErrorBoundary with the react-error-boundary one
// class ErrorBoundary extends React.Component {
//   state = { error: null };

//   static getDerivedStateFromError(error) {
//     return { error };
//   }

//   render() {
//     const {error} = this.state;

//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }

function PokemonInfo({ pokemonName }) {
  const [componentData, setComponentData] = React.useState({
    // This ternary prevents unnecessary state switches where one state will render for fractions of a second before the final one is rendered
    status: pokemonName ? "pending" : "idle",
    pokemon: null,
    error: null
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    // Note that in this case the object won't actually have pokemon or error fields, so be careful when doing this
    setComponentData({ status: "pending" });
    
    fetchPokemon(pokemonName)
      .then(pokemonResult => {
        setComponentData({ status: "resolved", pokemon: pokemonResult });
      })
      .catch(error =>  {
        setComponentData({ status: "rejected", error });
      });
  }, [pokemonName]);

  switch (componentData.status) {
    case "rejected": {
      // Handled by an error boundary
      throw componentData.error;
    }

    case "idle": {
      return "Submit a pokemon";
    }

    case "pending": {
      return <PokemonInfoFallback name={pokemonName} />;
    }

    case "resolved": {
      return <PokemonDataView pokemon={componentData.pokemon} />;
    }

    default: {
      throw new Error(`Unhandled render state: ${componentData}`);
    }
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{" "}
      <pre style={{whiteSpace: "normal"}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName("");
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* Use pokemonName as key so can recover from error - will trigger an unmount / mount.
        However a better way is to use onReset as shown in the next line. Strictly speaking, could just use
        resetKeys without giving the user the "Try again" button */}
        {/* <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}> */}
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
