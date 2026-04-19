const fs = require('fs');
const path = require('path');

let interventions = [];

const dataPath = path.join(__dirname, '../data/sampleData.json');

const loadSampleData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading sample data:', error);
    return [];
  }
};

const getSchoolData = (filters = {}) => {
  let data = loadSampleData();

  if (filters.State) {
    data = data.filter(item => item.State === filters.State);
  }

  if (filters.Year) {
    data = data.filter(item => item.Year === parseInt(filters.Year));
  }

  return data;
};

const getUniqueStates = () => {
  const data = loadSampleData();
  const states = [...new Set(data.map(item => item.State))];
  return states.sort();
};

const getUniqueYears = () => {
  const data = loadSampleData();
  const years = [...new Set(data.map(item => item.Year))];
  return years.sort((a, b) => b - a);
};

const calculatePriorityScore = (school, allData) => {
  const avgReading = school.Reading_Level_Percentage;
  const avgMath = school.Math_Level_Percentage;

  let score = (100 - avgReading) + (100 - avgMath);

  const stateHistory = allData.filter(item => 
    item.State === school.State && item.Grade === school.Grade
  ).sort((a, b) => a.Year - b.Year);

  if (stateHistory.length >= 2) {
    const first = stateHistory[0];
    const last = stateHistory[stateHistory.length - 1];
    
    if (last.Reading_Level_Percentage <= first.Reading_Level_Percentage &&
        last.Math_Level_Percentage <= first.Math_Level_Percentage) {
      score += 20;
    }
  }

  return score;
};

const getPrioritySchools = (filters = {}) => {
  const allData = loadSampleData();
  let data = getSchoolData(filters);

  const withScore = data.map(school => ({
    ...school,
    AvgReading: school.Reading_Level_Percentage,
    AvgMath: school.Math_Level_Percentage,
    PriorityScore: calculatePriorityScore(school, allData)
  }));

  return withScore.sort((a, b) => b.PriorityScore - a.PriorityScore).slice(0, 20);
};

const getStateGradeHistory = (state, grade) => {
  const data = loadSampleData();
  return data.filter(item => item.State === state && item.Grade === grade).sort((a, b) => a.Year - b.Year);
};

const getWeakAreas = (state, grade) => {
  const data = loadSampleData();
  const latestYear = Math.max(...data.map(item => item.Year));
  const latest = data.find(item => 
    item.State === state && item.Grade === grade && item.Year === latestYear
  );

  if (!latest) return [];

  const weakAreas = [];
  
  if (latest.Reading_Level_Percentage < 30) {
    weakAreas.push('Critical Reading Issue');
  }
  
  if (latest.Math_Level_Percentage < 40) {
    weakAreas.push('Critical Math Issue');
  }

  return weakAreas;
};

const getRecommendations = (state, grade) => {
  const data = loadSampleData();
  const latestYear = Math.max(...data.map(item => item.Year));
  const latest = data.find(item => 
    item.State === state && item.Grade === grade && item.Year === latestYear
  );

  if (!latest) return [];

  const recommendations = [];

  if (latest.Reading_Level_Percentage < 30) {
    recommendations.push('Implement intensive reading program with phonics');
    recommendations.push('Daily 30-minute guided reading sessions');
    recommendations.push('Teacher training in foundational literacy');
  } else if (latest.Reading_Level_Percentage < 50) {
    recommendations.push('Increase daily reading time');
    recommendations.push('Provide leveled reading materials');
  }

  if (latest.Math_Level_Percentage < 40) {
    recommendations.push('Daily arithmetic drills');
    recommendations.push('Use visual aids and manipulatives');
    recommendations.push('Peer tutoring programs');
  } else if (latest.Math_Level_Percentage < 60) {
    recommendations.push('Additional math practice worksheets');
  }

  return recommendations;
};

const getInterventions = (schoolKey) => {
  return interventions.filter(i => i.School_Key === schoolKey).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const addIntervention = (data) => {
  const intervention = {
    id: Date.now().toString(),
    ...data,
    date: new Date().toISOString()
  };
  interventions.unshift(intervention);
  return intervention;
};

module.exports = {
  getSchoolData,
  getUniqueStates,
  getUniqueYears,
  getPrioritySchools,
  getStateGradeHistory,
  getWeakAreas,
  getRecommendations,
  getInterventions,
  addIntervention
};
