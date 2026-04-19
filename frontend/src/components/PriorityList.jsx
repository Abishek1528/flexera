import React from 'react';
import '../Styles/PriorityList.css';

/* ── Risk tier helpers ── */
const getRiskTier = (score) => {
  if (score >= 120) return 'high';
  if (score >= 80)  return 'medium';
  return 'low';
};

const getRiskLabel = (score) => {
  if (score >= 120) return 'High Risk';
  if (score >= 80)  return 'Moderate';
  return 'On Track';
};

/* ── Inline mini-bar for reading/math ── */
const ScoreBar = ({ value, tier }) => (
  <div className="pl-score-bar-wrap">
    <span className="pl-score-num">{value.toFixed(1)}%</span>
    <div className="pl-score-track">
      <div
        className={`pl-score-fill pl-score-fill--${tier}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

/* ── Medal icons for top 3 ── */
const RankBadge = ({ rank }) => {
  if (rank === 1) return <span className="pl-rank pl-rank--gold">1</span>;
  if (rank === 2) return <span className="pl-rank pl-rank--silver">2</span>;
  if (rank === 3) return <span className="pl-rank pl-rank--bronze">3</span>;
  return <span className="pl-rank pl-rank--default">{rank}</span>;
};

/* ─────────────────────────────── */

const PriorityList = ({ schools, onSchoolSelect, selectedSchool }) => {
  return (
    <div className="pl-container">

      {/* ── Section header ── */}
      <div className="pl-header">
        <div>
          <h2 className="pl-title">Priority Index</h2>
          <p className="pl-subtitle">Top 20 state–grade combinations requiring immediate attention</p>
        </div>
        <div className="pl-legend">
          <span className="pl-legend-item pl-legend-item--high">High Risk</span>
          <span className="pl-legend-item pl-legend-item--medium">Moderate</span>
          <span className="pl-legend-item pl-legend-item--low">On Track</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="pl-table-wrap">
        <table className="pl-table">
          <thead>
            <tr className="pl-thead-row">
              <th className="pl-th pl-th--rank">#</th>
              <th className="pl-th">State</th>
              <th className="pl-th">Grade</th>
              <th className="pl-th">Reading</th>
              <th className="pl-th">Math</th>
              <th className="pl-th pl-th--score">Priority Score</th>
              <th className="pl-th pl-th--risk">Status</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, index) => {
              const priorityScore = school.PriorityScore || 0;
              const avgReading    = school.AvgReading || school.Reading_Level_Percentage || 0;
              const avgMath       = school.AvgMath    || school.Math_Level_Percentage    || 0;

              const tier          = getRiskTier(priorityScore);
              const schoolKey     = `${school.State}_${school.Grade}`;
              const selectedKey   = selectedSchool ? `${selectedSchool.State}_${selectedSchool.Grade}` : '';
              const isSelected    = selectedKey === schoolKey;

              return (
                <tr
                  key={schoolKey}
                  className={`pl-row pl-row--${tier}${isSelected ? ' pl-row--selected' : ''}`}
                  onClick={() => onSchoolSelect(school)}
                >
                  <td className="pl-td pl-td--rank">
                    <RankBadge rank={index + 1} />
                  </td>

                  <td className="pl-td pl-td--state">
                    <span className="pl-state-name">{school.State}</span>
                  </td>

                  <td className="pl-td">
                    <span className="pl-grade-chip">Grade {school.Grade}</span>
                  </td>

                  <td className="pl-td pl-td--bar">
                    <ScoreBar value={avgReading} tier={tier} />
                  </td>

                  <td className="pl-td pl-td--bar">
                    <ScoreBar value={avgMath} tier={tier} />
                  </td>

                  <td className="pl-td pl-td--score">
                    <span className={`pl-score-badge pl-score-badge--${tier}`}>
                      {priorityScore.toFixed(1)}
                    </span>
                  </td>

                  <td className="pl-td pl-td--risk">
                    <span className={`pl-risk-pill pl-risk-pill--${tier}`}>
                      {getRiskLabel(priorityScore)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer count ── */}
      <div className="pl-footer">
        Showing <strong>{schools.length}</strong> entries · click any row to drill down
      </div>
    </div>
  );
};

export default PriorityList;