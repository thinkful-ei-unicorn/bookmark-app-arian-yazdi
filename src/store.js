import $ from 'jQuery'

const items = [];
let filter = 1
let error = null

const findById = function (id) {
  return this.items.find(currentItem => currentItem.id === id);
};

const addItem = function (item) {
  this.items.push(item)
};

const findAndDelete = function (id) {
  this.items = this.items.filter(currentItem => currentItem.id !== id);
};

const toggleCheckedFilter = function () {
  this.hideCheckedItems = !this.hideCheckedItems;
};

const setError = function(error) {
  if(error) {this.error = error}
}

export default {
  items,
  filter,
  error,
  findById,
  addItem,
  findAndDelete,
  toggleCheckedFilter,
  setError
};