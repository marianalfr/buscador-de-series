'use strict';

const inputSearch = document.querySelector('#input-search');
const buttonSearch = document.querySelector('#btn-search');
const showList = document.querySelector('#show-list');
const formSearch = document.querySelector('#form-search');
const favList = document.querySelector('#fav-list');
const resetFavs = document.querySelector('#btn-reset');
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

        elementLi.addEventListener('click', selectShow);
        elementLi.addEventListener('click', saveShow);
        elementLi.addEventListener('click', showSelectedFavourites);
     }

     showSelectedFavourites();
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

    let showObject = {
        name: currentShowTitle.innerHTML,
        id: currentShowTitle.getAttribute('id'),
        image: currentShowImage.src,
    }

    if (JSON.parse(localStorage.getItem('favourites')) !== null){
        if(event.currentTarget.classList.contains('selected')){
            favourites.push(showObject);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            paintFavourites(showObject);

        } else {
            showObject = {};
            favourites = JSON.parse(localStorage.getItem('favourites'));
            const favShowIndex = findArrayIndex(currentShowTitle.getAttribute('id'), favourites);
            favourites.splice(favShowIndex, 1);
            localStorage.setItem('favourites', JSON.stringify(favourites));
        }
    } else {
        favourites = [];
        favourites.push(showObject);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        
        paintFavourites(showObject);
    }
    updateCounter();
}

function paintFavourites(object){
    const favLiElement = document.createElement('li');
    favLiElement.classList.add('fav-list-element');

    const favSpanItem = document.createElement('span');
    favSpanItem.setAttribute('id', object.id);
    const favTitleItem = document.createTextNode(object.name);
    const favImgItem = document.createElement('img');
    // const favCloseItem = document.createElement('span');
    // const favCloseIcon = document.createTextNode('✕');
    const favCloseItem = document.createElement('span');
    const favCloseIcon = document.createElement('i');
    favCloseIcon.classList.add('close-icon', 'fas', 'fa-times-circle');
    favImgItem.src = object.image;

    favCloseItem.appendChild(favCloseIcon);
    favSpanItem.appendChild(favTitleItem);
    favLiElement.appendChild(favSpanItem);
    favLiElement.appendChild(favImgItem);
    favLiElement.appendChild(favCloseItem);
    favList.appendChild(favLiElement);

    favCloseItem.addEventListener('click', removeFromFavList);
}

function findArrayIndex(idKey, myArray){
    for (let i=0; i < myArray.length; i++) {
        if (myArray[i].id === idKey) {
            return myArray.indexOf(myArray[i]);
        }
    }
}

function removeFromFavList(event){
    event.currentTarget.closest('li').classList.add('hidden');

    favourites = JSON.parse(localStorage.getItem('favourites'));
    const favShowID = event.currentTarget.closest('span').getAttribute('id');
    const favIndex = findArrayIndex(favShowID, favourites);
    favourites.splice(favIndex, 1);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    updateCounter();
}

function loadFavourites(){

    if (favList.innerHTML=''){
        favList.innerHTML = '<p>Tu lista está vacía.</p>';
    } else {
        favList.innerHTML='';

        if (localStorage.getItem('favourites') !== null || localStorage.getItem('favourites') !== ''){
            favourites = JSON.parse(localStorage.getItem('favourites'));
            for (let favourite of favourites){
                paintFavourites(favourite);
            }
        } else {
            favList.innerHTML='';
        }
    }


    updateCounter();
}

function showSelectedFavourites(){
    if (localStorage.getItem('favourites') !==null){
        const searchItems = document.querySelectorAll('.search-item');
        favourites = JSON.parse(localStorage.getItem('favourites'));

        for (let item of searchItems){
            const itemTitle = item.querySelector('.select-item');

            for (let favourite of favourites){
                if(favourite.name == itemTitle.innerHTML){
                    item.classList.add('selected');
                }
            }
        }
    }
}

function resetFavList(){
    favList.innerHTML = '';
    localStorage.removeItem('favourites');
    favCounter.innerHTML = '0';
    const selectedItems = document.querySelectorAll('.selected');
    for (let selectedItem of selectedItems){
        selectedItem.classList.remove('.selected');
    }
}

buttonSearch.addEventListener('click', getShowsFromAPI);
formSearch.addEventListener('submit', introSearch);
window.addEventListener('load', loadFavourites);
resetFavs.addEventListener('click', resetFavList);

////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Extras -->

const favCounter = document.querySelector('#fav-counter');
const favTop = document.querySelector('#fav-top');
const favBottom = document.querySelector('#fav-bottom');
const favArrow = document.querySelector('#fav-arrow');

function updateCounter(){
    favourites = JSON.parse(localStorage.getItem('favourites'));
    favCounter.innerHTML = favourites.length;
}

function toggleFavList(){
    const favBottom = document.querySelector('#fav-bottom');
    favBottom.classList.toggle('fav-bottom--open');
    favArrow.classList.toggle('fav-arrow-open')
    loadFavourites();
}

favTop.addEventListener('click', toggleFavList);
