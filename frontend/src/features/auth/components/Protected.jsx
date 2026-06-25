import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import react from "react";

function Protected({children}) {
    const { authChecking, user } = useAuth();

    if(authChecking){
        return <LoadingSpinner />
    }

    if(!user){
        return <Navigate to="/" />
    }

    return (
        <>
            {children}
        </>
    )
}

export default Protected;