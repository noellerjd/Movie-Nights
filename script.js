var searchEl = document.querySelector('#search')
var submitButton = document.querySelector('#submit')
var searchFormEl = document.querySelector('#search-form')
var listEl = document.querySelector('#list')
var mainContain = document.querySelector('#mainContain')
var baseUrl = 'https://imdb-api.com'
var apiKey = 'k_xha8cnzd'

// boilerplate request options for imbd api
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

window.onload = function () {
    //added code for tenor api gif
    // global variables
//const searchEl = document.getElementById("search");
//const submitButton = document.getElementById("submit");
// api stuff
const gifApiKey = "YOC5GD9RH1V8";
const lmt = 1;

function getApi(event) {
    event.preventDefault();
    
    const searchElText = searchEl.value
    const api_url = `https://g.tenor.com/v1/search?key=${gifApiKey}&q=${searchElText}&limit=${lmt}`;
    
    fetch(api_url)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            console.log(result);
           this.renderGif(result);
        });
}

//how to get to gif url
function renderGif(result) {
    let gifUrl = result.results[0].media[0].gif.url;
    document.getElementById("gif").src= gifUrl;
    console.log(result);
}
    let movies = JSON.parse(localStorage.getItem("movies"));
    movies?.forEach(m => {
        renderResults(m);
    })
}

// api search event
var submitSearch = (event) => {
    event.preventDefault()
    
    if(searchEl.value == ''){ //will become a modal
        alert("Please enter a movie name first!");
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
        reviews: []
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

function renderResults(movie) {
    var newContainer = document.createElement('div'); //creates a container for query
    var listItem = document.createElement('h1'); //creates an h1 for the title
    var posterItem = document.createElement('img'); //creates an img for the poster
    var descItem = document.createElement('p'); // creates a p for the description
    var buttonItem = document.createElement('button');// creates a link when clicked on poster
    //sets the class of the elements
    buttonItem.id = movie.id; //sets the id of the link to the movie id
    buttonItem.className = "posterButton"
    newContainer.className = "newMovieItem";
    posterItem.className = "poster"; 
    listItem.className = "movietitle";
    descItem.className = "description";
    // adds the query container to the #list parent
    listEl.appendChild(newContainer)
    // sets poster source to the first of the response array, then adds it to the new container
    newContainer.appendChild(buttonItem)
    // sets the title to the text of the first response array, then adds it to the new container
    listItem.textContent = movie.title
    newContainer.appendChild(listItem)
    // sets the description to the text of the first array, then adds it to the new container
    descItem.textContent = movie.description
    newContainer.appendChild(descItem)
    // makes the link a child of the img
    posterItem.src = movie.image
    buttonItem.appendChild(posterItem)

    // poster
    // var posterId = document.querySelector('#'+`${movie.id}`)
    // posterId.href = movie.trailer
    // posterId.target = "_blank"

    // create Modal

    var outerModal = document.createElement('div');
    mainContain.appendChild(outerModal)
    outerModal.className = "outerModal";
    outerModal.id = 
    outerModal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-header">
            <h2>${movie.title}</h2>
            <p>${movie.description}</p>
        </div>
        <div class="modal-body">
                <p>"${movie.reviews[0].review}"</p>
                <p class=""><i class="fa-solid fa-angle-right"></i> ${movie.reviews[0].publisher}, Rating: ${movie.reviews[0].rating}</p><br>

                <p>"${movie.reviews[1].review}"</p>
                <p><i class="fa-solid fa-angle-right"></i> ${movie.reviews[1].publisher}, Rating: ${movie.reviews[1].rating}</p><br>

                <p>"${movie.reviews[2].review}"</p>
                <p><i class="fa-solid fa-angle-right"></i> ${movie.reviews[2].publisher}, Rating: ${movie.reviews[2].rating}</p><br>
        </div>
    </div>`;

    // var innerModal = document.createElement('div');
    // innerModal.className = "innerModal";



    // reviews

    // var reviewContainer = document.createElement('div');
    // reviewContainer.className = "reviewContainer";
    // newContainer.appendChild(reviewContainer)

    // var reviewList = document.createElement('ul')
    // reviewList.className = "reviewList"
    // reviewContainer.appendChild(reviewList);

    // reviewList.innerHTML = `
    // <li>${movie.reviews[0].publisher}</li>
    // <li>${movie.reviews[0].rating}</li>
    // <li>${movie.reviews[0].review}</li>

    // <li>${movie.reviews[1].publisher}</li>
    // <li>${movie.reviews[1].rating}</li>
    // <li>${movie.reviews[1].review}</li>`

    /*     let movie = { 
        id: null,
        title: null,
        description: null,
        image: null,
        trailer: null,
        reviews: []
    }; */
}

// buttonItem.addEventListener('click', )