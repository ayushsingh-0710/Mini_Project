import React, { useEffect, useState } from "react";
import { getUserData, saveUserData } from "../../utils/storage";
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdSave } from "react-icons/md";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const data = getUserData();
    setProfile({
      name: data.profile?.name || data.profile?.fullName || "",
      email: data.profile?.email || "",
      phone: data.profile?.phone || "",
      address: data.profile?.address || ""
    });
  }, []);

  const handleSave = () => {
    const data = getUserData();

    data.profile = {
      ...data.profile,
      name: profile.name,
      fullName: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address
    };

    saveUserData(data);
    alert("✅ Profile updated successfully");
  };

  const fieldStyle = {
    width: "100%",
    padding: "14px 16px 14px 44px",
    borderRadius: "14px",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    background: "rgba(255,255,255,0.75)",
    fontSize: 14,
    color: "#0f172a",
    outline: "none"
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>My Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Manage your personal details and keep your account information updated.
        </p>
      </div>

      <div
        className="chart-card"
        style={{
          maxWidth: 820,
          borderRadius: 26,
          padding: 0,
          overflow: "hidden",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)"
        }}
      >
        <div
          style={{
            padding: "28px 28px 22px",
            background: "linear-gradient(135deg, rgba(2,132,199,0.95), rgba(56,189,248,0.9))",
            color: "#fff"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800
              }}
            >
              {(profile.name || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{profile.name || "User"}</h2>
              <p style={{ margin: "6px 0 0 0", fontSize: 13, opacity: 0.95 }}>
                Keep your details updated for a better policy experience
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18
            }}
          >
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <MdPerson style={{ position: "absolute", top: 14, left: 14, fontSize: 20, color: "#64748b" }} />
                <input
                  style={fieldStyle}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email</label>
              <div style={{ position: "relative" }}>
                <MdEmail style={{ position: "absolute", top: 14, left: 14, fontSize: 20, color: "#64748b" }} />
                <input
                  style={fieldStyle}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Phone</label>
              <div style={{ position: "relative" }}>
                <MdPhone style={{ position: "absolute", top: 14, left: 14, fontSize: 20, color: "#64748b" }} />
                <input
                  style={fieldStyle}
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Address</label>
              <div style={{ position: "relative" }}>
                <MdLocationOn style={{ position: "absolute", top: 14, left: 14, fontSize: 20, color: "#64748b" }} />
                <textarea
                  style={{ ...fieldStyle, minHeight: 120, resize: "none" }}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                borderRadius: 14,
                padding: "13px 20px",
                background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(2,132,199,0.28)"
              }}
            >
              <MdSave style={{ fontSize: 18 }} />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;