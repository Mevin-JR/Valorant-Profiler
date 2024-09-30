const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend test')
});

app.post('/api/data', (req, res) => {
    const data = process.env.FIREBASE_API_KEY;
    res.json({ message: 'Data received', data });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});