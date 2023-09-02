const form = document.querySelector("#moviesForm");
const imageContainer = document.getElementById('imageContainer');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    imageContainer.innerHTML = '';
    const searchTerm = form.elements.searchTerm.value;
    const options = {
        method: 'GET',
        url: 'https://quality-porn.p.rapidapi.com/search',
        params: {
            query: searchTerm,
            page: '1',
            timeout: '5000'
        },
        headers: {
            'X-RapidAPI-Key': '2fe7a82576msh4de95d6190cb70fp19186fjsn01da6c98920e',
            'X-RapidAPI-Host': 'quality-porn.p.rapidapi.com'
        }
    };

        const response = async () =>{ 
            const res = await axios.request(options);
        console.log(res);
    
        }
        response();
})


