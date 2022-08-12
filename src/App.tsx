import { createTheme, ThemeProvider } from '@material-ui/core';
import React , {useState} from 'react';
import './App.css';
import BlocklyWoblocks from './components/BlocklyWoblocks';
import { WollokObject } from './models/WollokObject';
import WoblocksController from './components/WoblocksController';
import { HeaderContent } from './components/HeaderContent';

import WollokIcon from "./components/WollokIcon"

import {WBProvider} from './WBContext'

import ModalWindow from './components/ModalWindow'

import MyContextButton from './components/MyContextButton'////////TEST

class AppState {
  wollokObjects: WollokObject[] = []

  addWollokObject(wo: WollokObject): void {
    
  }
  tst:string = "foo"
  setTst = (newVal:string) => {this.tst = newVal;console.log('setTst>> this.tst:'+this.tst);}
}

export const AppContext = React.createContext({} as AppState)

function App() {
  // initial global state
  const appState: AppState = new AppState(); 

  console.log("APP called");

  const setMyAppStateFunc = (newVal:any) =>{ console.log('setMyAppStateFunc'); setMyAppState(newVal); }

  const [myAppState,setMyAppState] = useState({
    modalState:'CLOSED',
    currentTabIndex:0,
    tabObjects: [{name:'scene', icon:'wkIcon'}],
    xmlSceneContent : '',
    objectsInfoMap : {}
  }); 

  const [myVal,setMyVal] = useState(0);////////TEST

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
    <AppContext.Provider value={ appState }>
      <ThemeProvider theme={theme}>
      <WBProvider state={myAppState} stateSetter={setMyAppStateFunc} /*this part only for testing -->*/ val={myVal} valSetter={setMyVal} >
        <>
          <HeaderContent />
          <MyContextButton />      
          
          {'myVal:'+myVal}<br/>
          {'myAppState.modalState:'+myAppState.modalState}<br/>
          
          
        </>
        </ WBProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}


export default App;
