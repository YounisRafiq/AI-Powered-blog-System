import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import GIF from "../assets/loading.gif";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          withCredentials: true,
        });

        const user = res.data.user;

        setFormData({ name: user.name, password: "" });
        setImagePreview(user.image || "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editMode) return;

    setUpdating(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);

      if (formData.password) {
        data.append("password", formData.password);
      }

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await axios.patch("http://localhost:3000/api/user/profile", data, {
        withCredentials: true,
      });

      alert("Profile Updated Successfully");
      setEditMode(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false); // 🔥 stop loading
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return (
      <div className="loading">
        <img src={GIF} alt="Loading..." />
      </div>
    );
  }

  {
    updating && (
      <div className="loading">
        <img src={GIF} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-image-container">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="profile-image" />
            ) : (
              <div className="no-image">No Image</div>
            )}

            {editMode && (
              <>
                <label htmlFor="image-upload" className="edit-icon">
                  ✏️
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>

          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>

            {editMode && (
              <button style={{textDecoration : updating ? "no-drop" : ""}} type="submit" className="update-btn" disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </button>
            )}
          </form>

          {!editMode && (
            <div className="btns">
              <button
                type="button"
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          )}

          <Link className="home-page" to={"/"}>
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
