import React, { useState } from 'react';
import { 
  MdDirectionsCar, MdHome, MdFlight, MdFace, 
  MdShield, MdHealthAndSafety, MdLaptopMac, MdClose
} from 'react-icons/md';
import Partners from '../../components/Partners';

const insurances = [
  { id: 'motor', title: 'Motor & Car Insurance', icon: <MdDirectionsCar style={{ color: '#f87171' }} /> },
  { id: 'home', title: 'Home Insurance', icon: <MdHome style={{ color: '#fbbf24' }} /> },
  { id: 'travel', title: 'Travel Insurance', icon: <MdFlight style={{ color: '#60a5fa' }} /> },
  { id: 'domestic', title: 'Domestic Helper', icon: <MdFace style={{ color: '#a78bfa' }} /> },
  { id: 'accident', title: 'Personal Accident', icon: <MdShield style={{ color: '#facc15' }} /> },
  { id: 'medical', title: 'Medical Insurance', icon: <MdHealthAndSafety style={{ color: '#34d399' }} /> },
  { id: 'expat', title: 'Expat Medical Visa', icon: <MdShield style={{ color: '#2dd4bf' }} /> },
  { id: 'cyber', title: 'Personal Cyber', icon: <MdLaptopMac style={{ color: '#4b5563' }} /> },
];

