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
    fetch (`https://api.tvmaze.com/search/shows?q=${inputSearchValue}`)
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

    const defaultImage = './assets/images/image-unavailable.png';

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

    clearSearch();

    const errorText = document.createElement('p');
    errorText.classList.add('error-message');
    const errorMessage = document.createTextNode('Lo siento mucho, no conozco esta serie.');
    errorText.appendChild(errorMessage);
    showList.appendChild(errorText);
}

function introSearch(){
    event.preventDefault();
    animateSearchBar();
}

function clearSearch(){
    if (showList.innerHTML !== ''){
        showList.innerHTML = '';
    }
    closeFavList();
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

    if(favourites.length < 1){
        closeFavList();
        loadFavourites();
    }
}

function loadFavourites(){

    if (favList.innerHTML === '' || favList.innerHTML === '<p>Tu lista está vacía.</p>'){
        favList.innerHTML = '<p>Tu lista está vacía.</p>';
    } else {
        favourites = JSON.parse(localStorage.getItem('favourites'));

        if (favourites !== null || favourites.length !== 0){
            favList.innerHTML='';
            for (let favourite of favourites){
                paintFavourites(favourite);
            }
        } else {
            favList.innerHTML='<p>Tu lista está vacía.</p>';
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
                if(favourite.id == itemTitle.getAttribute('id')){
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
    closeFavList();
}

function removeSelected(){
    favourites = JSON.parse(localStorage.getItem('favourites'));
    const selectedItems = document.querySelectorAll('.selected');

    if(favourites !== null){
        for (let selectedItem of selectedItems){
            const itemId = selectedItem.querySelector('.select-item').getAttribute('id');
            if(favourites === null || !favourites.includes(itemId)){
                selectedItem.classList.remove('selected');
            }
        }
    } else {
        return favourites=[];
    }

}

buttonSearch.addEventListener('click', animateSearchBar);
formSearch.addEventListener('submit', introSearch);
resetFavs.addEventListener('click', resetFavList);

////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Extras -->

const favCounter = document.querySelector('#fav-counter');
const favTop = document.querySelector('#fav-top');
const favBottom = document.querySelector('#fav-bottom');
const favArrow = document.querySelector('#fav-arrow');
const headerTitle = document.querySelector('#header-title');
const headerIcon = document.querySelector('#icon');

function updateCounter(){
    favourites = JSON.parse(localStorage.getItem('favourites'));
    favCounter.innerHTML = favourites.length;
}

function toggleFavList(){
    favourites = JSON.parse(localStorage.getItem('favourites'));
    favBottom.classList.toggle('fav-bottom--open');
    favArrow.classList.toggle('fav-arrow-open');
    loadFavourites();
    removeSelected();
}

function closeFavList(){
    if (favBottom.classList.contains('fav-bottom--open')){
        favBottom.classList.remove('fav-bottom--open');
        favArrow.classList.remove('fav-arrow-open');
    }

    removeSelected();
}

function animateSearchBar(){
    inputSearch.classList.add('input-animated');
    buttonSearch.classList.add('btn-animated');
    headerTitle.classList.add('title-animated');
    headerIcon.classList.add('icon-animated');

    setTimeout(getShowsFromAPI, 500);
}

favTop.addEventListener('click', toggleFavList);
