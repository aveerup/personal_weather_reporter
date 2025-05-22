import { useRef, useState } from "react"
import api from "../services/Axios.js"
import { IoSend } from "react-icons/io5"
import { FaMicrophoneAlt, FaRegEye, FaEyeSlash } from "react-icons/fa"
import { FaCircleStop } from "react-icons/fa6"
import { IoCloseCircleSharp } from "react-icons/io5"
import { IoMdAdd } from "react-icons/io";

export const Home = ()=>{
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [recording, setRecording] = useState(false)
    const [audio, setAudio] = useState(null)
    const [createUser, setCreateUser] = useState(false)
    const [changeUser, setChangeUser] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passVis, setPassVis] = useState(false)
    const [user, setUser] = useState(null)
    const audioChunk = useRef([])
    const mediaRecorderRef = useRef(null)

    const sendPrompt = async ()=>{
        let res = await api.post("/home",{"prompt":prompt})
        console.log(res)
        setResponse(res.data["response"])
    }

    const createNewUser = async ()=>{
        if(name.trim() == "" || email.trim() == "" || password.trim() == ""){
            console.log("You need to fill up all the boxes.")
            return null;
        }
        let res = await api.post("/home/createUser", {
            "name":name,
            "email":email,
            "password":password
        })
        console.log(res.data)
        if(res.data.res){
       
            let new_user = {
                "name" : name,
                "email" : email
            }

            setUser(new_user)
        }

        clearState();
    }

    const changeNewUser = async ()=>{
        if(email.trim() == "" || password.trim() == ""){
            console.log("You need to fill up all the boxes.")
            return null;
        }

        let res = await api.post("/home/changeUser",{
            "email" : email,
            "password" : password
        })
        console.log(res.data)
        if(res.data.res){
       
            let new_user = {
                "name" : res.data.res_message.name,
                "email" : res.data.res_message.email
            }

            setUser(new_user)
        }

        clearState();

    }

    const startRec = async ()=>{
        try{

                const stream = await navigator.mediaDevices.getUserMedia({audio:true});
            
                const mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (e)=>{
                    if(e.data.size > 0){
                        audioChunk.current.push(e.data);
                    }
                };

                mediaRecorder.onstop = ()=>{
                    setRecording(false)

                    const audioBlob = new Blob(audioChunk.current, { type: "audio/wav" });
                    const audioUrl = URL.createObjectURL(audioBlob)
                    setAudio(audioUrl)

                    audioChunk.current = [];
                    stream.getTracks().forEach(track => track.stop());

                }

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setRecording(true)

        }catch(error){
            console.error("Error accessing the microphone: ",error);
        }
    
    }
        
    const stopRec = async ()=>{
        if(mediaRecorderRef.current && mediaRecorderRef.current.state == 'recording'){
            mediaRecorderRef.current.stop();
        }
    }

    const clearState = async ()=>{
        setCreateUser(false); 
        setChangeUser(false); 
        setName(""); 
        setEmail(""); 
        setPassword("");
    }

    return(
        <>
            <div className="backdrop-blur-3xl bg-amber-200 min-h-[100vh] min-w-[100vw] flex flex-col items-center">
                <div className="w-[90%] flex justify-center items-center m-6" >
                    {audio?
                        <>
                            <div className="w-[80%] flex justify-center">
                                <audio controls src={audio} className="w-[95%]"/>:
                            </div> 
                            <div className="w-[5%] flex flex-wrap items-center ml-auto mr-auto text-3xl hover:text-4xl">
                                <IoCloseCircleSharp onClick={()=>{setAudio(null)}} className="m-auto block text-center text-red-500"/>
                            </div> 
                        </>
                        :
                        <div className=" w-[80%] flex justify-center">
                            <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="bg-white h-10 w-[95%] text-center rounded-2xl text-gray-600 outline-none focus:border-2 focus:border-amber-500" type="text" placeholder="Ask your weather-buddy!!" />
                        </div>
                    }
                    {recording?
                        <div onClick={stopRec} className=" w-[5%] flex flex-wrap items-center ml-auto mr-auto text-2xl hover:text-3xl">
                            <FaCircleStop className="block text-center text-amber-900"/>
                        </div> :
                        <div onClick={startRec} className=" w-[5%] flex flex-wrap items-center ml-auto mr-auto text-2xl hover:text-3xl">
                            <FaMicrophoneAlt className="block text-center text-amber-900"/>
                        </div>
                    }
                    
                    <div onClick={sendPrompt} className=" w-[5%] flex flex-wrap items-center ml-auto mr-auto text-2xl hover:text-3xl">
                        <IoSend className="block text-center text-amber-900"/>
                    </div>
                    <div onClick={()=>{setCreateUser(true)}} className=" w-[5%] flex flex-wrap justify-center items-center ml-auto mr-auto text-3xl hover:text-4xl">
                        {user?
                            <span title={"user : "+user["name"]+"\n"+"email: "+user["email"]} className="block text-center text-amber-900 text-bold">{user["name"][0]}</span>
                            :
                            <IoMdAdd className="block text-center text-amber-900"/>
                        }
                    </div>
                </div>
                {response != ""?
                    <div className="m-6 bg-amber-700 p-4 rounded-2xl">
                        {response}
                    </div>:
                    <></>
                }
                {createUser?
                    <div className="fixed z-10 w-full h-full flex items-center justify-center">
                        <div className="fixed -z-10 w-full h-full bg-white/20 backdrop-blur-sm"></div>
                        <div className="flex flex-col justify-center items-center min-w-100 w-[60%] min-h-[50%] bg-amber-600/70 rounded-2xl">
                            <label htmlFor="toggle" className="select-none relative h-8 mt-3 md-3 bg-white text-black font-bold rounded-2xl flex items-center">
                                <input type="checkbox" onClick={()=>{setChangeUser((prev)=> !prev); console.log(changeUser);}} id="toggle" className="hidden peer"/>
                                <span className="absolute left-0 top-0 w-1/2 h-full bg-blue-400/75 rounded-2xl transition-all duration-300 peer-checked:translate-x-full z-0"></span>
                                <span className="m-2">create user</span>
                                <span className="m-2">change user</span>
                            </label>
                            {!changeUser?
                                <>
                                    <div className="m-auto w-[90%] flex flex-wrap">
                                        <div className="w-[15%] m-auto">
                                            name
                                        </div>
                                        <input value={name} onChange={(e)=>{setName(e.target.value);}} type="text" placeholder="enter your name" className="text-black text-center m-auto h-8 rounded-2xl w-[75%] bg-white"/>
                                    </div>
                                    <div className="m-auto w-[90%] flex flex-wrap">
                                        <div className="w-[15%] m-auto">
                                            email
                                        </div>
                                        <input value={email} onChange={(e)=>{setEmail(e.target.value);}} type="email" placeholder="enter your email" className="text-black text-center m-auto h-8 rounded-2xl w-[75%] bg-white"/>
                                    </div>
                                    <div className="m-auto w-[90%] flex flex-wrap items-center">
                                        <div className="w-[15%] m-auto">
                                            password
                                        </div>
                                        <input value={password} onChange={(e)=>{setPassword(e.target.value);}} type={passVis?"text":"password"} placeholder="create a password" className="text-black text-center m-auto h-8 rounded-2xl w-[75%] bg-white"/>
                                        {passVis?
                                            <FaRegEye onClick={()=>{setPassVis(false)}} className="block text-center text-amber-900"/>
                                            :
                                            <FaEyeSlash onClick={()=>{setPassVis(true)}} className="block text-center text-amber-900"/>
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <div className="m-auto w-[90%] flex flex-wrap">
                                        <div className="w-[15%] m-auto">
                                            email
                                        </div>
                                        <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="enter your email" className="text-black text-center m-auto h-8 rounded-2xl w-[75%] bg-white"/>
                                    </div>
                                    <div className="m-auto w-[90%] flex flex-wrap items-center">
                                        <div className="w-[15%] m-auto">
                                            password
                                        </div>
                                        <input type={passVis?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="enter your password" className="text-black text-center m-auto h-8 rounded-2xl w-[75%] bg-white"/>
                                        {passVis?
                                            <FaRegEye onClick={()=>{setPassVis(false)}} className="block text-center text-amber-900"/>
                                            :
                                            <FaEyeSlash onClick={()=>{setPassVis(true)}} className="block text-center text-amber-900"/>
                                        }
                                    </div>
                                </>
                                }
                            <div className="select-none m-auto w-[90%] flex flex-wrap justify-center">
                                {changeUser?
                                    <div onClick={changeNewUser} className="transition-transform duration-100 hover:scale-110 hover:text-4 hover:font-bold m-auto bg-green-500 pt-2 pb-2 pr-3 pl-3 rounded-2xl">
                                        change user
                                    </div>
                                    :
                                    <div onClick={createNewUser} className="transition-transform duration-100 hover:scale-110 hover:text-4 hover:font-bold m-auto bg-green-500 pt-2 pb-2 pr-3 pl-3 rounded-2xl">
                                        create user
                                    </div>
                                }
                                <div onClick={()=>{clearState()}} className="transition-transform duration-100 hover:scale-110 hover:text-4 hover:font-bold m-auto bg-red-500 pt-2 pb-2 pr-3 pl-3 rounded-2xl">
                                    cancel
                                </div>
                            </div>
                        </div>
                    </div>:
                    <></>
                }
                
            </div>
        </>
    )
}