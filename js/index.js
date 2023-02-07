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
    return `./img/${this.imgUrl}`;
  }

  toggleLike() {
    return (this.like = !this.like);
  }

  checkIsNameIncludes(name) {
    const nameAsLowerCase = name.toLowerCase();
    return this.name.toLowerCase().includes(nameAsLowerCase);
  }

  checkIsColorIncludes(colors) {
    if (!colors.length) return true;

    for (const color of colors) {
      const isExists = this.color.includes(color);
      if (isExists) {
        return true;
      }
    }
    return false;
  }

  checkIsStorageIncludes(storages) {
    // storages [256, 512, 1024]
    // this.storage 2048
    if (!storages.length) return true;

    for (const storage of storages) {
      if (this.storage === storage) {
        return true;
      }
    }
    return false;
  }

  checkIsOsIncludes(oss) {
    // storages [256, 512, 1024]
    // this.storage 2048
    if (!oss.length) return true;

    for (const os of oss) {
      if (this.os === os) {
        return true;
      }
    }
    return false;
  }

  checkIsPriceIncludes(prices) {
    if (!prices.length) return true;

    for (const price of prices) {
      if (this.price === price) {
        return true;
      }
    }
    return false;
  }

  checkIsDisplayIncludes(displays) {
    if (!displays.length) return true;

     for (const display of displays) {
       if (this.display === display) {
         return true;
       }
     }
     return false;
  }
}

class ItemsModel {
  constructor() {
    // Create Item instances list from items list
    this.items = items.map((item) => new Item(item));
  }

