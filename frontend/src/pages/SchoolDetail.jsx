import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SchoolDetails from '../components/SchoolDetails.jsx';
import api from '../services/api.js';
import '../Styles/Schooldetail.css';

/* ── Skeleton ── */
const DetailSkeleton = () => (
  <div className="sd-skeleton-wrap">
    <div className="sp-skeleton" style={{ width: '160px', height: '14px', borderRadius: '6px' }} />
    <div className="sp-skeleton" style={{ width: '280px', height: '2rem', borderRadius: '6px', marginTop: '12px' }} />
    <div className="sp-skeleton" style={{ width: '200px', height: '14px', borderRadius: '6px', marginTop: '8px' }} />
    <div className="sd-skeleton-cards">
      {[1, 2, 3].map(i => (
        <div key={i} className="sp-skeleton" style={{ flex: 1, height: '120px', borderRadius: '12px' }} />
      ))}
    </div>
    <div className="sp-skeleton" style={{ width: '100%', height: '280px', borderRadius: '14px', marginTop: '24px' }} />
  </div>
);

/* ─────────────────────────────── */

const SchoolDetailPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [school,  setSchool]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchool = async () => {
      try {
        if (location.state?.school) {
          setSchool(location.state.school);
        } else {
          const allSchools = await api.getSchools();
          const latestYear = Math.max(...allSchools.map(item => item.Year));
          const found = allSchools.find(s => s.Year === latestYear);
          if (found) {
            setSchool({
              ...found,
              AvgReading: found.Reading_Level_Percentage,
              AvgMath:    found.Math_Level_Percentage
            });
          }
        }
      } catch (error) {
        console.error('Error loading school:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSchool();
  }, [location.state]);

  if (loading) {
    return (
      <div className="sd-page">
        <DetailSkeleton />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="sd-page">
        <div className="sd-not-found">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h2>Entry not found</h2>
          <p>We couldn't locate this state–grade record. It may have been filtered out.</p>
          <button className="sd-btn sd-btn--primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-page">

      {/* ── Breadcrumb / back nav ── */}
      <div className="sd-topbar">
        <button className="sd-back-btn" onClick={() => navigate(-1)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="sd-breadcrumb">
          <span className="sd-breadcrumb-item" onClick={() => navigate('/')}>Dashboard</span>
          <span className="sd-breadcrumb-sep">/</span>
          <span className="sd-breadcrumb-item sd-breadcrumb-item--active">
            {school.State} · Grade {school.Grade}
          </span>
        </div>
      </div>

      {/* ── Detail component (unchanged) ── */}
      <div className="sd-content">
        <SchoolDetails school={school} />
      </div>

    </div>
  );
};

export default SchoolDetailPage;