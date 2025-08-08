import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState({
    username: '',
    dob: '',
    phone_no: '',
    address: '',
    bio: '',
    profile_image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
  fetch(`http://13.51.235.169:5000/api/profile/${userId}`)
    .then(res => res.json())
    .then(data => {
      console.log("PROFILE DATA:", data);
      setProfile(data);
    });
}, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('dob', profile.dob);
    formData.append('phone_no', profile.phone_no);
    formData.append('address', profile.address);
    formData.append('bio', profile.bio);
    if (selectedFile) formData.append('profile_image', selectedFile);

    try {
      await axios.put(`http://13.51.235.169:5000/api/profile/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4"><i className='fa fa-user'/> My Profile</h2>
      <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <img
  src={
    profile?.profile_image
      ? profile.profile_image     // ✅ Base64 string directly
      : '/assets/default.png'
  }
  alt="Profile"
  className="rounded-circle border border-dark"
  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
/>

          {editing && (
            <input type="file" onChange={handleFileChange} className="form-control mt-2 w-75" />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          {editing ? (
            <input
              type="text"
              className="form-control"
              name="username"
              value={profile.username}
              onChange={handleChange}
            />
          ) : (
            <p className="form-control-plaintext"><b>{profile.username || 'Not set'}</b></p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          {editing ? (
            <input
              type="date"
              className="form-control"
              name="dob"
              value={profile.dob?.slice(0, 10)}
              onChange={handleChange}
            />
          ) : (
            <p className="form-control-plaintext"><b>{profile.dob?.slice(0, 10) || 'Not set'}</b></p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          {editing ? (
            <input
              type="text"
              className="form-control"
              name="phone_no"
              value={profile.phone_no}
              onChange={handleChange}
            />
          ) : (
            <p className="form-control-plaintext"><b>{profile.phone_no || 'Not set'}</b></p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          {editing ? (
            <textarea
              className="form-control"
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="2"
            />
          ) : (
            <p className="form-control-plaintext"><b>{profile.address || 'Not set'}</b></p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Bio</label>
          {editing ? (
            <textarea
              className="form-control"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
            />
          ) : (
            <p className="form-control-plaintext"><b>{profile.bio || 'No bio provided.'}</b></p>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-dark"
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
          {editing && (
            <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
