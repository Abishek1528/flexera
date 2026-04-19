import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Filters from '../components/Filters.jsx';
import PriorityList from '../components/PriorityList.jsx';
import api from '../services/api.js';
import '../Styles/Dashboard.css';

/* ─── Skeleton shimmer blocks ─── */
const Skeleton = ({ width = '100%', height = '1rem', radius = '6px', style = {} }) => (
  <div
    className="sp-skeleton"
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

const StatCardSkeleton = () => (
  <div className="sp-stat-card sp-stat-card--skeleton">
    <Skeleton width="32px" height="32px" radius="8px" />
    <Skeleton width="60%" height="0.75rem" style={{ marginTop: '1rem' }} />
    <Skeleton width="40%" height="2rem" style={{ marginTop: '0.5rem' }} />
  </div>
);

/* ─── Mini bar for comparison ─── */
const ComparisonBar = ({ label, value, color }) => (
  <div className="sp-bar-row">
    <span className="sp-bar-label">{label}</span>
    <div className="sp-bar-track">
      <div
        className="sp-bar-fill"
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
    <span className="sp-bar-pct">{value?.toFixed(1)}%</span>
  </div>
);

/* ─── Performance badge ─── */
const PerfBadge = ({ value }) => {
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  const tier =
    v >= 70 ? { label: 'Good', cls: 'good' } :
    v >= 45 ? { label: 'Fair', cls: 'fair' } :
               { label: 'At Risk', cls: 'risk' };
  return <span className={`sp-perf-badge sp-perf-badge--${tier.cls}`}>{tier.label}</span>;
};

/* ─────────────────────────────── */

const Dashboard = () => {
  const [states, setStates] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [comparisonState1, setComparisonState1] = useState('');
  const [comparisonState2, setComparisonState2] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [prioritySchools, setPrioritySchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [statesData, yearsData, schoolsData] = await Promise.all([
          api.getStates(),
          api.getYears(),
          api.getSchools({})
        ]);
        setStates(statesData);
        setYears(yearsData);
        setAllSchools(schoolsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadPrioritySchools = async () => {
      try {
        const data = await api.getPrioritySchools({
          State: selectedState,
          Year: selectedYear
        });
        setPrioritySchools(data);
        console.log([...data].sort((a, b) => (b.PriorityScore ?? 0) - (a.PriorityScore ?? 0)))
      } catch (error) {
        console.error('Error loading priority schools:', error);
      }
    };
    loadPrioritySchools();
  }, [selectedState, selectedYear]);

  const handleSchoolSelect = (school) => {
    navigate('/school', {
      state: {
        school: {
          ...school,
          AvgReading: school.Reading_Level_Percentage || school.AvgReading,
          AvgMath: school.Math_Level_Percentage || school.AvgMath
        }
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['State', 'Grade', 'Year', 'Reading %', 'Math %', 'Priority Score'];
    const rows = prioritySchools.map(s => [
      s.State, s.Grade, s.Year,
      s.AvgReading || s.Reading_Level_Percentage,
      s.AvgMath || s.Math_Level_Percentage,
      s.PriorityScore?.toFixed(1) || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'shikshapulse-priority-list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStateStats = (state) => {
    const year = selectedYear ? parseInt(selectedYear) : 2022;
    const stateData = allSchools.filter(s => s.State === state && s.Year === year);
    if (stateData.length === 0) return null;
    const avgReading = stateData.reduce((sum, s) => sum + s.Reading_Level_Percentage, 0) / stateData.length;
    const avgMath = stateData.reduce((sum, s) => sum + s.Math_Level_Percentage, 0) / stateData.length;
    return { avgReading, avgMath, count: stateData.length };
  };

  const avgReading = prioritySchools.length > 0
    ? (prioritySchools.reduce((sum, s) => sum + (s.AvgReading || s.Reading_Level_Percentage || 0), 0) / prioritySchools.length).toFixed(1)
    : 0;

  const avgMath = prioritySchools.length > 0
    ? (prioritySchools.reduce((sum, s) => sum + (s.AvgMath || s.Math_Level_Percentage || 0), 0) / prioritySchools.length).toFixed(1)
    : 0;

  /* Worst-performing state insight */
  const worstState = (() => {
    if (!allSchools.length) return null;
    const byState = {};
    allSchools.forEach(s => {
      if (!byState[s.State]) byState[s.State] = [];
      byState[s.State].push((s.Reading_Level_Percentage + s.Math_Level_Percentage) / 2);
    });
    return Object.entries(byState)
      .map(([state, vals]) => ({ state, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
      .sort((a, b) => a.avg - b.avg)[0];
  })();

  const stats1 = comparisonState1 ? getStateStats(comparisonState1) : null;
  const stats2 = comparisonState2 ? getStateStats(comparisonState2) : null;

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="sp-dashboard sp-dashboard--loading">
        <div className="sp-header">
          <div className="sp-header-left">
            <Skeleton width="140px" height="0.7rem" />
            <Skeleton width="220px" height="2rem" style={{ marginTop: '0.75rem' }} />
            <Skeleton width="280px" height="0.85rem" style={{ marginTop: '0.5rem' }} />
          </div>
          <div className="sp-header-right">
            <Skeleton width="130px" height="36px" radius="8px" />
            <Skeleton width="110px" height="36px" radius="8px" />
          </div>
        </div>
        <div className="sp-divider" />
        <div className="sp-stats-grid">
          <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="sp-dashboard">

      {/* ── Insight banner ── */}
      {worstState && (
        <div className="sp-insight-banner">
          <span className="sp-insight-icon">⚠</span>
          <span>
            <strong>{worstState.state}</strong> is the lowest-performing state with an average score of{' '}
            <strong>{worstState.avg.toFixed(1)}%</strong> — consider prioritising interventions here.
          </span>
          <button
            className="sp-insight-cta"
            onClick={() => setSelectedState(worstState.state)}
          >
            View state →
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-header-left">
          <p className="sp-header-eyebrow">ShikshaPulse · Analytics</p>
          <h1 className="sp-title">Dashboard</h1>
          <p className="sp-subtitle">Identify high-risk states and grades at a glance</p>
        </div>

        <div className="sp-header-right">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`sp-btn sp-btn--secondary${showComparison ? ' sp-btn--active' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            {showComparison ? 'Hide Comparison' : 'Compare States'}
          </button>
          <button onClick={exportToCSV} className="sp-btn sp-btn--primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="sp-divider" />

      {/* ── Stats Grid ── */}
      <div className="sp-stats-grid">
        <div className="sp-stat-card">
          <div className="sp-stat-icon-wrap sp-stat-icon-wrap--neutral">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <p className="sp-stat-label">States Monitored</p>
          <p className="sp-stat-value">{states.length}</p>
          <p className="sp-stat-sub">across all regions</p>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-icon-wrap sp-stat-icon-wrap--reading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <p className="sp-stat-label">Avg Reading</p>
          <p className={`sp-stat-value ${parseFloat(avgReading) < 45 ? 'sp-stat-value--risk' : parseFloat(avgReading) >= 70 ? 'sp-stat-value--good' : 'sp-stat-value--fair'}`}>
            {avgReading}%
          </p>
          <PerfBadge value={avgReading} />
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-icon-wrap sp-stat-icon-wrap--math">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          </div>
          <p className="sp-stat-label">Avg Math</p>
          <p className={`sp-stat-value ${parseFloat(avgMath) < 45 ? 'sp-stat-value--risk' : parseFloat(avgMath) >= 70 ? 'sp-stat-value--good' : 'sp-stat-value--fair'}`}>
            {avgMath}%
          </p>
          <PerfBadge value={avgMath} />
        </div>
      </div>

      {/* ── Comparison Section ── */}
      {showComparison && (
        <div className="sp-comparison-section">
          <div className="sp-comparison-header">
            <div>
              <h2 className="sp-comparison-title">State Comparison</h2>
              <p className="sp-comparison-hint">Select two different states to compare their performance side by side</p>
            </div>
          </div>

          <div className="sp-comparison-controls">
            <div className="sp-comparison-control">
              <label className="sp-comparison-label">State A</label>
              <select
                value={comparisonState1}
                onChange={(e) => setComparisonState1(e.target.value)}
                className="sp-comparison-select"
              >
                <option value="">Choose a state…</option>
                {states.map(state => (
                  <option key={state} value={state} disabled={state === comparisonState2}>{state}</option>
                ))}
              </select>
            </div>

            <div className="sp-comparison-vs">vs</div>

            <div className="sp-comparison-control">
              <label className="sp-comparison-label">State B</label>
              <select
                value={comparisonState2}
                onChange={(e) => setComparisonState2(e.target.value)}
                className="sp-comparison-select"
              >
                <option value="">Choose a state…</option>
                {states.map(state => (
                  <option key={state} value={state} disabled={state === comparisonState1}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {!stats1 && !stats2 ? (
            <div className="sp-comparison-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <p>Select two states above to see a side-by-side comparison of reading and math performance.</p>
            </div>
          ) : (
            <div className="sp-comparison-grid">
              {[{ label: comparisonState1, stats: stats1, accent: '#6366f1' }, { label: comparisonState2, stats: stats2, accent: '#f59e0b' }].map(({ label, stats, accent }) =>
                stats ? (
                  <div className="sp-comparison-card" key={label}>
                    <div className="sp-comparison-card-header">
                      <h3 className="sp-comparison-state-name">{label}</h3>
                      <span className="sp-comparison-count">{stats.count} grade entries</span>
                    </div>
                    <div className="sp-comparison-bars">
                      <ComparisonBar label="Reading" value={stats.avgReading} color={accent} />
                      <ComparisonBar label="Math" value={stats.avgMath} color={accent} />
                    </div>
                    <div className="sp-comparison-overall">
                      Overall avg: <strong>{((stats.avgReading + stats.avgMath) / 2).toFixed(1)}%</strong>
                    </div>
                  </div>
                ) : (
                  <div className="sp-comparison-card sp-comparison-card--placeholder" key={label || 'empty'}>
                    <p>Select a state to populate this panel</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Filters & Priority List ── */}
      <div className="sp-filters-card">
        <Filters
          states={states}
          years={years}
          selectedState={selectedState}
          selectedYear={selectedYear}
          onStateChange={setSelectedState}
          onYearChange={setSelectedYear}
        />
      </div>

      <div className="sp-list-section">
        {prioritySchools.length === 0 ? (
          <div className="sp-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <h3>No results found</h3>
            <p>Try adjusting your filters or selecting a different state and year combination.</p>
            <button
              className="sp-btn sp-btn--secondary"
              onClick={() => { setSelectedState(''); setSelectedYear(''); }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <PriorityList
            schools={prioritySchools}
            onSchoolSelect={handleSchoolSelect}
            selectedSchool={null}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;