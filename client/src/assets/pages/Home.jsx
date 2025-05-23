import { useRef, useState, useEffect } from "react"
import api from "../services/Axios.js"
import { IoSend } from "react-icons/io5"
import { FaMicrophoneAlt, FaRegEye, FaEyeSlash } from "react-icons/fa"
import { FaCircleStop } from "react-icons/fa6"
import { IoCloseCircleSharp } from "react-icons/io5"
import { IoMdAdd } from "react-icons/io";

export const Home = ()=>{
    const [prompt, setPrompt] = useState("")
    const [historyCall, setHistoryCall] = useState(false)
    const [response, setResponse] = useState("")
    const [recording, setRecording] = useState(false)
    const [audio, setAudio] = useState(null)
    const [audioBlob, setAudioBlob] = useState(null)
    const [createUser, setCreateUser] = useState(false)
    const [changeUser, setChangeUser] = useState(false)
    const [logOut, setLogOut] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passVis, setPassVis] = useState(false)
    const [user, setUser] = useState(null)
    const [chatHistory, setChatHistory] = useState([])
    const audioChunk = useRef([])
    const mediaRecorderRef = useRef(null)

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const { user, expiry } = JSON.parse(stored);
            if (Date.now() < expiry) {
                setUser(user);
            } else {
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        getChatHistory()
    },[user, historyCall])

    const getChatHistory = async ()=>{
        
        let user_email = ""
        if(user != null){
            user_email = user["email"]
        }else{
            return []
        }
        
        let res = await api.get("/home/chatHistory", {
            params: { email : user_email }
          })          
        console.log(res.data)
        setChatHistory(res.data)
    }

    const sendPrompt = async ()=>{
        
        let user_email = ""
        if(user != null)
            user_email = user["email"]

        if(audio){
            let formData = new FormData();
            
            formData.append("user_email", user_email)
            formData.append("file", audioBlob, "recording.wav")
            
            let res = await api.post("/audioPrompt", formData)
            console.log(res)

            setResponse(res.data["response"])
            setHistoryCall(prev => !prev)

            setAudio(null)
            setAudioBlob(null)

        }else{
            if(prompt.trim() == ""){
                console.log("no prompt value")
                return null
            }
                
            let res = await api.post("/home",{
                "user_email" : user_email,
                "prompt":prompt})
            console.log(res)
            setResponse(res.data["response"])

            setHistoryCall(prev => !prev)
            setPrompt("")
        }
        
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

            const expiry = Date.now() + 1000 * 60 * 30; 
            localStorage.setItem("user", JSON.stringify({ ...new_user, expiry }));

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

            const expiry = Date.now() + 1000 * 60 * 30; 
            localStorage.setItem("user", JSON.stringify({ "user" : new_user, expiry }));

            setUser(new_user)
        }

        clearState();

    }

    const userLogOut = ()=>{
        localStorage.removeItem("user")
        setUser(null)
        setResponse("")
        setChatHistory([])
        setLogOut(false)
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

                    const tempAudioBlob = new Blob(audioChunk.current, { type: "audio/wav" })
                    setAudioBlob(tempAudioBlob);
                    const audioUrl = URL.createObjectURL(tempAudioBlob)
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
                                <IoCloseCircleSharp onClick={()=>{setAudio(null); setAudioBlob(null);}} className="m-auto block text-center text-red-500"/>
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
                    <div className=" w-[5%] flex flex-wrap justify-center items-center ml-auto mr-auto text-3xl hover:text-4xl">
                        {user?
                            <span onClick={()=>{setLogOut(true)}} title={"user : "+user["name"]+"\n"+"email: "+user["email"]} className="block text-center text-amber-900 text-bold">{user["name"][0]}</span>
                            :
                            <IoMdAdd onClick={()=>{setCreateUser(true)}} className="block text-center text-amber-900"/>
                        }
                    </div>
                </div>
                {response != ""?
                    <div className="m-6 bg-amber-700 p-4 rounded-2xl">
                        {response}
                    </div>:
                    <></>
                }
                {chatHistory != []?
                    <>
                        <div>
                            {chatHistory.map((msg, index) => (
                                <div className="m-3" key={index}>
                                    <p className="text-green-600">{msg.prompt}</p>
                                    <p className="text-black" >{msg.response}</p>
                                </div>
                            ))}
                        </div>
                    </>
                    :
                    <></>
                }
                {createUser?
                    <div className="select-none fixed z-10 w-full h-full flex items-center justify-center">
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
                {logOut?
                    <>
                        <div className="select-none fixed z-10 w-full h-full flex items-center justify-center">
                            <div className="fixed -z-10 w-full h-full bg-white/20 backdrop-blur-sm"></div>
                            <div className="flex flex-col text-bold text-black items-center justify-center min-w-50 w-[50%] h-[40%] bg-amber-500 rounded-2xl">
                                <span className="w-full text-center text-2xl font-bold text-white">Current User:</span>
                                <span className="text-2xl">{user["name"]}</span>
                                <span className="text-2xl">{user["email"]}</span>
                                <div className="mt-2 flex flex-wrap jusify-center">
                                    <div onClick={()=>{setLogOut(false)}} className="text-2xl m-2 active:scale-90 p-2 rounded-2xl font-medium transition-transform duration-300 hover:bg-green-600 hover:scale-110 bg-white">cancel</div>
                                    <div onClick={()=>{userLogOut()}} className="text-2xl m-2 active:scale-90 p-2 rounded-2xl font-medium transition-transform duration-300 hover:bg-red-600 hover:scale-110 bg-red-500">log out</div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
                }
                
            </div>
        </>
    )
}