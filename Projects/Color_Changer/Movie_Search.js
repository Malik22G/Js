

const form = document.querySelector("#moviesForm");
const imageContainer = document.getElementById('imageContainer');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    imageContainer.innerHTML = '';
    const searchTerm = form.elements.searchTerm.value;
    const params = {
        headers: {
            'X-RapidAPI-Key': '2fe7a82576msh4de95d6190cb70fp19186fjsn01da6c98920e',
            'X-RapidAPI-Host': 'porn-gallery.p.rapidapi.com'
        }
    }
    const response = async () => {
        try {
            const res = await axios.get(`https://porn-gallery.p.rapidapi.com/pornos/${searchTerm}`, params);
            console.dir(res.data);
            const data = res.data;

            data.results.forEach(result => {
                result.images.forEach(imageUrl => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.alt = result.title;
                    imgElement.style.width = "25%";
                    imgElement.style.height = "auto";
                    imageContainer.appendChild(imgElement);
                })
            })
        } catch (e) {
            console.log()
        }
    }

    response();

})
