import { createTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import BlocklyWoblocks from './components/BlocklyWoblocks';
import { HeaderContent } from './components/HeaderContent';
import { WollokObject } from './models/WollokObject';

class AppState {
  wollokObjects: WollokObject[] = []

  addWollokObject(wo: WollokObject): void {
    
  }
}

export const AppContext = React.createContext({} as AppState)

function App() {
  // initial global state
  const appState: AppState = new AppState()

  const theme = createTheme({
    
    palette: {
      primary: {
        main: "#A6204C"
      },
      secondary: {
        main: "#DA2028"
      }
    }
  })

  return (
    <AppContext.Provider value={appState}>
      <ThemeProvider theme={theme}>
        <HeaderContent />
        <BlocklyWoblocks />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
