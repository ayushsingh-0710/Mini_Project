import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPersonOutline, MdLockOutline, MdOutlineShield, MdArrowBack } from 'react-icons/md';
import { usePortal } from '../context/PortalContext';

const Login = () => {
  const navigate = useNavigate();
  const { switchPortal } = usePortal();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [role] = useState('user'); // default role

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-project-g2lv.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password, role })
      });
      const data = await response.json();
      
      if (response.ok) {
        switchPortal(role);
        navigate('/user/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #71c5ef 0%, #cdb4db 50%, #b5e48c 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Main Glass Card */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '850px',
        minHeight: '480px',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Left Side */}
        <div style={{
          flex: 1.1,
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #81c7f5 0%, #90caf9 100%)',
          color: '#fff',
          position: 'relative',
        }}>
          {/* Logo Top Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'absolute', top: 30, left: 30 }}>
             <MdOutlineShield style={{ fontSize: 22 }} />
             <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>SOLIDARITY</span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '20px', lineHeight: '1.1', maxWidth: '300px' }}>
            Secure Your<br/>Future Today.
          </h1>
          <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.9, maxWidth: '320px' }}>
            The most advanced insurance management platform for modern professionals and families.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          flex: 0.9,
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}>
          
          <button 
            type="button"
            style={{
              position: 'absolute', top: 25, left: 35,
              background: 'none', border: 'none', color: '#4b5563',
              fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer', padding: 0
            }}
          >
            <MdArrowBack /> Back to Selection
          </button>

          <div style={{ marginBottom: '25px', marginTop: '10px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1f2937', marginBottom: '6px' }}>User Login</h2>
            <p style={{ fontSize: '13px', color: '#4b5563' }}>Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Input Group Username */}
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Username or Email" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  paddingRight: '45px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <MdPersonOutline style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563', fontSize: 18 }} />
            </div>

            {/* Input Group Password */}
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password}
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  paddingRight: '45px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <MdLockOutline style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563', fontSize: 18 }} />
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              style={{
                marginTop: '10px',
                padding: '14px',
                background: '#11b2ac', // Teal color
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 12px rgba(17, 178, 172, 0.25)',
              }}
            >
              SIGN IN AS USER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
