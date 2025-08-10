const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

const voteSchema = new mongoose.Schema({
    nombre: String,
    opcion: String,
    fecha: { type: Date, default: Date.now }
});
const Vote = mongoose.model('Vote', voteSchema);

app.post('/submit-vote', async (req, res) => {
    try {
        const vote = new Vote(req.body);
        await vote.save();
        res.json({ message: '✅ Voto guardado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar el voto' });
    }
});

app.get('/votes', async (req, res) => {
    try {
        const votes = await Vote.find().sort({ fecha: -1 });
        res.json(votes);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener votos' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});