import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch=(cb,options={})=>{
    const [data,setData] = useState(undefined)
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const {getToken} = useAuth()

    const fn = async(...args)=>{
        console.log("useFetch called with args:", args);
        setLoading(true)
        setError(null)

        try{
            const supabaseAccessToken = await getToken({
              template: "supabase",
            });
            const response = await cb(supabaseAccessToken,options,...args)
            console.log(response)
            setData(response)
            setError(null)
            setLoading(false)
        }catch(error){
            setError(error)
            console.error("Error Occurred",error)
        }finally{
            setLoading(false)
        }
    } 
    return {fn,data,loading,error}   
}

export default useFetch;