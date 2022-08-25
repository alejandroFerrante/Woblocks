import { AppBar, Dialog, DialogProps, Toolbar, Typography,Button } from '@material-ui/core'
import {WarningRounded} from '@material-ui/icons'
import {useState, useContext} from 'react';

import WBContext from '../WBContext'

import { useTheme } from '@material-ui/core/styles';

export default function AlertModal(){


	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

    const theme = useTheme();

	const closeModalFunc = function(){
		globalState.alertState.isOpen = false;
		setGlobalState(globalState);
		valSetter( (val+1) % 2 );
	}

	const onAlertRendered = function(aDiv:any){
		console.log('onAlertRendered '+aDiv);
		if(aDiv){
			aDiv.innerHTML = globalState.alertState.body;
		}
	}

	return <>
	<Dialog onClick={() => {if(globalState.alertState.mode == 'WARNING'){closeModalFunc()} } } open={globalState.alertState.isOpen} fullWidth  maxWidth="sm" >
	    <AppBar position="static">
	    	<Typography>
	    		<b><div style={{textAlign:"center"}}>{globalState.alertState.title}</div></b>
	    	</Typography>
	    </AppBar>
	    <div style={{textAlign:"center"}}>
	    	<WarningRounded style={{width:"80px", height:"80px"}} />

	    <br/>
	    </ div>
	    <div style={{alignSelf:"center",paddingLeft:"5%",overflow:"auto",textAlign:"center",width:"80%"}} ref={onAlertRendered} ></div>
	    <br/>
	    <br/>
	    {	(globalState.alertState.mode == 'CONFIRM') &&
		    <table style={{borderSpacing:"10px 20px"}} ><tr style={{textAlign:"center"}}>
			    <td >
			    	<Button variant="outlined"  onClick={closeModalFunc} style={{backgroundColor:theme.palette.error.main}} ><b>No</b></Button>
			    </td>
			    <td >
			    	<Button variant="contained" onClick={()=>{globalState.alertState.onModalConrirm();closeModalFunc();}} style={{backgroundColor:theme.palette.success.main}} ><b>Si</b></Button>
			    </td>
		    </tr></table>
		}
	    
    </Dialog>
    </>

}
