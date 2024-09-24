import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/profile_edit.css";
import { FavoriteGames } from "../component/profile_games.jsx";

const initialProfileData = {
  first_name: "",
  last_name: "",
  discord_id: "",
  steam_id: "",
  description: "",
  profile_img_url: "",
  platform: [],
  favoriteGames: [],
};

const availablePlatforms = ["steam", "play station", "xbox", "nintendo switch"];

const validatePlatforms = (platforms) => {
  const validPlatforms = ["steam", "play station", "xbox", "nintendo switch"];
  return platforms.every((platform) => validPlatforms.includes(platform));
};

export const UserProfileEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { actions, store } = useContext(Context);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        await actions.getUserProfile(userId);
        if (isMounted) {
          setShouldFetch(false);
          const { userProfile, favoriteGames } = store;
          const platforms =
            typeof userProfile.platform === "string"
              ? userProfile.platform.split(",").map((item) => item.trim())
              : userProfile.platform;

          setProfileData((prevData) => ({
            ...prevData,
            ...userProfile,
            platform: platforms,
            favoriteGames: Array.isArray(favoriteGames) ? favoriteGames : [],
          }));
        }
      } catch (error) {
        setErrorMessage(error.message);
        console.error("Error al obtener los datos del perfil:", error);
      }
    };

    if (shouldFetch) {
      fetchProfileData();
    }

    return () => {
      isMounted = false;
    };
  }, [userId, actions, store, shouldFetch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  const addPlatform = () => {
    if (selectedPlatform && !profileData.platform.includes(selectedPlatform)) {
      setProfileData((prevData) => ({
        ...prevData,
        platform: [...prevData.platform, selectedPlatform],
      }));
      setSelectedPlatform("");
    }
  };

  const removePlatform = (platformToRemove) => {
    setProfileData((prevData) => ({
      ...prevData,
      platform: prevData.platform.filter(
        (platform) => platform !== platformToRemove
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validatePlatforms(profileData.platform)) {
      setErrorMessage(
        "Por favor, introduce plataformas válidas: steam, play station, xbox, nintendo switch."
      );
      return;
    }

    try {
      await actions.updateUserProfile(userId, profileData);
      alert("¡Perfil actualizado con éxito!");
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Error al actualizar el perfil.");
    }
  };

  return (
    <section id="editProfile" className="container-fluid py-5 bg-black">
      <div className="container d-flex flex-column rounded shadow-sm profile-edit-container">
        <div className="d-flex justify-content-between align-items-center text-white">
          <form className="w-100" onSubmit={handleSubmit}>
            <h3 className="mb-4 mt-5 text-center">Editar Perfil</h3>
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={profileData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellido:</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={profileData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">ID de Discord:</label>
                <input
                  type="text"
                  name="discord_id"
                  className="form-control"
                  value={profileData.discord_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">ID de Steam:</label>
                <input
                  type="text"
                  name="steam_id"
                  className="form-control"
                  value={profileData.steam_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 text-justify">
                <label className="form-label">Descripción:</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={profileData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label">URL de Imagen de Perfil:</label>
                <input
                  type="text"
                  name="profile_img_url"
                  className="form-control"
                  value={profileData.profile_img_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label">Plataforma:</label>
                <div className="input-group">
                  <select
                    className="form-control"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                  >
                    <option value="">Selecciona una plataforma</option>
                    {availablePlatforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addPlatform}
                  >
                    Agregar
                  </button>
                </div>
                <ul className="list-group mt-3">
                  {profileData.platform.map((platform) => (
                    <li
                      key={platform}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removePlatform(platform)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <FavoriteGames userId={userId} />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn custom-button-profile mb-5 me-5"
              >
                Guardar
              </button>
              <Link to={`/profile/${userId}`} className="btn btn-danger mb-5">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};