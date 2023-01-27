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

// render items

// const containerElem = document.querySelector('.items-list');

// const modalElem = document.querySelector('.modal');
// const modalContainer = document.querySelector('.innerModal');
// modalElem.onclick = (e) => {
//   console.log(e);
//   modalElem.classList.remove('modal_active');
// };

// const renderCard = (item) => {
//   const cardElem = document.createElement('div');
//   cardElem.className = 'item';
// cardElem.onclick = () => {
//   modalContainer.innerHTML = Object.entries(item)
//     .map(([key, value]) => `<p>${key}: ${value}</p>`)
//     .join(', ');
//    modalElem.classList.add('modal_active');
//    cardElem.classList.toggle('active');
// };

// const imgElem = new Image();
// imgElem.src = `../img/${item.imgUrl}`;
// imgElem.alt = item.name;
// cardElem.append(imgElem);

// const nameElem = document.createElement('p');
// nameElem.className = 'item__header';
// nameElem.innerText = item.name;
// cardElem.append(nameElem);

// const itemsLeft = document.createElement('span');
// itemsLeft.className = 'item__left';
// itemsLeft.innerText = `${item.orderInfo['inStock']} left in stock`;
// cardElem.append(itemsLeft);

// const itemPrice = document.createElement('span');
// itemPrice.className = 'item__price';
// itemPrice.innerText = `Price: ${item.price} $`;
// cardElem.append(itemPrice);

// const btnElem = document.createElement('button');
// btnElem.className = 'btn-add';
// btnElem.innerText = 'Add to cart';
// cardElem.append(btnElem);

/* bottom of card */

// const containerReviews = document.createElement('div');
// containerReviews.className = 'item__reviews';
// // 1-st p
// const pElemFirst = document.createElement('p');
// pElemFirst.innerHTML = `<span>${item.orderInfo['reviews']}%</span> Positive reviews`;
// containerReviews.append(pElemFirst);
// // 2-d p
// const pElemSecond = document.createElement('p');
// pElemSecond.innerText = `${item.orderInfo['inStock']}`;
// containerReviews.append(pElemSecond);
// // 3-d p
// const pElemThird = document.createElement('p');
// pElemThird.innerText = 'Above avarage';
// containerReviews.append(pElemThird);
// // 4-d p
// const pElemFourth = document.createElement('p');
// pElemFourth.innerText = 'orders';
// containerReviews.append(pElemFourth);

// cardElem.append(containerReviews);

// btnElem.onclick = (event) => {
//   event.stopPropagation();
//   console.log(condidate);
// };

//   return cardElem;
// };

// const renderCards = (itemList) => {
//   const cardsCollection = itemList.map(renderCard);
//   containerElem.append(...cardsCollection);
// };

// renderCards(items);

/* Может кому понадобится! Можно получить данные из псевдоэлементов after/before 
var content = window.getComputedStyle(document.querySelector('#tool'),':before').content;
var content = window.getComputedStyle(document.querySelector('#tool'),':after').getPropertyValue('content');
 */

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

const itemsModel = new ItemsModel();
const renderCards = new RenderCards(itemsModel);
const filter = new Filter(itemsModel, renderCards);

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
