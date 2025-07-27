"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { FaHeadset, FaEnvelopeOpenText, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

export default function SupportPage() {
  const { user } = useAuth();
  // Customer Support state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [errTickets, setErrTickets] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("");

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  async function fetchTickets() {
    setLoadingTickets(true); setErrTickets("");
    try {
      const res = await fetch("http://localhost:4000/api/tickets", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
      else setErrTickets(data.error || "Failed to fetch tickets.");
    } catch {
      setErrTickets("Network error.");
    }
    setLoadingTickets(false);
  }

  async function handleTicketSubmit(e) {
    e.preventDefault();
    setTicketStatus("");
    if (!ticketSubject || !ticketMessage) return;
    try {
      const res = await fetch("http://localhost:4000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketStatus("Ticket submitted!");
        setTicketSubject(""); setTicketMessage("");
        fetchTickets();
      } else {
        setTicketStatus(data.error || "Failed to submit ticket.");
      }
    } catch {
      setTicketStatus("Network error.");
    }
  }

  async function handleReplySubmit(e) {
    e.preventDefault();
    setReplyStatus("");
    if (!replyMessage || !activeTicket) return;
    try {
      const res = await fetch(`http://localhost:4000/api/tickets/${activeTicket._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ message: replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyStatus("Reply sent!");
        setReplyMessage("");
        fetchTickets();
        setActiveTicket(data.ticket);
      } else {
        setReplyStatus(data.error || "Failed to send reply.");
      }
    } catch {
      setReplyStatus("Network error.");
    }
  }

  if (!user) {
    return <div style={{ color: '#fff', padding: 32 }}>Please log in to access support.</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", background: "#181818", borderRadius: 20, boxShadow: "0 4px 24px #111", padding: 0, overflow: 'hidden' }}>
      {/* Hero/Header */}
      <div style={{ background: 'linear-gradient(90deg, #ff6b81 0%, #232323 100%)', padding: '2rem 2rem 1.5rem 2rem', display: 'flex', alignItems: 'center', gap: 20 }}>
        <FaHeadset color="#fff" size={48} style={{ background: '#ff6b81', borderRadius: '50%', padding: 10, boxShadow: '0 2px 8px #000' }} />
        <div>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>Customer Support & Tickets</h2>
          <div style={{ color: '#fff', fontSize: 16, marginTop: 6, opacity: 0.92 }}>Need help? Submit a ticket and our team will get back to you as soon as possible.</div>
        </div>
      </div>
      {/* Support Form */}
      <form onSubmit={handleTicketSubmit} style={{ display: "flex", flexDirection: 'column', gap: 12, background: '#232323', padding: 24, borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Subject" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} required style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 8, border: "1px solid #333", fontSize: 16, background: '#181818', color: '#fff' }} />
          <input type="text" placeholder="Message" value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} required style={{ flex: 2, minWidth: 180, padding: 12, borderRadius: 8, border: "1px solid #333", fontSize: 16, background: '#181818', color: '#fff' }} />
          <button type="submit" style={{ background: "#ff6b81", color: "#fff", border: "none", borderRadius: 8, padding: '0 24px', fontWeight: 700, cursor: "pointer", fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }} title="Submit Ticket">
            <FaPaperPlane /> Submit
          </button>
        </div>
        {ticketStatus && <div style={{ color: ticketStatus.includes("submitted") ? "#2ecc71" : "#ff6b6b", marginBottom: 0, fontWeight: 600 }}>{ticketStatus}</div>}
      </form>
      {/* Tickets List */}
      <div style={{ padding: 24, background: '#181818' }}>
        {loadingTickets ? (
          <div style={{ color: "#bbb", padding: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaSpinner className="spin" /> Loading tickets...</div>
        ) : errTickets ? (
          <div style={{ color: "#ff6b6b", padding: 16 }}>{errTickets}</div>
        ) : tickets.length === 0 ? (
          <div style={{ color: "#bbb", fontSize: 16, textAlign: 'center', padding: 32 }}>
            <FaEnvelopeOpenText size={32} style={{ marginBottom: 8, color: '#ff6b81' }} /><br />No support tickets yet.<br /><span style={{ fontSize: 14, color: '#888' }}>Submit your first ticket above!</span>
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <div style={{ color: "#bbb", fontWeight: 600, marginBottom: 12, fontSize: 17 }}>Your Tickets</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tickets.map(ticket => (
                <li key={ticket._id} style={{ background: activeTicket && activeTicket._id === ticket._id ? '#232323' : '#222', color: "#fff", borderRadius: 10, padding: 16, boxShadow: activeTicket && activeTicket._id === ticket._id ? '0 2px 12px #111' : 'none', cursor: "pointer", border: activeTicket && activeTicket._id === ticket._id ? '2px solid #ff6b81' : '1px solid #222', display: 'flex', alignItems: 'center', gap: 16 }} onClick={() => setActiveTicket(ticket)} title="View ticket thread">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{ticket.subject}</div>
                    <div style={{ color: '#bbb', fontSize: 14, marginTop: 2 }}>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: ticket.status === 'closed' ? '#bbb' : '#ff6b81', background: ticket.status === 'closed' ? '#333' : '#ff6b81', borderRadius: 6, padding: '2px 10px', display: 'inline-block' }}>{ticket.status === 'closed' ? <FaCheckCircle style={{ marginRight: 4 }} /> : <FaHeadset style={{ marginRight: 4 }} />}{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                  </div>
                </li>
              ))}
            </ul>
            {/* Ticket Thread */}
            {activeTicket && (
              <div style={{ marginTop: 24, background: "#232323", borderRadius: 12, padding: 20, boxShadow: '0 2px 12px #111', position: 'relative' }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <FaEnvelopeOpenText color="#ff6b81" style={{ marginRight: 8 }} />
                  <h4 style={{ color: "#fff", margin: 0, fontSize: 19 }}>{activeTicket.subject}</h4>
                  <button onClick={() => setActiveTicket(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ff6b81", cursor: "pointer", fontSize: 22, fontWeight: 700 }} title="Close thread">×</button>
                </div>
                <div style={{ color: "#bbb", fontSize: 14, marginBottom: 8 }}>Status: <span style={{ fontWeight: 700, color: activeTicket.status === 'closed' ? '#bbb' : '#ff6b81' }}>{activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                  {/* Initial message as chat bubble */}
                  <div style={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
                    <div style={{ background: '#ff6b81', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: 15, marginBottom: 2, boxShadow: '0 2px 8px #111' }} title="Your message">
                      <b>You:</b> {activeTicket.message}
                    </div>
                    <div style={{ color: '#bbb', fontSize: 12, textAlign: 'right' }}>{new Date(activeTicket.createdAt).toLocaleString()}</div>
                  </div>
                  {/* Responses as chat bubbles */}
                  {activeTicket.responses && activeTicket.responses.length > 0 && activeTicket.responses.map((resp, idx) => (
                    <div key={idx} style={{ alignSelf: resp.from === user.email ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <div style={{ background: resp.from === user.email ? '#ff6b81' : '#232323', color: resp.from === user.email ? '#fff' : '#fff', borderRadius: resp.from === user.email ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 16px', fontSize: 15, marginBottom: 2, boxShadow: '0 2px 8px #111', border: resp.from === user.email ? 'none' : '1px solid #333' }} title={resp.from === user.email ? 'Your reply' : 'Support reply'}>
                        <b>{resp.from === user.email ? 'You' : 'Support'}:</b> {resp.message}
                      </div>
                      <div style={{ color: '#bbb', fontSize: 12, textAlign: resp.from === user.email ? 'right' : 'left' }}>{new Date(resp.date).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                {activeTicket.status !== "closed" && (
                  <form onSubmit={handleReplySubmit} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: 'center' }}>
                    <input type="text" placeholder="Your reply" value={replyMessage} onChange={e => setReplyMessage(e.target.value)} required style={{ flex: 1, minWidth: 120, padding: 10, borderRadius: 8, border: "1px solid #333", fontSize: 15, background: '#181818', color: '#fff' }} />
                    <button type="submit" style={{ background: "#ff6b81", color: "#fff", border: "none", borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: "pointer", fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }} title="Send reply">
                      <FaPaperPlane /> Send
                    </button>
                  </form>
                )}
                {replyStatus && <div style={{ color: replyStatus.includes("sent") ? "#2ecc71" : "#ff6b6b", marginTop: 8, fontWeight: 600 }}>{replyStatus}</div>}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 800px) {
          div[style*='max-width: 700px'] { max-width: 98vw !important; padding: 0 !important; }
          form[style*='padding: 24px'] { padding: 16px !important; }
          div[style*='padding: 24px'] { padding: 12px !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
} 