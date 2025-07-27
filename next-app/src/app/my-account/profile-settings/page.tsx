'use client';
import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { FaCrown, FaCamera, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaStickyNote, FaCalendarAlt, FaShieldAlt, FaGem } from 'react-icons/fa';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useMediaQuery } from 'react-responsive';

const SECTIONS = [
  { key: 'personal', label: 'Personal Info', icon: FaUser },
  { key: 'security', label: 'Login & Security', icon: FaShieldAlt },
  { key: 'addresses', label: 'Addresses', icon: FaGem },
  { key: 'language', label: 'Language / Region', icon: FaGem },
  { key: 'communication', label: 'Communication Preferences', icon: FaGem },
  { key: 'loyalty', label: 'Loyalty & Member Level', icon: FaGem },
  { key: 'personalization', label: 'Order Personalization', icon: FaGem },
  { key: 'privacy', label: 'Data & Privacy', icon: FaGem },
  { key: 'logout', label: 'Logout & Deactivate', icon: FaGem },
];

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDob, setEditDob] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoEditMode, setPhotoEditMode] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const fileInputRef = useRef(null);

  // Premium animation states
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardElevation, setCardElevation] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setCardElevation(1), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (user) {
      setEditName(user.fullName || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      setEditGender(user.gender || '');
      setEditBio(user.bio || '');
      setEditDob(user.dob || '');
    }
  }, [user]);

  function handleEdit() {
    setEditMode(true);
    setError('');
    setSuccess('');
  }

  function handleCancel() {
    setEditMode(false);
    setError('');
    setSuccess('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    if (!editName.trim()) { setError('Name is required.'); setSaving(false); return; }
    if (!validateEmail(editEmail)) { setError('Invalid email.'); setSaving(false); return; }
    if (!validatePhone(editPhone)) { setError('Invalid phone number.'); setSaving(false); return; }
    
    const profile = {
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      gender: editGender,
      bio: editBio,
      dob: editDob,
    };
    
    const result = await updateProfile(profile);
    if (result.ok) {
      setEditMode(false);
      setSaving(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to update profile.');
      setSaving(false);
    }
  }

  function validateEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  function validatePhone(phone) {
    return phone === '' || /^[0-9+\-() ]{7,}$/.test(phone);
  }

  function handlePhotoEditClick() {
    setPhotoEditMode(true);
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  function handlePhotoDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoEditMode(true);
    }
  }

  function handlePhotoDragOver(e) { e.preventDefault(); }

  function handlePhotoCancel() {
    setPhoto(null);
    setPhotoPreview('');
    setPhotoEditMode(false);
  }

  async function handlePhotoSave() {
    setPhotoEditMode(false);
  }

  function getInitials(name) {
    if (!name || typeof name !== 'string') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const nodeRef = useRef(null);
  const sidebarRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 800 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          color: '#888', 
          fontSize: 18,
          fontWeight: 500
        }}>
          <div style={{
            width: 24,
            height: 24,
            border: '3px solid #333',
            borderTop: '3px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: 48, 
        alignItems: 'flex-start', 
        width: '100%', 
        maxWidth: 1200, 
        margin: '0 auto', 
        position: 'relative' 
      }}>
        {/* Premium Dark Sidebar */}
        <div ref={sidebarRef} style={{ 
          position: isMobile ? 'fixed' : 'static', 
          left: isMobile && !sidebarOpen ? '-100vw' : 0, 
          top: 0, 
          zIndex: 50, 
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          width: isMobile ? 280 : 240, 
          height: isMobile ? '100vh' : 'auto', 
          background: 'rgba(20, 20, 20, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? 0 : 24, 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)', 
          padding: isMobile ? '60px 24px 24px 24px' : '32px 0', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 8,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Active indicator */}
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            width: 4, 
            height: 48, 
            borderRadius: '0 4px 4px 0', 
            background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)', 
            transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: `translateY(${SECTIONS.findIndex(s => s.key === activeSection) * 56}px)` 
          }} />
          
          {SECTIONS.map((section, idx) => {
            const IconComponent = section.icon;
            return (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            style={{
                  background: activeSection === section.key ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: activeSection === section.key ? '#fff' : '#888',
              border: 'none',
                  borderRadius: 16,
                  padding: '16px 24px',
                  fontWeight: activeSection === section.key ? 600 : 500,
                  fontSize: 15,
              textAlign: 'left',
              cursor: 'pointer',
                  marginBottom: 4,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.key) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#ccc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.key) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }
                }}
              >
                <IconComponent style={{ fontSize: 18, opacity: 0.8 }} />
            {section.label}
          </button>
            );
          })}
      </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeSection}
            nodeRef={nodeRef}
              timeout={400}
            classNames="fade-slide"
            unmountOnExit
          >
            <div ref={nodeRef} style={{ width: '100%' }}>
              {activeSection === 'personal' && (
                  <div style={{ 
                    maxWidth: 600, 
                    width: '100%', 
                    margin: '0 auto',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    {/* Premium Dark Profile Card */}
                    <div style={{
                      background: 'rgba(25, 25, 25, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 32,
                      boxShadow: `0 ${20 + cardElevation * 10}px ${60 + cardElevation * 20}px rgba(0, 0, 0, ${0.4 + cardElevation * 0.1}), 0 1px 0 rgba(255, 255, 255, 0.05)`,
                      padding: '48px 40px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Premium background pattern */}
                  <div style={{
                    position: 'absolute',
                        top: 0,
                    left: 0,
                        right: 0,
                        height: 120,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                        borderRadius: '32px 32px 0 0'
                      }} />

                      {/* Profile Header */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        marginBottom: 48,
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {/* Premium Profile Photo */}
                        <div style={{ 
                          position: 'relative', 
                          width: 120, 
                          height: 120, 
                          marginBottom: 24 
                        }}>
                          <div
                        style={{
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              background: photoPreview 
                                ? `url(${photoPreview}) center/cover no-repeat` 
                                : 'linear-gradient(135deg, #333 0%, #555 50%, #444 100%)',
                              border: '4px solid #fff',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 42,
                              fontWeight: 700,
                              color: '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              userSelect: 'none',
                              position: 'relative',
                        }}
                        onDrop={handlePhotoDrop}
                        onDragOver={handlePhotoDragOver}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)';
                            }}
                      >
                        {!photoPreview && getInitials(user.fullName)}
                            
                            {/* Premium Camera Icon */}
                            <div style={{
                              position: 'absolute',
                              right: 4,
                              bottom: 4,
                              background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
                              borderRadius: '50%',
                              padding: 12,
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                              border: '2px solid #fff',
                              cursor: 'pointer',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}>
                              <FaCamera style={{ color: '#000', fontSize: 16 }} />
                            </div>
                      </div>
                          
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                          />
                        </div>

                        {/* Premium User Info */}
                        <div style={{ textAlign: 'center' }}>
                          <h1 style={{ 
                            fontSize: 32, 
                            fontWeight: 700, 
                            color: '#fff', 
                            margin: '0 0 8px 0',
                            letterSpacing: '-0.02em'
                          }}>
                            {user.fullName || 'Complete Your Profile'}
                          </h1>
                          <p style={{ 
                            color: '#ccc', 
                            fontSize: 16, 
                            margin: '0 0 4px 0',
                            fontWeight: 500
                          }}>
                            {user.email}
                          </p>
                          <div style={{ 
                            color: '#888', 
                            fontSize: 14, 
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                          }}>
                            <FaGem style={{ fontSize: 12 }} />
                            Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                          </div>
                    </div>
                      </div>

                      {/* Premium Form */}
                      <form autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {/* Full Name Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'name' ? '#fff' : '#888',
                            fontWeight: focusedField === 'name' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editName : (user.fullName || "")).length > 0 || focusedField === 'name' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaUser style={{ marginRight: 8, fontSize: 14 }} />
                            Full Name
                          </div>
                        <input
                          type="text"
                            value={editMode ? editName : (user.fullName || "")}
                          onChange={e => editMode && setEditName(e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('name')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'name' ? '#fff' : hoveredField === 'name' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'name' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                        </div>

                        {/* Email Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'email' ? '#fff' : '#888',
                            fontWeight: focusedField === 'email' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editEmail : (user.email || "")).length > 0 || focusedField === 'email' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaEnvelope style={{ marginRight: 8, fontSize: 14 }} />
                            Email Address
                      </div>
                        <input
                          type="email"
                            value={editMode ? editEmail : (user.email || "")}
                          onChange={e => editMode && setEditEmail(e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('email')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'email' ? '#fff' : hoveredField === 'email' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                        </div>

                        {/* Phone Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'phone' ? '#fff' : '#888',
                            fontWeight: focusedField === 'phone' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editPhone : (user.phone || "")).length > 0 || focusedField === 'phone' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaPhone style={{ marginRight: 8, fontSize: 14 }} />
                            Phone Number
                      </div>
                        <input
                          type="tel"
                            value={editMode ? editPhone : (user.phone || "")}
                          onChange={e => editMode && setEditPhone(e.target.value)}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('phone')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'phone' ? '#fff' : hoveredField === 'phone' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'phone' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                        </div>

                        {/* Gender Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'gender' ? '#fff' : '#888',
                            fontWeight: focusedField === 'gender' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editGender : (user.gender || "")).length > 0 || focusedField === 'gender' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaVenusMars style={{ marginRight: 8, fontSize: 14 }} />
                            Gender
                      </div>
                        <input
                          type="text"
                            value={editMode ? editGender : (user.gender || "")}
                          onChange={e => editMode && setEditGender(e.target.value)}
                            onFocus={() => setFocusedField('gender')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('gender')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'gender' ? '#fff' : hoveredField === 'gender' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'gender' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                        </div>

                        {/* Bio Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'bio' ? '#fff' : '#888',
                            fontWeight: focusedField === 'bio' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editBio : (user.bio || "")).length > 0 || focusedField === 'bio' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaStickyNote style={{ marginRight: 8, fontSize: 14 }} />
                            Bio
                      </div>
                        <input
                          type="text"
                            value={editMode ? editBio : (user.bio || "")}
                          onChange={e => editMode && setEditBio(e.target.value)}
                            onFocus={() => setFocusedField('bio')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('bio')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'bio' ? '#fff' : hoveredField === 'bio' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'bio' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                        </div>

                        {/* Date of Birth Field */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 16,
                            fontSize: 16,
                            color: focusedField === 'dob' ? '#fff' : '#888',
                            fontWeight: focusedField === 'dob' ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: (editMode ? editDob : (user.dob || "")).length > 0 || focusedField === 'dob' 
                              ? 'translateY(-8px) scale(0.85)' 
                              : 'none',
                            background: 'rgba(25, 25, 25, 0.95)',
                            padding: '0 8px',
                            borderRadius: 6,
                            zIndex: 2
                          }}>
                            <FaCalendarAlt style={{ marginRight: 8, fontSize: 14 }} />
                            Date of Birth
                      </div>
                        <input
                          type="date"
                            value={editMode ? editDob : (user.dob || "")}
                          onChange={e => editMode && setEditDob(e.target.value)}
                            onFocus={() => setFocusedField('dob')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('dob')}
                            onMouseLeave={() => setHoveredField(null)}
                            placeholder=" "
                          readOnly={!editMode}
                            style={{
                              width: '100%',
                              padding: '24px 16px 16px 16px',
                              border: '2px solid',
                              borderColor: focusedField === 'dob' ? '#fff' : hoveredField === 'dob' ? '#555' : '#333',
                              borderRadius: 16,
                              fontSize: 16,
                              fontWeight: 500,
                              color: '#fff',
                              background: editMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                              outline: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: focusedField === 'dob' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          />
                      </div>

                        {/* Premium Action Buttons */}
                        <div style={{ 
                          display: 'flex', 
                          gap: 16, 
                          marginTop: 16, 
                          justifyContent: 'flex-end',
                          paddingTop: 24,
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {editMode ? (
                            <>
                          <button
                                type="button"
                            onClick={handleCancel}
                                style={{ 
                                  background: 'transparent', 
                                  color: '#888', 
                                  border: '2px solid #444', 
                                  borderRadius: 12, 
                                  padding: '14px 28px', 
                                  fontWeight: 600, 
                                  fontSize: 15, 
                                  cursor: 'pointer', 
                                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                  outline: 'none'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#666';
                                  e.currentTarget.style.color = '#ccc';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#444';
                                  e.currentTarget.style.color = '#888';
                                }}
                            disabled={saving}
                              >
                                Cancel
                              </button>
                          <button
                                type="submit"
                                onClick={(e) => { e.preventDefault(); handleSave(); }}
                                style={{ 
                                  background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)', 
                                  color: '#000', 
                                  border: 'none', 
                                  borderRadius: 12, 
                                  padding: '14px 32px', 
                                  fontWeight: 600, 
                                  fontSize: 15, 
                                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)', 
                                  cursor: 'pointer', 
                                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 10,
                                  outline: 'none',
                                  minWidth: 120,
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                                }}
                            disabled={saving}
                              >
                                {saving ? (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                      width: 16,
                                      height: 16,
                                      border: '2px solid rgba(0, 0, 0, 0.3)',
                                      borderTop: '2px solid #000',
                                      borderRadius: '50%',
                                      animation: 'spin 0.8s linear infinite'
                                    }}></div>
                                    Saving...
                                  </span>
                                ) : (
                                  'Save Changes'
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={handleEdit}
                              style={{ 
                                background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)', 
                                color: '#000', 
                                border: 'none', 
                                borderRadius: 12, 
                                padding: '14px 32px', 
                                fontWeight: 600, 
                                fontSize: 15, 
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                              }}
                            >
                              Edit Profile
                            </button>
                          )}
                        </div>

                        {/* Premium Status Messages */}
                        {error && (
                          <div style={{ 
                            color: '#ff6b6b', 
                            fontWeight: 500, 
                            marginTop: 16, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8,
                            padding: '12px 16px',
                            background: 'rgba(255, 107, 107, 0.1)',
                            borderRadius: 12,
                            border: '1px solid rgba(255, 107, 107, 0.2)'
                          }}>
                            <FaExclamationCircle style={{ color: '#ff6b6b', fontSize: 16 }} />
                            {error}
                          </div>
                        )}
                        
                        {success && (
                          <div style={{ 
                            color: '#51cf66', 
                            fontWeight: 500, 
                            marginTop: 16, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8,
                            padding: '12px 16px',
                            background: 'rgba(81, 207, 102, 0.1)',
                            borderRadius: 12,
                            border: '1px solid rgba(81, 207, 102, 0.2)'
                          }}>
                            <FaCheckCircle style={{ color: '#51cf66', fontSize: 16 }} />
                            {success}
                        </div>
                      )}
                      </form>

                      {/* Premium Footer */}
                      <div style={{ 
                        color: '#666', 
                        fontSize: 14, 
                        marginTop: 32, 
                        textAlign: 'center', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 8,
                        padding: '16px',
                        background: 'rgba(40, 40, 40, 0.5)',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <FaShieldAlt style={{ color: '#666', fontSize: 14 }} />
                        Your information is protected with enterprise-grade security
                    </div>
                  </div>
                </div>
              )}
                
                {activeSection !== 'personal' && (
                  <SectionPlaceholder title={SECTIONS.find(s => s.key === activeSection)?.label || 'Section'} />
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .fade-slide-enter {
          opacity: 0;
          transform: translateX(20px);
        }
        .fade-slide-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-slide-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .fade-slide-exit-active {
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

function SectionPlaceholder({ title }) {
  return (
    <div style={{
      background: 'rgba(25, 25, 25, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 32,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)',
      padding: '48px 40px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <h2 style={{ 
        fontWeight: 700, 
        fontSize: 28, 
        marginBottom: 16,
        color: '#fff',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h2>
      <p style={{ 
        color: '#888', 
        fontSize: 16,
        fontWeight: 500,
        margin: 0
      }}>
        This section is coming soon with premium features.
      </p>
    </div>
  );
} 