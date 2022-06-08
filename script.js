var searchEl = document.querySelector('#search')
var submitButton = document.querySelector('#submit')
var searchFormEl = document.querySelector('#search-form')
var listEl = document.querySelector('#list')
var mainContain = document.querySelector('#mainContain')
var viewEl = document.querySelector('#view-button')
var baseUrl = 'https://imdb-api.com'
var apiKey = 'k_xha8cnzd'
const gifApiKey = "YOC5GD9RH1V8";
const lmt = 1;

// boilerplate request options for imbd api
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

// load saved movies
window.onload = function () {
    let movies = JSON.parse(localStorage.getItem("movies"));
    movies?.forEach(m => {
        renderResults(m);
    })
}

// api tenor search event
var submitSearch = (event) => {
    event.preventDefault()
    
    if(searchEl.value == ''){ //will become a modal
        return;
    } else{ //search, then log response, take the response and run renderResults function
        getMovieObject(searchEl.value)
            .then(movie => {
                addMovieToLS(movie);
                renderResults(movie);
            }
        );
    } 
}

async function getMovieObject(name) {
    let movie = { 
        id: null,
        title: null,
        description: null,
        image: null,
        trailer: null,
        reviews: [],
        gifs: null
    };

    await fetch(`https://imdb-api.com/API/SearchMovie/${apiKey}/${name}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            let m = result.results[0];
            movie.id = m.id;
            movie.title = m.title;
            movie.description = m.description;
            movie.image = m.image;

            return fetch(`https://imdb-api.com/API/YoutubeTrailer/${apiKey}/${movie.id}`, requestOptions);
            
        })
        .then(response => response.json())
        .then(result => {
            movie.trailer = result.videoUrl;

            return fetch(`https://imdb-api.com/en/API/MetacriticReviews/${apiKey}/${movie.id}`, requestOptions);
        })
        .then(response => response.json())
        .then(result => {
            for (let i = 0; i < 4; i++) {
                let review = {
                    publisher: result.items[i].publisher,
                    rating: result.items[i].rate,
                    review: result.items[i].content
                }
                movie.reviews.push(review)            
            }
            return fetch(`https://g.tenor.com/v1/search?key=${gifApiKey}&q=${name}&limit=${lmt}`, requestOptions)
        })
        .then(response => {
            return response.json();
        })
        .then(result =>{
            movie.gifs = result.results[0].media[0].gif.url;
            console.log(movie.gifs)
        })

    return movie;
}

function addMovieToLS(movie) {
    if (localStorage.getItem("movies") == null) {
        localStorage.setItem("movies", "[]")
    }

    var old_movies = JSON.parse(localStorage.getItem("movies"));
    old_movies.push(movie);

    localStorage.setItem("movies", JSON.stringify(old_movies));
}

submitButton.addEventListener('click', submitSearch);
// submitButton.addEventListener('click', getApi );



function renderResults(movie) {
    var newContainer = document.createElement('div'); //creates a container for query
    var listItem = document.createElement('h1'); //creates an h1 for the title
    var posterItem = document.createElement('img'); //creates an img for the poster
    var descItem = document.createElement('p'); // creates a p for the description
    var linkItem = document.createElement('a');// creates a link when clicked on poster
    var gifItem = document.createElement('img');
    //sets the class of the elements
    gifItem.className = "tenor-gif"
    linkItem.id = movie.id; 
    linkItem.className = "posterLink"
    newContainer.className = "newMovieItem";
    document.getElementById
    newContainer.onclick="selectFocus()"
    posterItem.className = "poster"; 
    listItem.className = "movietitle";
    descItem.className = "description";
    // adds the query container to the #list parent
    listEl.appendChild(newContainer)
    // sets poster source to the first of the response array, then adds it to the new container
    newContainer.appendChild(linkItem)
    // sets the title to the text of the first response array, then adds it to the new container
    listItem.textContent = movie.title
    newContainer.appendChild(listItem)
    // sets the description to the text of the first array, then adds it to the new container
    descItem.textContent = movie.description
    newContainer.appendChild(descItem)
    // makes the link a child of the img
    posterItem.src = movie.image
    linkItem.appendChild(posterItem)

    // poster
    var posterId = document.querySelector('#'+`${movie.id}`)
    posterId.href = movie.trailer
    posterId.target = "_blank"

    // Reviews

    var reviewContainer = document.createElement('div');
    reviewContainer.className = "reviewContainer"
    reviewContainer.id = `${movie.id}`
    newContainer.appendChild(reviewContainer)

    gifItem.src = movie.gifs
    reviewContainer.appendChild(gifItem) 

    var reviewList = document.createElement('div');
    reviewList.className = "reviewList"
    reviewContainer.appendChild(reviewList)

    reviewList.innerHTML = `
    <p class ="reviews"><span class="quote">"</span>${movie.reviews[0].review}<span class="quote">"</span></p>
    <p class ="publisher"><i class="fa-solid fa-angle-right"></i> ${movie.reviews[0].publisher}, ${movie.reviews[0].rating}</p>

    <p class ="reviews"><span class="quote">"</span>${movie.reviews[1].review}<span class="quote">"</span></p>
    <p class ="publisher"><i class="fa-solid fa-angle-right"></i> ${movie.reviews[1].publisher}, ${movie.reviews[1].rating}</p>
    
    <p class ="reviews"><span class="quote">"</span>${movie.reviews[2].review}<span class="quote">"</span></p>
    <p class ="publisher"><i class="fa-solid fa-angle-right"></i> ${movie.reviews[2].publisher}, ${movie.reviews[2].rating}</p>`
};

$('#view-button').click(function(){
    if($('.reviewContainer').css('display') === 'none'){
        $('.reviewContainer').show( "drop")
    } else {
        $('.reviewContainer').hide( "drop")
    }
})