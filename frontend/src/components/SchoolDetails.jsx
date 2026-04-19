import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import '../Styles/Schooldetails.css';

/* ── Helpers ── */
const getPerfTier = (val) => {
  if (val < 30) return 'critical';
  if (val < 50) return 'poor';
  if (val < 70) return 'good';
  return 'excellent';
};

const TIER_META = {
  critical:  { label: 'Critical',  color: '#ef4444' },
  poor:      { label: 'Poor',      color: '#f59e0b' },
  good:      { label: 'Good',      color: '#10b981' },
  excellent: { label: 'Excellent', color: '#3b82f6' },
};

/* ── Custom tooltip for the chart ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="scd-tooltip">
      <p className="scd-tooltip-year">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="scd-tooltip-row">
          <span className="scd-tooltip-dot" style={{ background: p.fill }} />
          <span>{p.dataKey}</span>
          <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

/* ── Radial-style score ring (pure CSS) ── */
const ScoreRing = ({ value, label, tier }) => {
  const meta  = TIER_META[tier];
  const pct   = Math.min(value, 100);
  const dash  = 2 * Math.PI * 30; // circumference for r=30
  const offset = dash - (pct / 100) * dash;

  return (
    <div className="scd-ring-wrap">
      <svg className="scd-ring-svg" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" className="scd-ring-track" />
        <circle
          cx="36" cy="36" r="30"
          className="scd-ring-fill"
          stroke={meta.color}
          strokeDasharray={dash}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="scd-ring-inner">
        <span className="scd-ring-value">{value?.toFixed(1)}</span>
        <span className="scd-ring-pct">%</span>
      </div>
      <p className="scd-ring-label">{label}</p>
      <span className={`scd-ring-badge scd-ring-badge--${tier}`}>{meta.label}</span>
    </div>
  );
};

/* ─────────────────────────────── */

const SchoolDetails = ({ school }) => {
  const [interventions, setInterventions] = useState([]);
  const [newIntervention, setNewIntervention] = useState('');

  const readingTier = getPerfTier(school.Reading_Level_Percentage);
  const mathTier    = getPerfTier(school.Math_Level_Percentage);

  const historyData = [
    { year: '2016', Reading: 22.7, Math: 48.1 },
    { year: '2018', Reading: 22.4, Math: 38.4 },
    { year: '2022', Reading: 10.4, Math: 33.7 },
  ];

  const weakAreas = [];
  const recommendations = [];

  if (school.Reading_Level_Percentage < 30) {
    weakAreas.push('Critical Reading Issue');
    recommendations.push('Implement intensive reading program with phonics');
    recommendations.push('Daily 30-minute guided reading sessions');
    recommendations.push('Teacher training in foundational literacy');
  } else if (school.Reading_Level_Percentage < 50) {
    recommendations.push('Increase daily reading time');
    recommendations.push('Provide leveled reading materials');
  }

  if (school.Math_Level_Percentage < 40) {
    weakAreas.push('Critical Math Issue');
    recommendations.push('Daily arithmetic drills');
    recommendations.push('Use visual aids and manipulatives');
    recommendations.push('Peer tutoring programs');
  } else if (school.Math_Level_Percentage < 60) {
    recommendations.push('Additional math practice worksheets');
  }

  const handleAddIntervention = (e) => {
    e.preventDefault();
    if (!newIntervention.trim()) return;
    setInterventions([
      { id: Date.now().toString(), description: newIntervention, date: new Date().toISOString() },
      ...interventions
    ]);
    setNewIntervention('');
  };

  return (
    <div className="scd-container">

      {/* ── Page header ── */}
      <div className="scd-header">
        <div className="scd-header-left">
          <p className="scd-eyebrow">State · Grade Detail</p>
          <h2 className="scd-title">{school.State} — Grade {school.Grade}</h2>
          <p className="scd-meta">Academic Year {school.Year}</p>
        </div>

        {/* Summary chips */}
        <div className="scd-header-chips">
          <span className={`scd-chip scd-chip--${readingTier}`}>
            Reading: {school.Reading_Level_Percentage?.toFixed(1)}%
          </span>
          <span className={`scd-chip scd-chip--${mathTier}`}>
            Math: {school.Math_Level_Percentage?.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="scd-divider" />

      {/* ── Top row: rings + weak areas + recommendations ── */}
      <div className="scd-top-grid">

        {/* Score rings */}
        <div className="scd-card scd-card--scores">
          <p className="scd-card-label">Performance</p>
          <div className="scd-rings">
            <ScoreRing value={school.Reading_Level_Percentage} label="Reading" tier={readingTier} />
            <div className="scd-rings-divider" />
            <ScoreRing value={school.Math_Level_Percentage}    label="Math"    tier={mathTier}    />
          </div>
        </div>

        {/* Weak areas */}
        <div className="scd-card">
          <p className="scd-card-label">Weak Areas</p>
          {weakAreas.length > 0 ? (
            <ul className="scd-issue-list">
              {weakAreas.map((area, i) => (
                <li key={i} className="scd-issue-item">
                  <span className="scd-issue-dot" />
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <div className="scd-all-clear">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              No critical weak areas
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="scd-card">
          <p className="scd-card-label">Recommendations</p>
          {recommendations.length > 0 ? (
            <ol className="scd-rec-list">
              {recommendations.map((rec, i) => (
                <li key={i} className="scd-rec-item">
                  <span className="scd-rec-num">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ol>
          ) : (
            <div className="scd-all-clear">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Keep up the excellent work!
            </div>
          )}
        </div>

      </div>

      {/* ── Chart ── */}
      <div className="scd-card scd-card--chart">
        <div className="scd-card-header">
          <p className="scd-card-label">Performance Trend</p>
          <span className="scd-card-hint">Historical reading &amp; math scores</span>
        </div>
        <div className="scd-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historyData} barCategoryGap="32%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#a09d98', fontFamily: 'DM Sans, sans-serif' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#a09d98', fontFamily: 'DM Sans, sans-serif' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`}
                width={38}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
              <Legend
                wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', color: '#6b6760', paddingTop: '16px' }}
                iconType="circle" iconSize={8}
              />
              <Bar dataKey="Reading" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Math"    fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Intervention tracker ── */}
      <div className="scd-card scd-card--interventions">
        <div className="scd-card-header">
          <p className="scd-card-label">Intervention Tracker</p>
          <span className="scd-card-hint">{interventions.length} recorded</span>
        </div>

        {/* Input row — no <form> tag per artifact rules */}
        <div className="scd-intervention-input-row">
          <input
            type="text"
            value={newIntervention}
            onChange={(e) => setNewIntervention(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddIntervention(e); }}
            placeholder="Describe an intervention taken…"
            className="scd-intervention-input"
          />
          <button
            onClick={handleAddIntervention}
            className="scd-btn scd-btn--primary"
            disabled={!newIntervention.trim()}
          >
            Add
          </button>
        </div>

        {/* List */}
        <div className="scd-intervention-list">
          {interventions.length > 0 ? (
            interventions.map((intv) => (
              <div key={intv.id} className="scd-intervention-item">
                <div className="scd-intervention-accent" />
                <div className="scd-intervention-body">
                  <p className="scd-intervention-text">{intv.description}</p>
                  <span className="scd-intervention-date">
                    {new Date(intv.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="scd-intervention-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              <p>No interventions recorded yet.</p>
              <span>Use the field above to log actions taken for this state–grade.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SchoolDetails;