import React from 'react';

const Filters = ({ states, years, selectedState, selectedYear, onStateChange, onYearChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>State</label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          style={styles.select}
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Year</label>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          style={styles.select}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minWidth: '200px'
  }
};

export default Filters;
