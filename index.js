//reusable config
const autoCompleteConfig = {
    //renderOption is a function specifically for a movie stuffs to show individual movie
    renderOption : (movie) => {
        let imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
        <img src=${imgSrc}>
        ${movie.Title} (${movie.Year})
    `
    },



    //value to fill in input box
    inputValue: (movie) => {   //func defined jst to extract the input value
        return movie.Title
    },

    // to fetch the data - CAN CHECK this under network tab -> Fetch/XHR -> CLICK link -> HEADER
    async fetchData(searchTerm) {
            //await - used to await the process as API will take few seconds to provide response
                     //axios.get('URL', {object}) -> object will append with url.
    let response = await axios.get('https://www.omdbapi.com/', {
        params:{
            apikey: '118acc94',
            s: searchTerm
           // t: "Avengers: Endgame"
        }
    })
    if (response.data.Error)
        return []

    return response.data.Search
    }
};

//create autoComplete for left side and passing the configuration objects that are specific to movie app
createAutoComplete({
    ...autoCompleteConfig,  //using spread

    //place for left search box to render
    root: document.querySelector('#left-autocomplete'),

    //when a movie is selected from left side list
    onOptionSelect(movie) {        //either can user arrow func or normal func like this
        document.querySelector('.tutorial').classList.add('is-hidden') //using bulma class to hide tutorial msg
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left') //calling 2nd API to get selected movie details
    },
});

createAutoComplete({
    ...autoCompleteConfig,  //using spread

    //place for right search box to render
    root: document.querySelector('#right-autocomplete'),

    //when a movie is selected from left side list
    onOptionSelect(movie) {        //either can user arrow func or normal func like this
        document.querySelector('.tutorial').classList.add('is-hidden')  //using bulma class to hide tutorial msg
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')  //calling 2nd API to get selected movie details
    },

});

let leftMovie, rightMovie;
 const onMovieSelect = async(movie, summaryElement, side) => {
    let response =  await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: '118acc94',
            i: movie.imdbID
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }

    //when movies selected on both sides
    if(leftMovie && rightMovie){
        this.runComparison()
    }

};

function runComparison(){
    let leftSideStats = document.querySelectorAll('#left-summary .notification')
    let rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach( (leftStat, index) => {

        let rightStat = rightSideStats[index]
        console.log(leftStat, rightStat)

        let leftSideValue, rightSideValue
        if(leftStat.dataset.value === 'N/A'){
            leftSideValue = 0;
        }else{       
        if(leftStat.dataset.value.includes('.')) //value will be present inside 'dataset' in dom
         leftSideValue = parseFloat(leftStat.dataset.value)
        else
         leftSideValue = parseInt(leftStat.dataset.value)   //value will be present inside 'dataset' in dom
        }

        if(rightStat.dataset.value === 'N/A'){
            rightSideValue = 0;
        }else{
        if(rightStat.dataset.value.includes('.'))  //to see value is 8.1, 7.9
        rightSideValue = parseFloat(rightStat.dataset.value)
        else
        rightSideValue = parseInt(rightStat.dataset.value)
        }

        if(leftSideValue > rightSideValue){
            rightStat.className = 'notification' //removing all classes and assigining 'notification' class only
            rightStat.classList.add('is-warning')  //changing lesser value side to yellow
            
            leftStat.className = 'notification'
            leftStat.classList.add('is-primary')   //confirming higher value side to green
        }else if(leftSideValue < rightSideValue){
            leftStat.className = 'notification'
            leftStat.classList.add('is-warning')

            rightStat.className = 'notification'
            rightStat.classList.add('is-primary')
        }else{
        //when leftStat===rightStat
            rightStat.className = 'notification'
            rightStat.classList.add("is-info");

            leftStat.className = 'notification'
            leftStat.classList.add("is-info");
        }

        if(leftStat.dataset.value === 'N/A'){
            leftStat.className = 'notification' //removing all classes and assigining 'notification' class
            leftStat.classList.add('is-dark')    //darker color for 'N/A' value
        }
        if(rightStat.dataset.value === 'N/A'){
        rightStat.className = 'notification'     
        rightStat.classList.add('is-dark')    //darker color for 'N/A' value
        }
    })
}

//to show movie details once a movie is clicked
const movieTemplate = (movieDetail) => {


    let boxOffice = movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
                                        // replacing '$' and then replacing ','

    //metascore might be 'N/A' for local movies
    let metaScore
    if(movieDetail.Metascore === 'N/A')
     metaScore =movieDetail.Metascore
    else
    metaScore = parseInt(movieDetail.Metascore)

    let imdbRating = parseFloat(movieDetail.imdbRating) //rating may have decimal value
    let imdbVotes = parseInt((movieDetail.imdbVotes).replace(/,/g, ''))

    let awards = movieDetail.Awards.split(" ");
    let awardCount = 0
    awards.forEach(item => {
        if(!isNaN(parseInt(item))){  //isNaN() is an inbuit js func
            awardCount = awardCount + parseInt(item);
        }
    });

    //template that works on bulma css
    return `
    <article class='media'>

     <figure class='media-left'>
      <p class='image'>
       <img src="${movieDetail.Poster}" />
      </p>
     </figure>

     <div class='media-content'>
      <div class='content'>
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
     </div>

     <!-- data-value assigns some data to the particular tag -->

    </article>
    <article data-value=${awardCount} class="notification is-primary">
     <p class="title">${movieDetail.Awards}</p>
     <p class='subtitle'>Awards</p>
    </article>
    <article data-value=${boxOffice} class="notification is-primary">
     <p class="title">${movieDetail.BoxOffice}</p>
     <p class='subtitle'>Boxoffice</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
     <p class="title">${movieDetail.Metascore}</p>
     <p class='subtitle'>Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
     <p class="title">${movieDetail.imdbRating}</p>
     <p class='subtitle'>imdbRating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
     <p class="title">${movieDetail.imdbVotes}</p>
     <p class='subtitle'>imdbVotes</p>
    </article>
    `
}