  get availablePrice() {
    return this.items
      .map((item) => item.price)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      )
      .sort((a, b) => {
        return a - b;
      });
  }

  get availableColors() {
    return this.items
      .reduce((acc, item) => [...acc, ...item.color], [])
      .filter((item, index, arr) => arr.indexOf(item) === index);
  }

  get availableMemory() {
    return this.items
      .map((item) => item.storage)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      )
      .sort((a, b) => {
        return a - b;
      });
  }

  get availableOs() {
    return this.items
      .map((item) => item.os)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      )
      .sort((a, b) => {
        return a - b;
      });
  }

  get availableDisplay() {
    let result = ['<5', '5-7', '7-12', '12-16', '+16'];
    return result.filter((item, index, arr) => arr.indexOf(item) === index);
  }

  // Get list with items based on query as substring in item name
  findManyByPrice(filter) {
    let result = this.items;

    for (let key in filter) {
      if (key === 'from') {
        let numMin = itemsModel.availablePrice[0];
        if (key === 'from' && filter[key] > numMin) {
          numMin = +filter[key];
        }
        result = result.filter((item) => {
          return item.price >= numMin;
        });
      }
    }
    for (let key in filter) {
      if (key === 'to') {
        let numMax =
          itemsModel.availablePrice[itemsModel.availablePrice.length - 1];
        if (key === 'to' && filter[key] < numMax) {
          numMax = +filter[key];
        }
        result = result.filter((item) => {
          return item.price <= numMax;
        });
      }
    }
    return result;
  }

  filterItems(filter = {}) {
    const {
      name = '',
      price = [],
      color = [],
      storage = [],
      os = [],
      display = [],
    } = filter;

    return this.items.filter((item) => {
      // Check on substring includes in string
      const isNameIncluded = item.checkIsNameIncludes(name);
      if (!isNameIncluded) return false;

      // Check on substring includes in string
      const isColorIncluded = item.checkIsColorIncludes(color);
      if (!isColorIncluded) return false;

      // Check on substring includes in string
      const isStorageIncluded = item.checkIsStorageIncludes(storage);
      if (!isStorageIncluded) return false;

      // Check on substring includes in string
      const isOsIncluded = item.checkIsOsIncludes(os);
      if (!isOsIncluded) return false;

      const isDisplayIncluded = item.checkIsDisplayIncludes(display);
      if (!isDisplayIncluded) return false;

      const isPriceIncluded = item.checkIsPriceIncludes(price);
      if (!isPriceIncluded) return false;
      return true;
    });
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

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';

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
            </div>
    `;

    const likeBtn = cardElem.querySelector('.item__like');

    if (item.like) {
      likeBtn.classList.add('active');
    }

    likeBtn.onclick = (e) => {
      item.toggleLike();
      likeBtn.classList.toggle('active');
      e.stopPropagation();
    };
    // modalWindow
    function modalWindow() {
      const modalContainer = document.querySelector('.innerModal');

      modalElem.onclick = () => {
        modalElem.classList.remove('active');
        bodyHidden.classList.remove('active');
      };

      modalContainer.innerHTML = `
              <img src="${item.absoluteImgPath}" alt="${item.name}" />
              <div class="modal__main">
                <p class="modal__header">${item.name}</p>
                <div class="item__reviews">
                  <p><span class="positive-reviews">65%</span> Positive reviews</p>
                  <p><span>296</span></p>
                  <p>Above avarage</p>
                  <p>orders</p>
                </div>
                <ul class="more-info">
                  <li>Color: <span>${item.color.join(', ')}</span></li>
                  <li>Operating System: <span>${item.os}</span></li>
                  <li>Chip: <span>${item.chip.name}</span></li>
                  <li>Height: <span>${item.size.height}</span></li>
                  <li>Width: <span>${item.size.width}</span></li>
                  <li>Depth: <span>${item.size.depth}</span></li>
                  <li>Weight: <span>${item.size.weight}</span></li>
                </ul>
              </div>
              <div class="modal__price">
                <p>$ ${item.price}</p>
                <p>Stock: <span>${item.orderInfo.inStock}</span> pcs.</p>
                <button class="btn-add">Add to cart</button>
              </div>
    `;
    }

    const modalElem = document.querySelector('.modal');
    const bodyHidden = document.getElementsByTagName('body')[0];

    cardElem.onclick = () => {
      modalElem.classList.toggle('active');
      bodyHidden.classList.toggle('active');
    };

    cardElem.addEventListener('click', modalWindow);

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
    this.color = [];
    this.storage = [];
    this.from = null;
    this.to = Infinity;
    this.os = [];
    this.price = [];
    this.display = [];
    this.#itemsModel = itemsModel;
    this.#renderCards = renderCards;
  }

  setFilter(key, value) {
    if (!Array.isArray(this[key])) {
      this[key] = value;
      this.#findAndRerender();
      return;
    }

    if (this[key].includes(value)) {
      this[key] = this[key].filter((val) => val !== value);
    } else {
      this[key].push(value);
    }
    this.#findAndRerender();
  }

  #findAndRerender() {
    const items = this.#itemsModel.filterItems({ ...this });
    this.#renderCards.renderCards(items);
    // const itemByPrice = this.#itemsModel.findManyByPrice({ ...this });
    // this.#renderCards.renderCards(itemByPrice);
  }
}

class RenderFilters {
  #filter = null;
  constructor(itemsModel, filter) {
    this.#filter = filter;
    this.containerElem = document.querySelector('.filter-column');
    this.filterOptions = [
      {
        displayName: 'Price',
        name: 'price',
        options: itemsModel.availablePrice,
      },
      {
        displayName: 'Color',
        name: 'color',
        options: itemsModel.availableColors,
      },
      {
        displayName: 'Memory',
        name: 'storage',
        options: itemsModel.availableMemory,
      },
      {
        displayName: 'OS',
        name: 'os',
        options: itemsModel.availableOs,
      },
      {
        displayName: 'Display',
        name: 'display',
        options: itemsModel.availableDisplay,
      },
    ];

    this.inputName = document.querySelector('.search__item');

    // this.selectSort = document.getElementById('sortFilter');

    this.inputName.oninput = (event) => {
      const { value } = event.target;
      this.#filter.setFilter('name', value);
    };

    // this.selectSort.onchange = (event) => {
    //   const { value } = event.target;
    //   this.#filter.setFilter('sort', value);
    // };

    // this.sortFilter(this.#filter);
    this.renderFilters(this.filterOptions);
  }

  static renderFilter(optionsData) {
    const filterBy = document.createElement('button');
    filterBy.className = `accordion`;
    filterBy.innerHTML = `${optionsData.displayName}`;
    this.containerElem.append(filterBy);
    const filterContainer = document.createElement('div');
    filterContainer.className = `panel panel__${optionsData.displayName.toLocaleLowerCase()}`;
    this.containerElem.append(filterContainer);

    // price filter

    if (optionsData.name === 'price') {
      filterContainer.innerHTML = `
        <div class="panel__values-item">
          <span>From</span>
          <input type="number" id="value_from" />
        </div>
        <div class="panel__values-item">
          <span>To</span>
          <input type="number" id="value_to" />
        </div>
      `;

      const min = document.getElementById('value_from');
      const max = document.getElementById('value_to');

      min.oninput = (e) => {
        const { value } = e.target;
        this.#filter.setFilter('from', value);
      };

      max.oninput = (e) => {
        const { value } = e.target;
        if (
          Number(value) >=
          itemsModel.availablePrice[itemsModel.availablePrice.length - 1]
        ) {
          e.target.value =
            itemsModel.availablePrice[itemsModel.availablePrice.length - 1];
        } else if (!value) {
          value = Infinity;
        }
        this.#filter.setFilter('to', value);
      };
      if (Number(value_from.value) <= itemsModel.availablePrice[0]) {
        value_from.value = itemsModel.availablePrice[0];
      }

      this.containerElem.append(filterContainer);
    }

    if (optionsData.name !== 'price') {
      const optionsElements = optionsData.options.map((option) => {
        const filterOption = document.createElement('label');
        filterOption.innerHTML = `<span>${option}</span>`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.onchange = () => {
          this.#filter.setFilter(optionsData.name, option);
        };

        filterOption.appendChild(checkbox);
        return filterOption;
      });

      filterContainer.append(...optionsElements);
      this.containerElem.append(filterContainer);
    }
  }

  renderFilters() {
    this.containerElem.innerHTML = '';

    const filtersElements = this.filterOptions.map((optionData) =>
      RenderFilters.renderFilter.call(this, optionData)
    );
  }

  // sortFilter() {
  //   const selectSort = document.getElementById('sortFilter');

  //   if (selectSort.value === 'asc') {
  //     filter.setFilter('sort', 'asc');
  //   }
  // }
}

const itemsModel = new ItemsModel();
const renderCards = new RenderCards(itemsModel);
const filter = new Filter(itemsModel, renderCards);
const renderFilters = new RenderFilters(itemsModel, filter);

// Accordion

const accordionElement = document.getElementsByClassName('accordion');

for (i = 0; i < accordionElement.length; i++) {
  accordionElement[i].addEventListener('click', function () {
    this.classList.toggle('active');
    const panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
}

// selectSort.onchange = (event) => {
//   const { value } = event.target;
//   filter.setFilter('sort', value);
// };

// btnElem.onclick = (event) => {
//   event.stopPropagation();
// };

/* Может кому понадобится! Можно получить данные из псевдоэлементов after/before 
var content = window.getComputedStyle(document.querySelector('#tool'),':before').content;
var content = window.getComputedStyle(document.querySelector('#tool'),':after').getPropertyValue('content');
*/
