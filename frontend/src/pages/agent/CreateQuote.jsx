import React, { useState } from 'react';

const CreateQuote = () => {
  const [quote, setQuote] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    setQuote({
      id: 'QT-' + Math.floor(Math.random() * 9000 + 1000),
      premium: '₹10,500/year',
      valid: '15 days'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Create Quote</h1>
          <p>Generate policy quotation for customers.</p>
        </div>
      </div>

      <div className="chart-card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <input className="form-input" placeholder="Customer Name" required />
          <input className="form-input" placeholder="Policy Type" required />
          <input className="form-input" placeholder="Coverage Amount" required />
          <input className="form-input" placeholder="Customer Age" required />

          <button className="btn btn-primary" type="submit">
            Generate Quote
          </button>
        </form>

        {quote && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'rgba(59,130,246,0.08)' }}>
            <h3>Quote Generated</h3>
            <p>Quote ID: {quote.id}</p>
            <p>Estimated Premium: {quote.premium}</p>
            <p>Valid For: {quote.valid}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuote;