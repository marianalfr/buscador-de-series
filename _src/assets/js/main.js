'use strict';

const inputSearch = document.querySelector('#input-search');
const buttonSearch = document.querySelector('#btn-search');
const showList = document.querySelector('#show-list');
const formSearch = document.querySelector('#form-search');
let favourites = [];
const favList = document.querySelector('#fav-list');

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

        elementLi.addEventListener('click', selectShow);
        elementLi.addEventListener('click', saveShow);
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

function selectShow(event){
    event.currentTarget.classList.toggle('selected');
}

function saveShow(event){
    const currentShowTitle = event.currentTarget.querySelector('.select-item');
    const currentShowImage = event.currentTarget.querySelector('.show-image');

    const showObject = {
        name: currentShowTitle.innerHTML,
        id: currentShowTitle.getAttribute('id'),
        image: currentShowImage.src,
    }

    if(checkLocalStorage(showObject) === false){
        favourites = JSON.parse(localStorage.getItem('favourites'));
        favourites.push(showObject);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log('false');
        paintFavourites(showObject);
    } else if (checkLocalStorage(showObject) === true){
        favourites = JSON.parse(localStorage.getItem('favourites'));
        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log('true');
    } else {
        favourites = [];
        favourites.push(showObject);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log('else');
        paintFavourites(showObject);
    }
}

function checkLocalStorage(object){
    favourites = JSON.parse(localStorage.getItem('favourites'));
    if (favourites !==null){
        const mySavedFavourites = JSON.parse(localStorage.getItem('favourites'));

        for (let savedFavourite of mySavedFavourites){
            if (savedFavourite.id === object.id){
                return true;
            } else {
                return false;
            }
        }
    }
}

function paintFavourites(object){
    const favLiElement = document.createElement('li');
    favLiElement.classList.add('fav-list-element');

    const favSpanItem = document.createElement('span');
    const favTitleItem = document.createTextNode(object.name);
    const favImgItem = document.createElement('img');
    favImgItem.src = object.image;

    favSpanItem.appendChild(favTitleItem);
    favLiElement.appendChild(favSpanItem);
    favLiElement.appendChild(favImgItem);
    favList.appendChild(favLiElement);
}

buttonSearch.addEventListener('click', getShowsFromAPI);
formSearch.addEventListener('submit', introSearch);