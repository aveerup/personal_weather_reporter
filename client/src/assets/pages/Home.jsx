import { useState } from "react"
import api from "../services/Axios.js"
import { IoSend } from "react-icons/io5";

export const Home = ()=>{
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")

    const sendPrompt = async ()=>{
        let res = await api.post("/home",{"prompt":prompt})
        console.log(res)
        setResponse(res.data["response"])
    }

    return(
        <>
            <div className="bg-amber-200 min-h-[100vh] min-w-[100vw] flex flex-col items-center">
                <div className="w-full flex justify-center items-center m-6" >
                    <div className="w-[80%] flex justify-center">
                        <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="bg-white h-10 w-[95%] text-center rounded-2xl text-gray-600 outline-none focus:border-2 focus:border-amber-500" type="text" placeholder="Ask your weather-buddy!!" />
                    </div>
                    <div onClick={sendPrompt} className="w-[10%] flex flex-wrap items-center ml-4 mr-4 text-3xl hover:text-4xl">
                        <IoSend className="m-auto block text-center text-amber-900"/>
                    </div>
                </div>
                    {response != ""?
                        <div className="m-6 bg-amber-700 p-4 rounded-2xl">
                            {response}
                        </div>:
                        <></>
                    }
                </div>
        </>
    )
}