import $ from 'jquery';
import store from './store';
import api from './api'
import generateForm from './generateForm'

const generateItemElement = function (item) {
  let itemTitle = `<span class="bookmark-item bookmark-item__checked">${item.title}</span>`;
  let bookmarkRating = `<span class="bookmark-item bookmark-item__checked">${item.rating}/5</span>`
  let bookmarkDescription = `<p>${item.desc}</p>
    <a href="${item.url}">${item.url}</a>`
  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      ${bookmarkRating}
      <div class="hidden description${item.id}">${bookmarkDescription}</div>
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
        <h2>${message}</h2>
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

const renderPage = function() {
  $('#page').html(`
    <div class="container">
      <h1>Bookmarks</h1>
      <article class="error-container">text</article>
      <article class="form"><button class='newBookmark'>New Bookmark</button></article>
      <div class='rating-select'>
        <label for="rating-filter">Choose Rating:</label>
        <select name="rating-filter" id="rating-filter">
          <option value="0">all</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <section class='bookmarks'>
        <ul class="bookmark-list js-bookmark-list">
        </ul>
      </section>
    </div>
  `)
}

const render = function () {
  renderError()
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  let filtered = items.filter(item => {
      return item.rating >= store.filter
    })
  console.log(store.filter)
  // render the bookmark list in the DOM
  const bookmarkListItemsString = generateBookmarkItemsString(filtered);

  // insert that HTML into the DOM
  
  $('.js-bookmark-list').html(bookmarkListItemsString);
};

const renderForm = function() {
  $('.form').html(`
    <section class='forms'>
      <form id="js-bookmark-list-form">
        <section class="form1">
          ${generateForm.generateTextField('Bookmark Title: ', 'bookmark-entry', 'e.g., Google')}
          ${generateForm.generateTextField('Bookmark URL: ', 'bookmark-url', 'e.g. https://www.google.com')}
        </section>
        <section class="form2">
          ${generateForm.generateTextField('Bookmark Description: ', 'bookmark-description', 'e.g. Favorite site')}
          ${generateForm.generateNumberOption('Bookmark rating: ', 'bookmark-rating')}
        </section>
          <button class="submit" type="submit">Add bookmark</button>
      </form>
    </section>
  `)
}

const renderClearInput = function() {
  $('#bookmark-entry').val('')
  $('#bookmark-url').val('')
  $('#bookmark-description').val('')
  $('#bookmark-rating').val('')
}

const handleNewBookmark = function() {
  $('.newBookmark').click(evt => {
    $(evt.currentTarget).toggleClass('hidden')
    console.log('clicked')
    renderForm()
    render()
  })
}

const handleNewItemSubmit = function () {
  $('.form').submit(function (event) {
    event.preventDefault();
    const title = $('#bookmark-entry').val();
    const url = $('#bookmark-url').val();
    const description = $('#bookmark-description').val();
    const rating = $('#bookmark-rating').val();
    api.createItem(title, url, description, rating)
      .then((newItem) => {
        store.addItem(newItem);
        render();
        renderClearInput()
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
      if(error) { store.setError(error.message)};
      renderError()
    });
  });
};

const handleDescription = function() {
  $('.js-bookmark-list').on('click', '.description-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget)
    console.log(event.currentTarget)
    $(`.description${id}`).toggleClass('hidden')
  })
}

const handleFilter = function() {
  $( "#rating-filter" ).change(function() {
    store.filter = $('#rating-filter').val()
    render()
  })
}

const bindEventListeners = function () {
  handleNewBookmark();
  handleNewItemSubmit();
  handleDeleteItemClicked();
  handleDescription();
  handleCloseError()
  handleFilter()
};
// This object contains the only exposed methods from this module:
export default {
  renderPage,
  render,
  bindEventListeners
};