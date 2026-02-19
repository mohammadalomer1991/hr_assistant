import { useEffect, useState } from "react";
import { fetchData } from "./api/bedrock";
const SandBox= () =>{
const [answer, setAnswer]= useState<string>('')
    useEffect(() => {
      const question='たばこの吸うところはどこですか'
      fetchData(question).then(setAnswer);
      
    }, []);

    return <>
        <p>{answer}</p>
        </>
}

export default SandBox