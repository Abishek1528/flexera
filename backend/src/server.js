const express = require('express');
const cors = require('cors');
const schoolsRouter = require('./routes/schools');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/schools', schoolsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShikshaPulse API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
