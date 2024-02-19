import Navbar from "./navbar"
import SignUp from "./signup";
import {useLocation} from 'react-router-dom';
import VotingCard from './votingcard'
import React, { useEffect, useState } from 'react';
import { downloadData, updateData } from "../firebase";

export default function Home(){
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    
    useEffect(()=>{
        downloadData().then((res)=>{
            (res.docs).map((post) => {
                const reqData = post._document.data.value.mapValue.fields; 
                const options = reqData.data.arrayValue.values;
                const heading = reqData.head.stringValue;
                const uploader = reqData.uploader.stringValue;
                const votes = reqData.votes.integerValue;
                const id = post.id;
                console.log(id);
                setPosts((currPost) => {
                    currPost = [
                        ...currPost,
                        {
                            options : options,
                            heading : heading,
                            uploader : uploader,
                            votes : votes,
                            id : id,
                        }
                    ];
                    return currPost;
                })
            });
        })
    },[])

    if(location.state == null)
        return <SignUp/>;
    const name = location.state.name;
    const url = location.state.src;
    const email = location.state.email;

    return (
        <>
            <Navbar name = {name} url = {url} page = {"posts"}/>
            {
                posts.map((post) => (
                    <>
                        <VotingCard 
                            heading = {post.heading} 
                            uploader = {post.uploader} 
                            options = {post.options}
                            id = {post.id}
                            email = {email}
                        />;
                    </>
                ))
            }          
        </>
    )
}