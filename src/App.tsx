import { createTheme, ThemeProvider } from '@material-ui/core';
import React , {useState} from 'react';
import './App.css';
import BlocklyWoblocks from './components/BlocklyWoblocks';
import { WollokObject } from './models/WollokObject';
import { HeaderContent } from './components/HeaderContent';

import Blockly from 'blockly'

import WollokIcon from "./components/WollokIcon"

import {WBProvider} from './WBContext'

import ModalWindow from './components/ModalWindow'

import woblocksControl from './models/woblocksControl'
import {imagePathManager, getIconPathFor, getRepIconFor, getAllSprites} from './ImagePathManager'

import AlertModal from './components/AlertModal'

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
    modalState:'CLOSED',
    currentTabIndex:0,
    tabObjects: [{name:'Escena', icon:'wollokBW'}],
    gameWidth:20,
    gameHeight:20,
    gameBackgroundImage:'',
    wkImages:wkImages,
    wkGame:null,
    alertState:{ isOpen:false,title:'',body:'' as any, mode:'',onModalConrirm:()=>{}}
  }); 

  const [myVal,setMyVal] = useState(0);////////TEST

  const theme = createTheme({
    
    palette: {
      primary: {
        main: "#A6204C"
      },
      secondary: {
        main: "#DA2028"
      },
      error:{
        main:"#ab8585"
      },
      success:{
        main:"#94ab85"
      }

    }
  })


/*
  HeaderContent:   HOLDS TABS AND BUTTONS
  ModalWindow:     HOLDS THE MODALS (Save project, Load Project, New Object, Game Config)  
  BlocklyWoblocks: HOLDS THE BLOCKLY WORKSPACE
*/
  return (
    <AppContext.Provider value={ appState }>
      <ThemeProvider theme={theme}>
      <WBProvider state={myAppState} stateSetter={setMyAppStateFunc} /*this part only for testing -->*/ val={myVal} valSetter={setMyVal} >
        <>
          <AlertModal />
          <HeaderContent />
          <ModalWindow />
          <BlocklyWoblocks />
        </>
        </ WBProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
