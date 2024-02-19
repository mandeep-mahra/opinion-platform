import Navbar from "./navbar";
import SignUp from "./signup";
import {useLocation, useNavigate} from 'react-router-dom';
import { useState } from "react";
import { uploadPayload, uploadUserImage } from "../firebase";

function ContentAdder( props ){
    const navigate = useNavigate();
    const [count, getcount] = useState([]);
    const [heading, setHeading] = useState("Vote for any one...");


    function getOptions(e, currOptionName, currURL){
        e.preventDefault();
        getcount((currCount) => {
            currCount = [...currCount, {
                id : crypto.randomUUID(),
                data : {
                    optionName : currOptionName,
                    optionURL : currURL,
                },
            }]
            return currCount;
        });        
    }

    function handleDelete(e, id){
        e.preventDefault();
        getcount((curr)=>{
            return curr.filter(temp => temp.id !== id);
        })
    }

    function updateOpt(e, id){
        e.preventDefault();
        getcount((currCount) => {
            currCount.forEach(option => {
                if(option.id == id)
                    option.data.optionName = e.target.value;
            });
            return currCount;
        });   
        
    }
    function updateURL(e, id){
        e.preventDefault();
        uploadUserImage(e.target.files[0]).then((res) => {
            getcount((currCount) => {
                currCount.forEach(option => {
                    if(option.id == id)
                        option.data.optionURL = res;
                });
                return currCount;
            });  
        })      
    }

    function submitPost(e){
        e.preventDefault();
        const payload = {
            uploader : props.name,
            data : count,
            head : heading,
            votes : {},
        }
        uploadPayload(payload);
        navigate("/", {state : {name : props.name, src : props.url}})
    }

    return (
        <div className="container-sm shadow-lg bg-light w-75 mt-2 p-5 start-50 d-flex flex-row align-items-center justify-content-center">
            <div className = "w-100 ">
                <h2>Create a Poll</h2>
                <form>            
                    <div className="form-group">
                        <label for="title">Title</label>
                        <input onChange={(e)=>{setHeading(e.target.value)}} type="text-field" className="form-control" id="title" placeholder="Vote for one.."/>    
                        {
                            count.map((curr) => (
                                <div key = {curr.id} className="container-sm shadow-lg mt-4 p-3 form-group">
                                    <p>Option Description</p>
                                    <input onChange={(e)=>updateOpt(e, curr.id)} className = "form-control mt-2" type = "text" placeholder = "Option Name"></input>
                                    <input onChange={(e)=>updateURL(e, curr.id)} className = "form-control mt-2" type="file" accept="image/*"></input>
                                    <button onClick={(e)=>handleDelete(e, curr.id)} className="btn btn-sm btn-danger mt-2">Delete</button>
                                </div>
                            ))
                        }
                    </div>
                    <button onClick={(e) => getOptions(e)} type="button" className="w-100 float-end btn btn-secondary btn-block mt-5">+</button>          
                    <button onClick={(e) => submitPost(e)} type="Submit" className="w-100 btn btn-primary btn-block mt-2">Post</button>          
                </form>        
            </div>
        </div>
    )
}

export default function UploadPost(){
    const location = useLocation();

    if(location.state == null)
        return <SignUp/>;
    const name = location.state.name;
    const url = location.state.src;

    return (
        <>
            <Navbar name = {name} url = {url} page = {"home"} />
            <div className = "container bg-light mt-5 p-5 start-50 d-flex flex-row align-items-center justify-content-center">
                <ContentAdder name = {name}/>
            </div>
        </>
    )
}
