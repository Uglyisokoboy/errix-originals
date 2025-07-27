"use client";
import DonateButton from "./DonateButton";
import React, { useEffect, useRef, useState } from "react";

export default function DonateSection() {
  const [images, setImages] = useState([]);
  const [campaignImages, setCampaignImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [campaignImagesLoaded, setCampaignImagesLoaded] = useState(false);

  useEffect(() => {
    // Check admin
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    setIsAdmin(user && user.role === 'admin');
    // Fetch impact images
    fetch('http://localhost:4000/api/impact-images')
      .then(async res => {
        try {
          const data = await res.json();
          if (data.success) setImages(data.images);
        } catch {}
        setImagesLoaded(true);
      });
    // Fetch campaign images
    fetch('http://localhost:4000/api/campaign-images')
      .then(async res => {
        try {
          const data = await res.json();
          if (data.success) setCampaignImages(data.images);
        } catch {}
        setCampaignImagesLoaded(true);
      });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError("Please select an image.");
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:4000/api/impact-images', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImages([data.image, ...images]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setUploading(false);
  };

  return (
    <section id="donate" className="donate">
      <div className="donate-container">
        <div className="donate-content">
          <h2 className="donate-title">Support Our Campaigns</h2>
          <p className="donate-description">Your donation fuels community impact — from mentorship to mobility. 100% of donations go directly into outreach materials, school kits, and community activation.</p>
          <DonateButton />
        </div>
        <div className="campaign-gallery">
          <h3 className="gallery-title">Recent Impact</h3>
          {isAdmin && (
            <></>
          )}
          <div className="gallery-grid" id="campaignGallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {!(imagesLoaded && campaignImagesLoaded) && <div style={{ color: '#888', fontSize: 15 }}>Loading...</div>}
            {(imagesLoaded && campaignImagesLoaded && images.length === 0 && campaignImages.length === 0) && <div style={{ color: '#888', fontSize: 15 }}>No images yet.</div>}
            {/* Impact images (admin uploads) */}
            {imagesLoaded && images.map(img => (
              <div key={img._id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <img src={`http://localhost:4000/uploads/${img.filename}`} alt="Impact" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '0.5rem 1rem', fontSize: 13, color: '#222', textAlign: 'center' }}>
                  Uploaded {new Date(img.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {/* Campaign images */}
            {campaignImagesLoaded && campaignImages.map((img, i) => (
              <div key={img.image + i} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <img src={img.image} alt={img.caption || 'Campaign'} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '0.5rem 1rem', fontSize: 13, color: '#222', textAlign: 'center' }}>
                  {img.caption || 'Campaign'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="partners-section">
          <h4 className="partners-title">Our Partners</h4>
          <div className="partners-grid">
            <div className="partner-logo">
              <i className="fas fa-building"></i>
              <span>Community Foundation</span>
            </div>
            <div className="partner-logo">
              <i className="fas fa-graduation-cap"></i>
              <span>Education Initiative</span>
            </div>
            <div className="partner-logo">
              <i className="fas fa-hands-helping"></i>
              <span>Local Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 