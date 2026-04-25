import React from 'react';
import { MdPhone, MdEmail } from 'react-icons/md';

const AssignedLeads = () => {

  const leads = [
    {
      name: 'Riya Sharma',
      need: 'Health Insurance',
      phone: '+91 98765 43210',
      email: 'riya@gmail.com',
      status: 'New'
    },
    {
      name: 'Amit Verma',
      need: 'Life Insurance',
      phone: '+91 91234 56780',
      email: 'amit@gmail.com',
      status: 'Contacted'
    },
    {
      name: 'Neha Singh',
      need: 'Vehicle Insurance',
      phone: '+91 99887 76655',
      email: 'neha@gmail.com',
      status: 'Follow-up'
    },
  ];

  return (
    <div className="page-container">

      <div className="page-header">
        <div className="page-header-left">
          <h1>Assigned Leads</h1>
          <p>View and follow up with assigned customers.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20
      }}>

        {leads.map((lead, index) => (
          <div key={index} className="chart-card">

            <h3 style={{ marginBottom: 6 }}>{lead.name}</h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 10 }}>
              {lead.need}
            </p>

            <div style={{ fontSize: 13, marginBottom: 6 }}>
              <MdPhone /> {lead.phone}
            </div>

            <div style={{ fontSize: 13, marginBottom: 10 }}>
              <MdEmail /> {lead.email}
            </div>

            <span className="badge badge-pending">
              {lead.status}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AssignedLeads;