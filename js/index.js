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

const containerElem = document.querySelector('.items-list');
// const modalElem = document.querySelector('.modal');
// const modalContainer = document.querySelector('.innerModal');
// modalElem.onclick = (e) => {
//   console.log(e);
//   modalElem.classList.remove('modal_active');
// };

const renderCard = (item) => {
  const cardElem = document.createElement('div');
  cardElem.className = 'item';
  // cardElem.onclick = () => {
  //   modalContainer.innerHTML = Object.entries(item)
  //     .map(([key, value]) => `<p>${key}: ${value}</p>`)
  //     .join(', ');
  //    modalElem.classList.add('modal_active');
  //    cardElem.classList.toggle('active');
  // };

  const imgElem = new Image();
  imgElem.src = `../img/${item.imgUrl}`;
  imgElem.alt = item.name;
  cardElem.append(imgElem);

  const nameElem = document.createElement('p');
  nameElem.className = 'item__header';
  nameElem.innerText = item.name;
  cardElem.append(nameElem);

  const itemsLeft = document.createElement('span');
  itemsLeft.className = 'item__left';
  itemsLeft.innerText = `${item.orderInfo['inStock']} left in stock`;
  cardElem.append(itemsLeft);

  const itemPrice = document.createElement('span');
  itemPrice.className = 'item__price';
  itemPrice.innerText = `Price: ${item.price} $`;
  cardElem.append(itemPrice);

  const btnElem = document.createElement('button');
  btnElem.className = 'btn-add';
  btnElem.innerText = 'Add to cart';
  cardElem.append(btnElem);

  /* bottom of card */

  const containerReviews = document.createElement('div');
  containerReviews.className = 'item__reviews';
  // 1-st p
  const pElemFirst = document.createElement('p');
  pElemFirst.innerHTML = `<span>${item.orderInfo['reviews']}%</span> Positive reviews`;
  containerReviews.append(pElemFirst);
  // 2-d p
  const pElemSecond = document.createElement('p');
  pElemSecond.innerText = `${item.orderInfo['inStock']}`;
  containerReviews.append(pElemSecond);
  // 3-d p
  const pElemThird = document.createElement('p');
  pElemThird.innerText = 'Above avarage';
  containerReviews.append(pElemThird);
  // 4-d p
  const pElemFourth = document.createElement('p');
  pElemFourth.innerText = 'orders';
  containerReviews.append(pElemFourth);

  cardElem.append(containerReviews);

  // btnElem.onclick = (event) => {
  //   event.stopPropagation();
  //   console.log(condidate);
  // };

  return cardElem;
};

const renderCards = (itemList) => {
  const cardsCollection = itemList.map(renderCard);
  containerElem.append(...cardsCollection);
};

renderCards(items);

/* Может кому понадобится! Можно получить данные из псевдоэлементов after/before 
var content = window.getComputedStyle(document.querySelector('#tool'),':before').content;
var content = window.getComputedStyle(document.querySelector('#tool'),':after').getPropertyValue('content');
*/
