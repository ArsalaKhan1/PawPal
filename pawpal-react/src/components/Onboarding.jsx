import Button from "./Button";
import { Link } from "react-router-dom";

function Onboarding (){
    return(
    <section className="Onboarding-opt">

    <h3>Ready to get started?</h3>
    <p>Create an account or log in to start managing your pets.</p>
    <div>
        <Link to="/register">
            <Button>Create Account</Button>
        </Link>
        <Link to="/login">
            <Button>Login</Button>
        </Link>
    </div>
    </section>
    );
}

export default Onboarding;