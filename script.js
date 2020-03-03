document.addEventListener('DOMContentLoaded', ()=>{
'use strict';
  let cards = {
    items: [],
    activeItems: [],
    activeFilters: [],
    films: [],
    init(){
      let cardsContainer = document.querySelector(".cards");
      this.items.forEach((item, index, items)=>{
        let elem = this.createCard(item);
        cardsContainer.append(elem);
        items[index].element = elem;
      });
      let filtersContainer = document.querySelector(".filters");
      this.films.forEach((item)=>{
        filtersContainer.append( this.createFilter(item) );
      });
    },

    reinit(){
      this.items.forEach((item)=>{
        if( this.activeItems.includes( item ) ){
          item.element.style.display = 'flex';
        } else {
          item.element.style.display = 'none';
        }
      });
    },

    filter(filmName){
      if( this.activeFilters.includes(filmName) ){
        this.activeFilters = this.activeFilters.filter( (name) => {
          return name === filmName ? false : true;
        });
      } else {
        this.activeFilters.push( filmName );
      }
      if( this.activeFilters.length ){
        this.activeItems = this.items.filter( card => {
          if( !card.movies ) return false;
          return card.movies.some( movie => this.activeFilters.includes(movie) );
        });
      } else {
        this.activeItems = this.items;
      }

      this.reinit();
    },

    createFilter(filmName){
      let node = document.createElement('a');
      node.classList.add('filters__btn');
      node.href = '#';
      node.innerText = filmName;
      return node;
    },

    createCard({photo, name, realName, status, movies, ...list}){
      let filmHtml = movies ? movies.reduce((acc, curr) => {
        return acc + `<a href="#" class="hero__films-link">${curr}</a>`;
      }, '') : '';
      let listHtml = '';
      for( let key in list){
        listHtml += `<li> <strong>${key}:</strong> ${list[key]}</li>`;
      }
      let node = document.createElement('article');
      node.classList.add('cards__hero');
      node.classList.add('hero');
      node.insertAdjacentHTML('beforeEnd', `<div class="hero__photo">
          <img src="${photo}" alt="${name}">
        </div>
        <div class="hero__content">
          <div class="hero__title">
            <h2 class="hero__name">${name}</h2>
            ${ realName ? '<div class="hero__real-name">'+realName+'</div>' : '' }
            <div class="hero__status">${status}</div>
          </div>
          <ul class="hero__list">${listHtml}</ul>
          ${filmHtml ? '<div class="hero__films">' + filmHtml + '</div>' : ''}
        </div>` );
      return node;
    },
    
    load( items ){
      this.items = items;
      this.films = items.reduce( (films, {movies}) => {
        return films.concat( movies );
      }, []).filter((film, index, arr) => {
        if ( !film ) return false;
        if( arr.indexOf(film) === arr.lastIndexOf(film) ){
          return true;
        }
        if( arr.indexOf(film) === index ){
          return true;
        }
        return false;
      });
      this.init();
      // listener on filter buttons
      document.addEventListener('click', (e)=>{
        if( e.target.classList.contains( 'filters__btn' ) || e.target.classList.contains('hero__films-link')){
          e.preventDefault();
          let links = Array.from(document.querySelectorAll(".filters__btn, .hero__films-link")).filter((link)=>{
            return e.target.innerText === link.innerText;
          });
          if( e.target.classList.contains( 'active' ) ){
            // undo filter
            links.forEach(link=>{
              link.classList.remove('active');
            });
          } else {
            // do filter
            links.forEach(link=>{
              link.classList.add('active');
            });
          }
          this.filter( e.target.innerText );
        }
      });
      // print cards
    }
  };

  fetch('dbHeroes.json')
    .then((resp)=>{
      return resp.json();
    })
    .then((resolt)=>{
      cards.load(resolt);
    })
    .catch((error)=>{
      console.error(error);
      alert(`Ошибка соединения, перезагрузите страницу.`);
    });
});


