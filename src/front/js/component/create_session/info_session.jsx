import React, { useContext, useEffect } from "react";
import logo from "../../../img/logo/logo-marca.png"
import {Member} from "../../component/create_session/member.jsx"
import { useParams } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import userDefault from "../../../img/genre_games/user_default.jpg"


export const InfoSession = () => {

    const params = useParams()
    const {store, actions} = useContext(Context)


    useEffect(() => {   
        actions.getSession(params.id_session)
        actions.getSessionMembers(params.id_session)
    }, [])

    const handleClick =  () => {
        const userProfile = JSON.parse(localStorage.getItem("userProfile")).id
        const data = {
            id_user: userProfile,
            id_session: parseInt(params.id_session)
        }
        actions.joinSession(data)
    }

    return(
        <div className="d-flex flex-column align-items-center min-vh-100 pb-3" style={{ backgroundColor: "#16171C", color: "#fff" }}>
            <img src={logo} alt="Logo" style={{ width: '40%', height: '80px', margin: '10px', objectFit: "contain" }} />
            <div className="w-75 my-auto" style={{ backgroundColor: "rgb(18 19 20)", borderRadius: "8px" }}>
                <div className="container text-center">
                    <div className="row justify-content-center align-items-center">
                        <h2 className="mt-4 mb-2 fw-bold text-start">Session:</h2>
                        <div className="container w-100 h-100">
                            {/* Busqueda */}
                            <div className="container">
                            <div className="row">
                            <div className="col-12 col-lg-5 d-flex flex-column justify-content-center align-items-center" style={{backgroundImage: `url(${store.specificSession.background_img})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "250px", boxShadow: "inset 0px 0px 180px rgba(0, 0, 0, 0.5)", marginBottom: "50px", borderRadius: "20px"}}>
                                <div style={{width: "220px", height: "220px", borderRadius: "50%", overflow: "hidden", border: "2px solid purple", marginTop: "60px",}}>
                                    <img src={store.specificSession.host_profile_img ? store.specificSession.host_profile_img : userDefault} alt="Perfil" style={{ width: "100%", height: "100%", objectFit: "cover", }}/>
                                </div>
                                <div className="mb-4" style={{width: "85%", padding: "1.7rem", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "15px", marginTop: "100px"}}>
                                <h4 className="">{store.specificSession.game_name}</h4>
                                <h5 className="text-start mt-4">{store.specificSession.host_username}</h5>
                                <h5 className="text-start">{store.specificSession.duration}</h5>
                                <h5 className="text-start">{store.specificSession.language}</h5>                        
                                <h5 className="text-start">{store.specificSession.region}</h5>
                                </div>                                                          
                            </div>
                                <div className="col-12 col-lg-7 d-flex flex-column">
                                    <div className="bg-black p-2" style={{borderRadius: "15px"}}>
                                        <h5 className="text-start">Description:</h5>
                                        <div className="bg-dark p-2" style={{borderRadius: "5px", minHeight: "80px"}}>
                                            <p className="text-start">
                                                {store.specificSession.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-black p-2 mt-2" style={{borderRadius: "15px"}}>
                                        <div className="d-flex justify-content-between pt-1">
                                            <h5 className="">Members:</h5>
                                            <h6 className="me-2">{store.totalMembers}/{store.specificSession.capacity}</h6>
                                        </div>
                                        <div className="p-1" style={{borderRadius: "5px", overflow: "scroll", height: "415px"}}>
                                            {store.sessionMembers && store.sessionMembers.length > 0 ? (
                                                store.sessionMembers.map(member => 
                                                    <Member key={member.id} username={member.username} imagen={member.profile_img_url} schedule={member.schedule} region={member.region} id={member.id}/>
                                                )
                                            ) : (
                                                <p>No hay miembros en esta sesión.</p>
                                            )}
                                        </div>
                                        {store.totalMembers === store.specificSession.capacity ? (
                                            <button className="btn-searchA mt-1"disabled>
                                                Full
                                            </button>
                                        ) : (
                                            <button className="btn-searchA mt-1" onClick={handleClick}>
                                                Unirse
                                            </button>
                                        )}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}