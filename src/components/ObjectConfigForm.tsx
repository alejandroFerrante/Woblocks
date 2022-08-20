import {useState} from "react"
import { Component } from "react"


export default function ObjectConfigForm(props:any){

    //SLIDER FUNCTIONS/////////////////////////
    const onVisualModeChange = (event:any) => {
        props.setVisualMode(event.target.checked);
    }

    const setIndex = function(anIndex:any){
        props.setSliderIndex(anIndex);
    }

    const onNameChange = function(event:any){
        props.setChosenName(event.target.value);
    }
    ///////////////////////////////////////////


    //STYLES///////////////////////////////////    
    const cellStyle = {paddingLeft:"10%"};
    ///////////////////////////////////////////

    //console.log('ObjectConfigForm props.visualMode:'+props.visualMode+' props.sliderIndex:'+props.sliderIndex);

    return <>
        <br/>
        { props.editName && <div style={cellStyle} >  Nombre <input onChange={onNameChange} /> </div> }
        <br/>
        { (props.visualMode) && <div style={cellStyle} >es visual? <input onChange={onVisualModeChange}   checked type="checkbox" /> </div>}
        { (!props.visualMode) && <div style={cellStyle} >es visual? <input onChange={onVisualModeChange}   type="checkbox" /> </div>} 
        <br/>
        <div style={cellStyle}><Slider slides={props.representations} isVisual={props.visualMode} index={props.sliderIndex} setSliderIndex={setIndex} /> </div>
    </>
    
}

export function Slider(props:any){

    const currentSlides = props.slides.filter(function(elem:any){return (!props.isVisual) || (elem.isVisual == true)});
    if(props.index > currentSlides.length - 1){props.setSliderIndex(0);}

    const nextIndex = () => {
        if(props.index == currentSlides.length - 1){//if(currentIndex == currentSlides.length - 1){
            props.setSliderIndex(0);//setCurrentIndex(0);
        }else{
            props.setSliderIndex(props.index + 1);//setCurrentIndex(currentIndex + 1);
        }    
    }

    const previousIndex = () => {
        if(props.index == 0 ){//if(currentIndex == 0 ){
            props.setSliderIndex(currentSlides.length - 1);//setCurrentIndex(currentSlides.length - 1);
        }else{
            props.setSliderIndex(props.index - 1);//setCurrentIndex(currentIndex - 1);
        }    
    }

    //STYLES///////////////////////////////////
    const containerStyles = {
        width: "950px",
        height: "600px",
        margin: "0 auto",
        paddingLeft:"5%"
    }

    const sliderStyle = {
        height: "100%",
        position: "relative"
    }

    const slideStyle = {
        width: "60%",
        height: "60%",
        boarderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover"
    }
    ///////////////////////////////////////////

    return <>
        <div style={containerStyles} >
            Representacion: <label>{currentSlides[props.index].name}</label>
            <table>
              
              <tr>
                <td><div onClick={previousIndex}> {'<'} </div></td>
                
                <td><div style={slideStyle} > 

                    {props.isVisual && <div>
                        <img style={{width:"40px",height:"40px"}} src={currentSlides[props.index].icon}  />
                        <img style={{width:"140px",height:"140px"}} src={currentSlides[props.index].url} />
                    </div>}

                    
                    {!props.isVisual && <div>
                        <img style={{width:"140px",height:"140px"}} src={currentSlides[props.index].icon} />
                    </div>}

                </div></td>
               
                <td><div onClick={nextIndex}> {'>'} </div></td>
               
               </tr>

            </table>

        </div>
    </>

}