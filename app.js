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
        resetFormUI: function () {
            document.querySelector("#fooditem").value = '';
            document.querySelector("#foodcalorie").value = '';
            document.querySelector("#additembtn").blur();
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
            UIController.resetFormUI();
            UIController.initialRender();
        } else {
            UIController.showError();
        }
        event.preventDefault();
    }

    const loadEventListeners = function () {
        document.querySelector('#additembtn').addEventListener('click', addItem);
        document.querySelector('.list-group').addEventListener('click', editItemForm);
        document.querySelector("#updateitembtn").addEventListener('click', updateItem);
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