const moreProductsData = {
  Personal: [
    {
      category: "Investment Plans",
      items: [
        { name: "LIC Plans", icon: "🛡️" },
        { name: "Investment", icon: "💰" },
        { name: "Child Savings Plan", icon: "🧸" },
        { name: "Guaranteed Return Plan", icon: "💯" },
        { name: "Retirement Plan", icon: "👴" },
        { name: "Tax Saving Investment", icon: "🧾" },
        { name: "Pension For Life", icon: "🛋️" },
        { name: "Smart Deposit", icon: "🪙" },
        { name: "ULIPs", icon: "📈", badge: "New" },
        { name: "Dollar Based Investment Plan", icon: "💵" },
      ]
    },
    {
      category: "Other Plans",
      items: [
        { name: "Car Insurance", icon: "🚗" },
        { name: "Brand New Car", icon: "✨🚗" },
        { name: "2 Wheeler Insurance", icon: "🛵" },
        { name: "Travel Insurance", icon: "✈️" },
        { name: "Home Insurance", icon: "🏠" },
        { name: "Taxi Insurance", icon: "🚖" },
        { name: "Commercial Vehicle", icon: "🚚" },
        { name: "Employee Group Health Insurance", icon: "👥💉" },
        { name: "Corporate Insurance", icon: "🏢" },
        { name: "Pet Insurance", icon: "🐕" },
        { name: "Personal Cyber Insurance", icon: "💻🛡️" },
      ]
    }
  ],
  Business: [
    {
      category: "Marine & Property Insurance",
      items: [
        { name: "Marine Insurance", icon: "🚢", badge: "Save upto 42%" },
        { name: "Fire & Burglary", icon: "🔥" },
        { name: "Shop Owner Insurance", icon: "🏪" },
        { name: "Office Package Policy", icon: "🗄️" },
      ]
    },
    {
      category: "Employee Benefits",
      items: [
        { name: "Employee Group Health Insurance", icon: "👨‍👩‍👧‍👦", badge: "Save upto 65%" },
        { name: "Group Personal Accident", icon: "🩺", badge: "Save upto 78%" },
        { name: "Group Term Life", icon: "☂️" },
        { name: "COVID-19 Group Health Plan", icon: "🦠" },
      ]
    },
    {
      category: "Liability",
      items: [
        { name: "Professional Indemnity for Doctors", icon: "👨‍⚕️", badge: "Save upto 88%" },
        { name: "Professional Indemnity for Companies", icon: "🏬", badge: "Save upto 50%" },
        { name: "Workmen Compensation", icon: "👷‍♂️", badge: "Save upto 85%" },
        { name: "General Liability", icon: "🧳" },
        { name: "Cyber Risk Insurance", icon: "🔐" },
        { name: "Directors & Officers Liability", icon: "👔" },
      ]
    },
    {
      category: "Engineering",
      items: [
        { name: "Contractor's All Risk", icon: "🧰" },
        { name: "Erection All Risk", icon: "🏗️" },
        { name: "Contractor's Plant & Machinery", icon: "🚜" },
      ]
    }
  ]
};
const UserDashboard = () => {
  const [selectedQuote, setSelectedQuote] = useState('home'); 
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal');

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-project-g2lv.onrender.com/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedQuote })
      });
      const data = await response.json();
      if(response.ok) {
        alert(data.message + ' Quote ID: ' + data.data.quoteId);
        setSelectedQuote(null);
      }
    } catch(err) {
      alert('Failed to submit quote API');
    }
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: 5, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            <span>Main Services</span> <span style={{ color: 'var(--text-secondary)' }}>/</span> <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Insurance Policies</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Insurance Policies</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Look through all the insurance policies and services we provide at Solidarity</p>
        </div>
        <button 
          onClick={() => setShowMoreProducts(true)}
          style={{
            background: 'var(--bg-card)',
            color: 'var(--blue-dark)',
            border: '1px solid var(--blue-primary)',
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--blue-primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--blue-dark)'; }}
        >
          View More Products
        </button>
      </div>

      {/* Grid of Insurances */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        maxWidth: '900px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        position: 'relative'
      }}>
        {insurances.map((ins) => (
          <div 
            key={ins.id}
            onClick={() => setSelectedQuote(ins.id)}
            style={{
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              background: selectedQuote === ins.id ? 'var(--bg-secondary)' : 'var(--bg-card)',
              border: selectedQuote === ins.id ? '2px solid var(--blue-light)' : '1px solid rgba(255,255,255,0.7)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedQuote === ins.id ? '0 10px 25px -5px rgba(56, 189, 248, 0.3)' : 'none',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 40, background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ins.icon}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: selectedQuote === ins.id ? 'var(--blue-dark)' : 'var(--text-primary)' }}>
              {ins.title}
            </span>
          </div>
        ))}
      </div>

      {/* Get a Quote Modal Overlay */}
      {selectedQuote && !showMoreProducts && (
        <div style={{
          position: 'absolute',
          top: '280px',
          right: '40px',
          width: '500px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
            Get a quote
            <button onClick={() => setSelectedQuote(null)} style={{ background: 'transparent', fontSize: 20, color: 'var(--text-muted)' }}><MdClose /></button>
          </h2>
          <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ... Get Quote Existing Fields ... */}
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Name</label>
                <input type="text" placeholder="e.g. John Doe" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#f8fafc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value="+973" readOnly style={{ width: 60, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#f8fafc', color: 'var(--text-muted)', textAlign: 'center' }} />
                  <input type="text" placeholder="e.g 33101022" style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#f8fafc' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1.5 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Sum insured of the building (BHD)</label>
                <input type="number" placeholder="BHD" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#f8fafc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Building Age</label>
                <input type="number" placeholder="e.g. 10" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#f8fafc' }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', alignSelf: 'flex-start', cursor: 'pointer', marginTop: 10 }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
              <span>I agree to the <a href="#" style={{ textDecoration: 'underline', color: 'var(--text-primary)', fontWeight: 600 }}>Terms of Use</a> and <a href="#" style={{ textDecoration: 'underline', color: 'var(--text-primary)', fontWeight: 600 }}>Privacy Policy</a></span>
            </label>

            <button type="submit" style={{
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#fff',
              padding: '14px',
              borderRadius: '8px',
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
              border: 'none',
              marginTop: 10
            }}>
              View Prices
            </button>
          </form>
        </div>
      )}

      {/* MORE PRODUCTS MODAL */}
      {showMoreProducts && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            width: '900px',
            maxHeight: '85vh',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 }}>More Products</h2>
              <button 
                onClick={() => setShowMoreProducts(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <MdClose style={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: 32, padding: '0 32px', borderBottom: '1px solid #e2e8f0' }}>
              {['Personal', 'Business'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '16px 0',
                    fontSize: 15,
                    fontWeight: 700,
                    color: activeTab === tab ? '#2563eb' : '#64748b',
                    borderBottom: `3px solid ${activeTab === tab ? '#2563eb' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab} Insurance
                </button>
              ))}
            </div>

            {/* Modal Content Area */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
                {moreProductsData[activeTab].map((section, idx) => (
                  <div key={idx}>
                    {/* Section Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#334155', margin: 0 }}>{section.category}</h3>
                      <div style={{ height: 2, background: '#cbd5e1', flex: 1 }}></div>
                    </div>
                    
                    {/* Items Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      {section.items.map((item, idxi) => (
                        <div key={idxi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, cursor: 'pointer' }}>
                          <div style={{ position: 'relative' }}>
                            {item.badge && (
                              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#86efac', color: '#065f46', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                                {item.badge}
                              </div>
                            )}
                            <div style={{ fontSize: 42, textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{item.icon}</div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', lineHeight: 1.3 }}>{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Partners Grid */}
      <Partners />
    </div>
  );
};

export default UserDashboard;
