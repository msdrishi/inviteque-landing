import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config';

// ----------------------------------------------------------------------
// Credentials configured by the Admin for the Invisible Login
// The customer will only type the PIN on the frontend.
// ----------------------------------------------------------------------
const PIN_CODE = "2026";
const ACCOUNT_EMAIL = "saaransh@inviteque.com";
const ACCOUNT_PASSWORD = "stuti";
const WEDDING_CODE = "SAARANSH-STUTI";

export default function SaaranshDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rsvps, setRsvps] = useState([]);

  // Filter state
  const [filter, setFilter] = useState('all');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pin !== PIN_CODE) {
      setError("Incorrect PIN. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // --- SIMULATION MODE ---
      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock RSVP data for preview purposes
      const mockRsvps = [
        { _id: '1', name: 'Rahul Sharma', attending: 'yes', headcount: 2, email: 'rahul@example.com', message: 'Looking forward to the celebration!' },
        { _id: '2', name: 'Priya Verma', attending: 'no', headcount: 0, phone: '+91-9876543210', message: 'Sorry, I will be out of town.' },
        { _id: '3', name: 'Amit Desai', attending: 'yes', headcount: 1, email: 'amit.d@example.com', message: '' },
        { _id: '4', name: 'Sneha Kapoor', attending: 'maybe', headcount: 1, phone: '+91-8888888888', message: 'Will confirm closer to the date.' }
      ];

      setRsvps(mockRsvps);
      setIsAuthenticated(true);

      /* --- ORIGINAL BACKEND CODE COMMENTED OUT FOR SIMULATION ---
      // 1. Invisible Login to get the token
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ACCOUNT_EMAIL, password: ACCOUNT_PASSWORD })
      });

      if (!loginRes.ok) {
        throw new Error("Unable to access backend. Ensure the Inviteque account is created.");
      }

      const loginData = await loginRes.json();
      const token = loginData.token;

      // 2. Fetch the RSVPs for this unique code
      const rsvpRes = await fetch(`${API_URL}/api/invites/${WEDDING_CODE}/rsvps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!rsvpRes.ok) {
        throw new Error("Unable to load RSVPs. Ensure the wedding code exists in the database.");
      }

      const rsvpData = await rsvpRes.json();
      setRsvps(rsvpData.rsvps || []);
      setIsAuthenticated(true);
      --------------------------------------------------------- */
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered Data
  const filteredRsvps = rsvps.filter(r => {
    if (filter === 'all') return true;
    return r.attending === filter;
  });

  const countAttending = rsvps.filter(r => r.attending === 'yes').reduce((acc, r) => acc + (r.headcount || 1), 0);
  const countNotAttending = rsvps.filter(r => r.attending === 'no').length;

  // Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EBD8] flex flex-col justify-center items-center p-6 text-[#4A2810]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-[#E6D6C0]">
          <h1 className="font-['Cinzel'] text-2xl font-bold mb-2">RSVP Dashboard</h1>
          <p className="font-['Cormorant_Garamond'] text-lg mb-6 opacity-80">Enter your PIN to access.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(null);
              }}
              placeholder="Enter PIN"
              className="px-4 py-3 border border-[#D8C7B0] rounded-lg text-center font-bold tracking-widest outline-none focus:border-[#8C5D38] bg-[#FAF5EB]"
              maxLength={10}
            />
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button 
              type="submit" 
              disabled={loading || !pin}
              className="bg-[#4A2810] text-[#F5D78E] py-3 rounded-lg font-bold tracking-wider hover:bg-[#3A1F10] transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-[#F6EBD8] text-[#4A2810] p-4 md:p-8 font-['Cormorant_Garamond']">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E6D6C0]">
          <div>
            <h1 className="font-['Cinzel'] text-3xl font-bold tracking-wider">RSVP Dashboard</h1>
            <p className="text-lg opacity-80 font-medium">Saaransh & Stuti</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#FAF5EB] px-6 py-3 rounded-xl border border-[#D8C7B0] text-center">
              <p className="text-sm uppercase tracking-widest font-bold opacity-70">Total Guests</p>
              <p className="text-2xl font-['Cinzel'] font-bold">{countAttending}</p>
            </div>
            <div className="bg-[#FAF5EB] px-6 py-3 rounded-xl border border-[#D8C7B0] text-center">
              <p className="text-sm uppercase tracking-widest font-bold opacity-70">Not Attending</p>
              <p className="text-2xl font-['Cinzel'] font-bold">{countNotAttending}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E6D6C0] overflow-hidden">
          <div className="p-4 border-b border-[#E6D6C0] flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide ${filter === 'all' ? 'bg-[#4A2810] text-[#F5D78E]' : 'bg-[#FAF5EB] hover:bg-[#F0E5D5]'}`}>All ({rsvps.length})</button>
            <button onClick={() => setFilter('yes')} className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide ${filter === 'yes' ? 'bg-[#4A2810] text-[#F5D78E]' : 'bg-[#FAF5EB] hover:bg-[#F0E5D5]'}`}>Attending</button>
            <button onClick={() => setFilter('no')} className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide ${filter === 'no' ? 'bg-[#4A2810] text-[#F5D78E]' : 'bg-[#FAF5EB] hover:bg-[#F0E5D5]'}`}>Not Attending</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF5EB] font-['Cinzel'] text-sm tracking-widest uppercase border-b border-[#E6D6C0]">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Guests</th>
                  <th className="px-6 py-4 font-bold">Contact</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-lg font-medium opacity-70">
                      No RSVPs found.
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp, idx) => (
                    <tr key={rsvp._id || idx} className="border-b border-[#E6D6C0]/50 hover:bg-[#FAF5EB]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-lg">{rsvp.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          rsvp.attending === 'yes' ? 'bg-green-100 text-green-800' :
                          rsvp.attending === 'no' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rsvp.attending}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-lg">{rsvp.attending === 'yes' ? (rsvp.headcount || 1) : '-'}</td>
                      <td className="px-6 py-4 font-sans text-sm">{rsvp.email || rsvp.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm max-w-[250px] truncate" title={rsvp.message}>{rsvp.message || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm font-bold opacity-50 uppercase tracking-widest">
          Inviteque Dashboard
        </div>
      </div>
    </div>
  );
}
