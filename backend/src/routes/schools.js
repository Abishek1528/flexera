const express = require('express');
const router = express.Router();
const schoolData = require('../models/SchoolData');

router.get('/', (req, res) => {
  const data = schoolData.getSchoolData(req.query);
  res.json(data);
});

router.get('/states', (req, res) => {
  const states = schoolData.getUniqueStates();
  res.json(states);
});

router.get('/years', (req, res) => {
  const years = schoolData.getUniqueYears();
  res.json(years);
});

router.get('/priority', (req, res) => {
  const data = schoolData.getPrioritySchools(req.query);
  res.json(data);
});

router.get('/:schoolKey/history', (req, res) => {
  try {
    const { schoolKey } = req.params;
    const [statePart, gradeStr] = schoolKey.split('_');
    const state = statePart.replace(/-/g, ' ');
    const grade = parseInt(gradeStr);
    
    const history = schoolData.getStateGradeHistory(state, grade);
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: 'Invalid school key' });
  }
});

router.get('/:schoolKey/weak-areas', (req, res) => {
  try {
    const { schoolKey } = req.params;
    const [statePart, gradeStr] = schoolKey.split('_');
    const state = statePart.replace(/-/g, ' ');
    const grade = parseInt(gradeStr);
    
    const weakAreas = schoolData.getWeakAreas(state, grade);
    res.json(weakAreas);
  } catch (error) {
    res.status(400).json({ error: 'Invalid school key' });
  }
});

router.get('/:schoolKey/recommendations', (req, res) => {
  try {
    const { schoolKey } = req.params;
    const [statePart, gradeStr] = schoolKey.split('_');
    const state = statePart.replace(/-/g, ' ');
    const grade = parseInt(gradeStr);
    
    const recommendations = schoolData.getRecommendations(state, grade);
    res.json(recommendations);
  } catch (error) {
    res.status(400).json({ error: 'Invalid school key' });
  }
});

router.get('/:schoolKey/interventions', (req, res) => {
  const { schoolKey } = req.params;
  const interventions = schoolData.getInterventions(schoolKey);
  res.json(interventions);
});

router.post('/interventions', (req, res) => {
  const intervention = schoolData.addIntervention(req.body);
  res.status(201).json(intervention);
});

module.exports = router;
