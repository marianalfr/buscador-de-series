'use strict';

const inputSearch = document.querySelector('#input-search');
const buttonSearch = document.querySelector('#btn-search');
const showList = document.querySelector('#show-list');
const formSearch = document.querySelector('#form-search');
let favourites = [];

function getShowsFromAPI(){
    const inputSearchValue = inputSearch.value;
    fetch (`http://api.tvmaze.com/search/shows?q=${inputSearchValue}`)
    .then(response => response.json())
    .then(data => {
        if(data.length !== 0){
            paintShows(data)
        } else {
            paintError();
        }
    })
}

function paintShows(allShows){

    clearSearch();

    const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?%20text=TV';

    const elementUl = document.createElement('ul');
    elementUl.classList.add('search-list');
    showList.appendChild(elementUl);

    for (let show of allShows){
        const showData = show.show;
        const elementLi = document.createElement('li');
        elementLi.classList.add('search-item');

        const showID = showData.id;
        const showName = showData.name;

        const elementShowTitle = document.createElement('h2');
        elementShowTitle.setAttribute('id', showID);
        elementShowTitle.classList.add('select-item');
        const elementShowImage = document.createElement('img');
        elementShowImage.classList.add('show-image');
        const showTitle = document.createTextNode (showName);
        

        elementShowTitle.appendChild(showTitle);

        if (showData.image !== null){
            elementShowImage.src = showData.image.medium;
        } else {
            elementShowImage.src = defaultImage;
        }
        
        elementLi.appendChild(elementShowTitle);
        elementLi.appendChild(elementShowImage);
        elementUl.appendChild(elementLi);
     }
}

function paintError(){
    const errorText = document.createElement('p');
    errorText.classList.add('error-message');
    const errorMessage = document.createTextNode('Lo siento mucho, no conozco esta esta serie.');
    errorText.appendChild(errorMessage);
    showList.appendChild(errorText);
}

function introSearch(){
    event.preventDefault();
    getShowsFromAPI();
}

function clearSearch(){
    if (showList.innerHTML !== ''){
        showList.innerHTML = '';
    }
}

buttonSearch.addEventListener('click', getShowsFromAPI);
formSearch.addEventListener('submit', introSearch);