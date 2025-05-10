import { useState } from "react"
import api from "../services/Axios.js"
import { IoSend } from "react-icons/io5";

export const Home = ()=>{
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")

    const sendPrompt = async ()=>{
        // res = await api.post("/home",{"prompt":prompt})
        // console.log(res)
        setResponse("response is gonna be here")
    }

    return(
        <>
            <div className="bg-amber-200 min-h-[100vh] min-w-[100vw] flex flex-col items-center">
                <div className="w-full flex justify-center items-center m-6" >
                    <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="bg-white h-10 w-140 text-center rounded-2xl text-gray-600 outline-none focus:border-2 focus:border-amber-500" type="text" placeholder="Ask your weather-buddy!!" />
                    <div onClick={sendPrompt} className="flex flex-wrap items-center ml-4 mr-4 text-2xl hover:text-3xl"><IoSend className="m-auto block text-center text-amber-900"/></div>
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