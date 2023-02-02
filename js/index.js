// Accordion

const accordionElement = document.getElementsByClassName('accordion');

for (i = 0; i < accordionElement.length; i++) {
  accordionElement[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
}


class Item {
  constructor(item) {
    Object.assign(this, item);
    this.like = false;
    this.orders = Math.round(Math.random() * 1000);
  }

  get isAvailableForBuy() {
    return this.orderInfo.inStock > 0;
  }

  get absoluteImgPath() {
    return `../img/${this.imgUrl}`;
  }

  toggleLike() {
    return (this.like = !this.like);
  }
}

class ItemsModel {
  constructor() {
    // Create Item instances list from items list
    this.items = items.map((item) => new Item(item));
  }

  // Get list with items based on query as substring in item name
  findManyByName(name) {
    const nameAsLowerCase = name.toLowerCase();
    return this.items.filter((item) =>
      item.name.toLowerCase().includes(nameAsLowerCase)
    );
  }
}

class RenderCards {
  // Dependency injection (but it's not true)
  constructor(itemsModel) {
    this.cardsContainer = document.querySelector('.items-list'); // Container element
    this.renderCards(itemsModel.items); // Auto render cards after init page
  }

  static renderCard(item) {
    // Create element
    const cardElem = document.createElement('div');
    cardElem.className = 'item';

    // Add content for card
    cardElem.innerHTML = `
            <button class="item__like"></button>
            <img src="${item.absoluteImgPath}" alt="${item.name}" class="img">
            <p class="item__header">${item.name}</p>
            <p class="item__left"><span>${item.orderInfo.inStock}</span> left in stock</p>
            <p class="item__price"><span>${item.price}</span> $</p>
            <button class="btn-add">Add to cart</button>
            <div class="item__reviews">
              <p><span class="positive-reviews">${item.orderInfo.reviews}%</span> Positive reviews </p>
              <p>${item.orders}</p>
              <p>Above avarage</p>
              <p>orders</p>
    `;

    const likeBtn = cardElem.querySelector('.item__like');

    if (item.like) {
      likeBtn.classList.add('active');
    }

    likeBtn.onclick = () => {
      item.toggleLike();
      likeBtn.classList.toggle('active');
    };

    return cardElem;
  }

  renderCards(items) {
    // Clear container
    this.cardsContainer.innerHTML = '';

    // Cereate elements with cards based on items list
    const elements = items.map((item) => RenderCards.renderCard(item));

    // Add elements to container
    this.cardsContainer.append(...elements);
  }
}

class Filter {
  #itemsModel = null;
  #renderCards = null;
  constructor(itemsModel, renderCards) {
    this.name = '';
    this.sort = 'default';
    this.#itemsModel = itemsModel;
    this.#renderCards = renderCards;
  }

  setFilter(key, value) {
    this[key] = value;
    console.log(this);
    this.#findAndRerender();
  }

  #findAndRerender() {
    const items = this.#itemsModel.findManyByName(this.name);
    this.#renderCards.renderCards(items);
  }
}

// const itemsModel = new ItemsModel();
// const renderCards = new RenderCards(itemsModel);
// const filter = new Filter(itemsModel, renderCards);

const inputName = document.querySelector('.search__item');
// const selectSort = document.getElementById('sortFilter');

inputName.oninput = (event) => {
  const { value } = event.target;
  filter.setFilter('name', value);
};

// selectSort.onchange = (event) => {
//   const { value } = event.target;
//   filter.setFilter('sort', value);
// };


const cardElem = document.querySelector('.item');
const modalContainer = document.querySelector('.innerModal');
const modalElem = document.querySelector('.modal');

modalElem.onclick = (e) => {
  modalElem.classList.remove('active');
};

cardElem.onclick = () => {
  modalElem.classList.toggle('active');
};

const btnElem = document.querySelectorAll('.btn-add');

btnElem.onclick = (event) => {
  event.stopPropagation();
};

/* Может кому понадобится! Можно получить данные из псевдоэлементов after/before 
var content = window.getComputedStyle(document.querySelector('#tool'),':before').content;
var content = window.getComputedStyle(document.querySelector('#tool'),':after').getPropertyValue('content');
*/