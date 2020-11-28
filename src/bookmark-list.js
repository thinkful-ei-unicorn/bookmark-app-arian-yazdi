import $ from 'jquery';
import store from './store';
import api from './api'
import generateForm from './generateForm'

const generateItemElement = function (item) {
  let itemTitle = `<h3 class="bookmark-item bookmark-item__checked">${item.title}</h3>`;
  let bookmarkRating = `<p class="bookmark-item bookmark-item__checked">${item.rating}/5</p>`
  let bookmarkDescription = `<p>${item.desc}</p><a href="url">${item.url}</a>`
  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      ${bookmarkRating}
      <div class="hidden description">${bookmarkDescription}</div>
      <div class="bookmark-item-controls">
        ${generateForm.generateButton('Description', 'description-toggle', 'js-description-toggle')}
        ${generateForm.generateButton('Delete', 'bookmark-item-delete', 'js-item-delete')}
      </div>
    </li>`;
};

const generateBookmarkItemsString = function (bookmarkList) {
  const items = bookmarkList.map((item) => generateItemElement(item));
  return items.join('');
};

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const er = generateError(store.error);
    $('.error-container').html(er);
  } else {
    $('.error-container').html('');
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const render = function () {
  renderError()
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  let filtered = items.filter(item => {
      return item.rating >= store.filter
    })
  // render the bookmark list in the DOM
  const bookmarkListItemsString = generateBookmarkItemsString(filtered);

  // insert that HTML into the DOM
  $('.js-bookmark-list').html(bookmarkListItemsString);
};

const handleNewItemSubmit = function () {
  $('.form').submit(function (event) {
    event.preventDefault();
    const title = $('#bookmark-entry').val();
    $('#bookmark-entry').val('');
    const url = $('#bookmark-url').val();
    $('#bookmark-url').val('')
    const description = $('#bookmark-description').val();
    $('#bookmark-description').val('')
    const rating = $('#bookmark-rating').val();
    $('#bookmark-rating').val('')
    api.createItem(title, url, description, rating)
      .then((newItem) => {
        store.addItem(newItem);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-bookmark-list').on('click', '.bookmark-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    api.deleteItem(id)
    .then(() => {
      store.findAndDelete(id)
      render()
    })
    .catch((error) => {
      console.log(error);
      store.setError(error.message);
      renderError();
    });
  });
};

const handleDescription = function() {
  $('.js-bookmark-list').on('click', '.description-toggle', event => {
    console.log('clicked')
    $('.description').toggleClass('hidden')
  })
}

const handleItemCheckClicked = function () {
  $('.js-bookmark-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id)
    api.updateItem(id, {checked: !item.checked})
    .then(() => {
      store.findAndUpdate(id, {checked: !item.checked})
      render()
    })
    .catch((error) => {
      store.setError(error.message)
      renderError()
    })
  });
};

const handleFilter = function() {
  $( "#rating-filter" ).change(function() {
    store.filter = $('#rating-filter').val()
    render()
  })
}

const bindEventListeners = function () {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleDescription();
  handleCloseError()
  handleFilter()
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};