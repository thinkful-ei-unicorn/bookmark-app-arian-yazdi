import $ from 'jquery'
import './index.css'
import api from './api'
import store from './store.js'
import bookmarkList from './bookmark-list'
import generateForm from './generateForm'



const main = function () {
  bookmarkList.renderPage()
  api.getItems()
  .then((items) => {
    items.forEach((item) => store.addItem(item));
    bookmarkList.render();
  })
  
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};


$(main);
