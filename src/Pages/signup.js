import { signInWithGooglePopup } from "../firebase"
import 'bootstrap/dist/css/bootstrap.css'
import { useNavigate } from "react-router-dom";


export default function SignUp(){
    const navigate = useNavigate();
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        const username = response.user.displayName;
        const image = response.user.photoURL;
        const email = response.user.email;
        navigate("/", {state : {name : username, src : image, email : email}});
    }
    return (  
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="card container-sm w-25 mt-5">
                <div className="card-header">Sign in to access</div>
                <div className="card-body">
                    <h5 className="card-title">Let'sVOTE</h5>
                    <p className="card-text">An online voting platform </p>
                    <p className="card-text"> Modernizing Democracy with Secure and Accessible Online Voting.</p>
                    <a onClick={logGoogleUser} class="btn btn-primary" data-mdb-ripple-init>Sign In With Google</a>
                </div>
            </div> 
        </div>   
    )
}