const API_URL = window.location.origin;

document.getElementById('voteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const opcion = document.getElementById('opcion').value;

    const res = await fetch(`${API_URL}/submit-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, opcion })
    });

    const data = await res.json();
    alert(data.message);

    document.getElementById('nombre').value = '';
    document.getElementById('opcion').value = '';

    cargarVotos();
});

async function cargarVotos() {
    const res = await fetch(`${API_URL}/votes`);
    const votes = await res.json();

    const lista = document.getElementById('votesList');
    lista.innerHTML = '';
    votes.forEach(v => {
        const li = document.createElement('li');
        li.textContent = `${v.nombre} votó por "${v.opcion}" (${new Date(v.fecha).toLocaleString()})`;
        lista.appendChild(li);
    });
}

cargarVotos();