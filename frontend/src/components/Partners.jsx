import React from 'react';

const partnersData = [
  "ADITYA BIRLA CAPITAL", "ADITYA BIRLA HEALTH", "ageasFEDERAL", "AVIVA", "AXIS MAX", 
  "BAJAJ Allianz Life", "BAJAJ Allianz Gen", "Bandhan Life", "bharti AXA", "Canara HSBC", 
  "care Health", "Chola MS", "digit", "digit Life", "ECGC", 
  "edelweiss", "FUTURE GENERALI LIFE", "FUTURE GENERALI GEN", "Galaxy", "HDFC ERGO", 
  "HDFC Life", "ICICI Lombard", "ICICI PRUDENTIAL", "IFFCO-TOKIO", "IndiaFirst", 
  "IndusInd", "kotak life", "Liberty", "LIC", "MAGMA", 
  "Manipal Cigna", "National Insurance", "niva Bupa", "Oriental Insurance", "pnb MetLife", 
  "Pramerica", "RAHEJA QBE", "Royal Sundaram", "SBI general", "SBI Life", 
  "SHRIRAM General", "SHRIRAM Life", "STAR Health", "Star Union Dai-ichi", "TATA AIA", 
  "TATA AIG", "The New India Assurance", "UNITED INDIA", "Universal Sompo", "zuno", 
  "ZURICH kotak"
];

const Partners = () => {
  return (
    <div style={{
      width: '100%',
      padding: '60px 20px',
      marginTop: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.02)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--blue-dark)', marginBottom: '12px' }}>
          Our Partners
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Leading insurers for your financial freedom
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        justifyContent: 'center'
      }}>
        {partnersData.map((partner, index) => (
          <div 
            key={index} 
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
              border: '1px solid #f1f5f9',
              transition: 'all 0.3s',
              cursor: 'pointer',
              minHeight: '110px',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
            }}
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partner)}&background=random&color=fff&size=48&rounded=true&bold=true`} 
              alt={`${partner} Logo`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#334155',
              letterSpacing: '0.2px',
              lineHeight: '1.4',
              width: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}>
              {partner}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
