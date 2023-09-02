
const button = document.getElementById('deleteButton');

button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    fetch('http://localhost:3000/comments/:id', {
        method: 'POST',
        body: JSON.stringify({ value })
    });
});
