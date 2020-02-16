// Item Controller
const ItemController = (function () {
    
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const itemsdata = {
        items: [],
        currentitem: null,
        totalcalories: 0
    }

    return {
        getItems: function () {
            return itemsdata.items;
        },
        getCurrentItem: function () {
            return itemsdata.currentitem;
        },
        setCurrentItem: function (item) {
            itemsdata.currentitem = item;
        },
        getTotalCalories: function () {
            let total = 0;
            itemsdata.items.forEach(function (item) {
                total += item.calories;
            })
            itemsdata.totalcalories = total;
            return total;
        },
        setTotalCalories: function (calories) {
            itemsdata.totalcalories = calories;
        },
        getItemById: function (id) {
            let searchitem = null;
            itemsdata.items.forEach(function (item) {
                if(item.id === id) {
                    searchitem = item;
                }
            });
            return searchitem;
        },
        addItem: function (inputs) {
            let id = 0;
            let totalitems = itemsdata.items.length
            if(totalitems > 0) {
                id = itemsdata.items[totalitems - 1].id + 1;
            }
            const newitem = new Item(id, inputs.itemname, parseInt(inputs.itemcalorie));
            itemsdata.items.push(newitem);
            return newitem;
        },
        updateItem: function (inputs) {
            let updateitem = null;
            itemsdata.items.forEach(function (item) {
                if(item.id == itemsdata.currentitem.id) {
                    item.name = inputs.itemname;
                    item.calories = inputs.itemcalorie;
                    updateitem = item;
                }
            });
            return updateitem;
        },
        deleteItem: function (currentitem) {
            const calories = parseInt(this.getTotalCalories() - currentitem.calories);
            this.setTotalCalories(calories);
            itemsdata.items = itemsdata.items.filter(function (item) {
                if(currentitem.id !== item.id) {
                    return item;
                }
            });
        },
        clearAll: function () {
            itemsdata.items = [];
            itemsdata.currentitem = null;
            itemsdata.totalcalories = 0;
        }
    }

})();

// UI Controller
const UIController = (function () {

    return {
        initialRender: function () {
            document.querySelector('#additembtn').style.display = 'block';
            document.querySelector('#undochangesbtn').style.display = 'none';
            document.querySelector('#deleteitembtn').style.display = 'none';
            document.querySelector('#updateitembtn').style.display = 'none';
        },
        fillItemList: function (items) {
            let listgroupitems = '';
            items.forEach(function (item) {
                listgroupitems += 
                `<li class="list-group-item" id="item-${item.id}">
                    <div class="row mx-1">
                        <strong>Name: ${item.name}, Calories: ${item.calories}</strong>
                        <button id="edititembtn" type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                    </div>
                </li>`;
            });

            document.querySelector(".list-group").innerHTML = listgroupitems;
        },
        getInputItems: function () {
            return {
                itemname: document.querySelector('#fooditem').value,
                itemcalorie: parseInt(document.querySelector('#foodcalorie').value)
            }
        },
        setTotalCalories: function (totalcalories) {
            document.querySelector(".total-calories").innerHTML = `${totalcalories}`;
        },
        addNewItem: function (newitem) {
            let listgroupitem = 
                `<li class="list-group-item" id="item-${newitem.id}">
                    <div class="row mx-1">
                        <strong>Name: ${newitem.name}, Calories: ${newitem.calories}</strong>
                        <button id="edititembtn" type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                    </div>
                </li>`;
            
            document.querySelector(".list-group").innerHTML += listgroupitem;
        },
        showEditForm: function () {
            const currentitem = ItemController.getCurrentItem();
            document.querySelector('#fooditem').value = currentitem.name;
            document.querySelector('#foodcalorie').value = currentitem.calories;
            document.querySelector('#additembtn').style.display = 'none';
            document.querySelector('#undochangesbtn').style.display = 'block';
            document.querySelector('#deleteitembtn').style.display = 'block';
            document.querySelector('#updateitembtn').style.display = 'block';
        },
        updateItem: function (updateitem) {
            document.querySelector(`#item-${updateitem.id}`).innerHTML = 
                `<div class="row mx-1">
                    <strong>Name: ${updateitem.name}, Calories: ${updateitem.calories}</strong>
                    <button id="edititembtn" type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                </div>`;
        },
        deleteItem: function (id) {
            document.querySelector(`#item-${id}`).remove();
            this.resetFormUI();
            this.initialRender();
        },
        resetFormUI: function () {
            document.querySelector("#fooditem").value = '';
            document.querySelector("#foodcalorie").value = '';
            document.querySelector("#additembtn").blur();
        },
        clearEditUI: function () {
            this.resetFormUI();
            this.initialRender();
        },
        clearAllUI: function () {
            Array.from(document.querySelectorAll(".list-group-item")).forEach(function (item) {
                item.remove();
            });
            this.setTotalCalories(0);
            this.resetFormUI();
            this.initialRender();
        }
    }

})();

// App Controller
const AppController = (function (ItemController, UIController) {
    
    const addItem = function (event) {
        let inputs = UIController.getInputItems();
        if(inputs.itemname !== '' && (inputs.itemcalorie !== '' && inputs.itemcalorie > 0)) {
            UIController.addNewItem(ItemController.addItem(inputs));
            UIController.setTotalCalories(ItemController.getTotalCalories());
            UIController.resetFormUI();
        } else {
            UIController.showError();
        }
        event.preventDefault();
    }

    const editItemForm = function (event) {
        if(event.target.getAttribute('id') === 'edititembtn') {
            const id = event.target.closest('.list-group-item').getAttribute('id').split('item-')[1];
            const edititem = ItemController.getItemById(parseInt(id));
            ItemController.setCurrentItem(edititem);
            UIController.showEditForm(edititem);
        }
        event.preventDefault();
    }

    const updateItem = function (event) {
        let inputs = UIController.getInputItems();
        if(inputs.itemname !== '' && (inputs.itemcalorie !== '' && inputs.itemcalorie > 0)) {
            UIController.updateItem(ItemController.updateItem(inputs));
            UIController.setTotalCalories(ItemController.getTotalCalories());
            UIController.clearEditUI();
        } else {
            UIController.showError();
        }
        event.preventDefault();
    }

    const deleteItem = function (event) {
        ItemController.deleteItem(ItemController.getCurrentItem());
        UIController.deleteItem(ItemController.getCurrentItem().id);
        UIController.setTotalCalories(ItemController.getTotalCalories());
        event.preventDefault();
    }

    const clearEditUI = function (event) {
        UIController.clearEditUI();
        event.preventDefault();
    }

    const clearAll = function (event) {
        ItemController.clearAll();
        UIController.clearAllUI();
        event.preventDefault();
    }

    const loadEventListeners = function () {
        document.querySelector('.list-group').addEventListener('click', editItemForm);
        document.querySelector('#additembtn').addEventListener('click', addItem);
        document.querySelector("#updateitembtn").addEventListener('click', updateItem);
        document.querySelector("#undochangesbtn").addEventListener('click', clearEditUI);
        document.querySelector("#deleteitembtn").addEventListener('click', deleteItem);
        document.querySelector("#clearallbtn").addEventListener('click', clearAll);
    }

    return {
        initialize: function () {
            loadEventListeners();
            UIController.initialRender();
            UIController.fillItemList(ItemController.getItems());
            UIController.setTotalCalories(ItemController.getTotalCalories());
        }
    }

})(ItemController, UIController);

AppController.initialize();
