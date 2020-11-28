import $ from 'jquery'
import './index.css'
import api from './api'
import store from './store.js'
import shoppingList from './bookmark-list'
import generateForm from './generateForm'

function renderForm() {
  $('.form').html(
  `
  <h1>Bookmarks</h1>
    <form id="js-shopping-list-form">
      <div class="error-container">text</div>
      ${generateForm.generateTextField('Bookmark Title: ', 'bookmark-entry', 'e.g., Google')}
      ${generateForm.generateTextField('Bookmark URL: ', 'bookmark-url', 'e.g. https://www.google.com')}
      ${generateForm.generateTextField('Bookmark Description: ', 'bookmark-description', 'e.g. Favorite site')}
      ${generateForm.generateNumberOption('Bookmark rating: ', 'bookmark-rating')}
      <button type="submit">Add bookmark</button>
    </form>
    `
    )
}

const main = function () {
  renderForm()
  api.getItems()
  .then((items) => {
    items.forEach((item) => store.addItem(item));
    shoppingList.render();
  })
  shoppingList.bindEventListeners();
  shoppingList.render();
};

$(main);
