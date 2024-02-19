import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import SignUp from './signup';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function NavbarComponent(props){
    const navigate = useNavigate();
    if(!props)
        return <SignUp />
    function bringPost(){
        if(props.page == "home")
            navigate("/", {state : {name : props.name, src : props.url}})
        else
            navigate("/newpost", {state : {name : props.name, src : props.url}})
    }
    function goHome(){
        
        navigate("/", {state : {name : props.name, src : props.url}})
    }
    return(
        <Navbar bg="dark" className="bg-body-secondary mb-5 navbar-fixed-top">
        <Container className = "container-fluid">
            <h4 role="button" calssName = "pe-auto" onClick={goHome}>Let'sVOTE</h4>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>             
                <img className = "rounded me-2" width = "25" src = {props.url}/>                
                {props.name} 
            </Navbar.Text>
            
            <NavLink className = "ms-4"> 
                <button className = "btn btn-primary" onClick={bringPost}>
                    {props.page}
                </button>
            </NavLink>
            <NavLink className = "ms-4"> 
                <button className = "btn btn-danger">    
                    <Link className = "text-decoration-none text-reset" to = "/signup">LogOut</Link>
                </button>
            </NavLink>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}