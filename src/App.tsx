import { createTheme, ThemeProvider } from '@material-ui/core';
import React , {useState} from 'react';
import './App.css';
import BlocklyWoblocks from './components/BlocklyWoblocks';
import { WollokObject } from './models/WollokObject';
import HeaderContent from './components/HeaderContent';

import Blockly from 'blockly'

import WollokIcon from "./components/WollokIcon"

import {WBProvider} from './WBContext'

import woblocksControl from './models/woblocksControl'
import {imagePathManager, getIconPathFor, getRepIconFor, getAllSprites} from './ImagePathManager'

declare module '@material-ui/styles' {
  interface SimplePaletteColorOptions {
    magic: string
  }
}

class AppState {
  wollokObjects: WollokObject[] = []

  addWollokObject(wo: WollokObject): void {
    
  }
}

export const AppContext = React.createContext({} as AppState)

function App() {

  // initial global state
  const appState: AppState = new AppState(); 

  const setMyAppStateFunc = (newVal:any) =>{ /*console.log('setMyAppStateFunc');*/ setMyAppState(newVal); }

  //LOAD IMAGES
  var wkImages:any[] = [];
  woblocksControl.LoadGivenImagesInto( getAllSprites() ,wkImages) ;

  //INIT STATE
  const [myAppState,setMyAppState] = useState({
    /* GENERAL*/
    currentTabIndex:0,
    tabObjects: [{name:'Escena', icon:'wollokBW'}],
    gameWidth:20,
    gameHeight:20,
    gameBackgroundImage:'',
    wkImages:wkImages,
    wkGame:null,

    /* LOAD PROJECT*/
    proposedLoadFile:null,
    /* SAVE PROJECT*/
    proposedSaveName:'',
    /* GAME CONFIG*/
    proposedWidth:20,
    proposedHeight:20,
    proposedBackgroundIndex:0,
    /* NEW OBJECT*/
    proposedNewObjName:'',
    proposedNewObjIsVisual:false,
    selectedRepresentation: imagePathManager.representations[0]

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

/*
  HeaderContent:   HOLDS TABS AND BUTTONS
  BlocklyWoblocks: HOLDS THE BLOCKLY WORKSPACE
*/
  return (
    <AppContext.Provider value={ appState }>
      <ThemeProvider theme={theme}>
      <WBProvider state={myAppState} stateSetter={setMyAppStateFunc} /*this part only for testing -->*/ val={myVal} valSetter={setMyVal} >
        <>
          <HeaderContent />
          <BlocklyWoblocks />
        </>
        </ WBProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;