import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import '../Styles/HeatMap.css';

const getTier = (score) => {
  if (score < 30) return 'critical';
  if (score < 50) return 'poor';
  if (score < 70) return 'good';
  return 'excellent';
};

const LEGEND = [
  { tier: 'critical',  label: 'Critical',  range: '< 30%'  },
  { tier: 'poor',      label: 'Poor',      range: '30–49%' },
  { tier: 'good',      label: 'Good',      range: '50–69%' },
  { tier: 'excellent', label: 'Excellent', range: '70%+'   },
];

/* ── Skeleton grid ── */
const GridSkeleton = () => (
  <div className="hm-grid">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="hm-cell-skeleton sp-skeleton" />
    ))}
  </div>
);

/* ─────────────────────────────── */

const HeatMap = () => {
  const [allSchools,    setAllSchools]    = useState([]);
  const [allYears,      setAllYears]      = useState([]);
  const [selectedYear,  setSelectedYear]  = useState(2022);
  const [selectedMetric,setSelectedMetric]= useState('reading');
  const [loading,       setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schoolsData, yearsData] = await Promise.all([
          api.getSchools({}),
          api.getYears()
        ]);
        setAllSchools(schoolsData);
        const numericYears = yearsData.map(y => parseInt(y)).sort((a, b) => a - b);
        setAllYears(numericYears);
        if (numericYears.length > 0) setSelectedYear(numericYears[numericYears.length - 1]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredSchools = allSchools.filter(s => s.Year === selectedYear);

  const handleCellClick = (school) => {
    navigate('/school', {
      state: {
        school: {
          ...school,
          AvgReading: school.Reading_Level_Percentage,
          AvgMath:    school.Math_Level_Percentage
        }
      }
    });
  };

  /* Distribution summary */
  const distribution = LEGEND.map(({ tier, label }) => ({
    tier, label,
    count: filteredSchools.filter(s => {
      const score = selectedMetric === 'reading'
        ? s.Reading_Level_Percentage
        : s.Math_Level_Percentage;
      return getTier(score || 0) === tier;
    }).length
  }));

  return (
    <div className="hm-page">

      {/* ── Header ── */}
      <div className="hm-header">
        <div className="hm-header-left">
          <p className="hm-eyebrow">ShikshaPulse · Heat Map</p>
          <h1 className="hm-title">Performance Heat Map</h1>
          <p className="hm-subtitle">
            {loading ? 'Loading data…' : `${filteredSchools.length} state–grade entries for ${selectedYear}`}
          </p>
        </div>
      </div>

      <div className="hm-divider" />

      {/* ── Controls ── */}
      <div className="hm-toolbar">
        {/* Year toggle */}
        <div className="hm-control-group">
          <span className="hm-control-label">Year</span>
          <div className="hm-btn-group">
            {allYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`hm-toggle-btn${selectedYear === year ? ' hm-toggle-btn--active' : ''}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Metric toggle */}
        <div className="hm-control-group">
          <span className="hm-control-label">Metric</span>
          <div className="hm-btn-group">
            {['reading', 'math'].map(m => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`hm-toggle-btn${selectedMetric === m ? ' hm-toggle-btn--active' : ''}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="hm-legend">
          {LEGEND.map(({ tier, label, range }) => (
            <div key={tier} className="hm-legend-item">
              <span className={`hm-legend-swatch hm-swatch--${tier}`} />
              <span className="hm-legend-label">{label}</span>
              <span className="hm-legend-range">{range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Distribution summary bar ── */}
      {!loading && (
        <div className="hm-dist-bar-wrap">
          {distribution.map(({ tier, label, count }) => (
            <div
              key={tier}
              className={`hm-dist-segment hm-dist-segment--${tier}`}
              style={{ flex: count }}
              title={`${label}: ${count} entries`}
            >
              {count > 0 && <span className="hm-dist-count">{count}</span>}
            </div>
          ))}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <GridSkeleton />
      ) : filteredSchools.length === 0 ? (
        <div className="hm-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <h3>No data for {selectedYear}</h3>
          <p>Try selecting a different year above.</p>
        </div>
      ) : (
        <div className="hm-grid">
          {filteredSchools.map((school, index) => {
            const score    = selectedMetric === 'reading'
              ? school.Reading_Level_Percentage
              : school.Math_Level_Percentage;
            const safeScore = score || 0;
            const tier      = getTier(safeScore);

            return (
              <div
                key={index}
                className={`hm-cell hm-cell--${tier}`}
                onClick={() => handleCellClick(school)}
              >
                <span className="hm-cell-state">{school.State}</span>
                <span className="hm-cell-grade">Grade {school.Grade}</span>
                <span className="hm-cell-pct">{safeScore.toFixed(1)}%</span>
                <span className={`hm-cell-tier-dot hm-cell-tier-dot--${tier}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeatMap;