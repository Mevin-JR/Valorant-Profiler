const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend test')
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received', data });
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});