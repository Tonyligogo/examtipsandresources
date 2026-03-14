import { supabase } from "@/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({children}:{children:React.ReactNode}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const getSession = async () =>{
        const { data: { user } } = await supabase.auth.getUser()
        setAuthenticated(!!user);
        setLoading(false);        
    }
    getSession();
  },[]);
  console.log(loading)

    if(loading){
        return <Loader2 className="animate-spin" />;
    }else{
        if(!authenticated){
            return <Navigate to="/login" />;
        }
        return <>{children}</>;
    }
};
export default AuthWrapper