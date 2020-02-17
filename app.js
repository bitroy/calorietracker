// Storage Controller
const StorageController = (function () {
    
    let items;
    return {
        getItems: () => {
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        setItem: (item) => {
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItem: (item) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (currentitem, index) {
                if(currentitem.id === item.id) {
                    items.splice(index, 1, item);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItem: (item) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.splice(items.indexOf(item.id), 1);
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemController = (function () {
    
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }

    const itemsdata = {
        items: StorageController.getItems(),
        currentitem: null,
        totalcalories: 0
    }

    return {
        getItems: () => {
            return itemsdata.items;
        },
        getCurrentItem: () => {
            return itemsdata.currentitem;
        },
        setCurrentItem: (item) => {
            itemsdata.currentitem = item;
        },
        getTotalCalories: () => {
            let total = 0;
            itemsdata.items.forEach((item) => {
                total += item.calories;
            })
            itemsdata.totalcalories = total;
            return total;
        },
        setTotalCalories: (calories) => {
            itemsdata.totalcalories = calories;
        },
        getItemById: (id) => {
            let searchitem = null;
            itemsdata.items.forEach((item) => {
                if(item.id === id) {
                    searchitem = item;
                }
            });
            return searchitem;
        },
        addItem: (inputs) => {
            let id = 0;
            let totalitems = itemsdata.items.length
            if(totalitems > 0) {
                id = itemsdata.items[totalitems - 1].id + 1;
            }
            const newitem = new Item(id, inputs.itemname, parseInt(inputs.itemcalorie));
            itemsdata.items.push(newitem);
            return newitem;
        },
        updateItem: (inputs) => {
            let updateitem = null;
            itemsdata.items.forEach((item) => {
                if(item.id == itemsdata.currentitem.id) {
                    item.name = inputs.itemname;
                    item.calories = inputs.itemcalorie;
                    updateitem = item;
                }
            });
            return updateitem;
        },
        deleteItem: (currentitem) => {
            const calories = parseInt(ItemController.getTotalCalories() - currentitem.calories);
            ItemController.setTotalCalories(calories);
            itemsdata.items = itemsdata.items.filter((item) => {
                if(currentitem.id !== item.id) {
                    return item;
                }
            });
        },
        clearAll: () => {
            itemsdata.items = [];
            itemsdata.currentitem = null;
            itemsdata.totalcalories = 0;
        }
    }

})();

// UI Controller
const UIController = (() => {

    return {
        initialRender: () => {
            document.querySelector('#additembtn').style.display = 'block';
            document.querySelector('#undochangesbtn').style.display = 'none';
            document.querySelector('#deleteitembtn').style.display = 'none';
            document.querySelector('#updateitembtn').style.display = 'none';
            let invalids = document.querySelectorAll('.invalid-input');
            for(let invalid of invalids) {
                invalid.style.display = 'none';
            }
        },
        fillItemList: (items) => {
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
        getInputItems: () => {
            return {
                itemname: document.querySelector('#fooditem').value,
                itemcalorie: parseInt(document.querySelector('#foodcalorie').value)
            }
        },
        setTotalCalories: (totalcalories) => {
            document.querySelector(".total-calories").innerHTML = `${totalcalories}`;
        },
        addNewItem: (newitem) => {
            let listgroupitem = 
                `<li class="list-group-item" id="item-${newitem.id}">
                    <div class="row mx-1">
                        <strong>Name: ${newitem.name}, Calories: ${newitem.calories}</strong>
                        <button id="edititembtn" type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                    </div>
                </li>`;
            
            document.querySelector(".list-group").innerHTML += listgroupitem;
        },
        showEditForm: () => {
            const currentitem = ItemController.getCurrentItem();
            document.querySelector('#fooditem').value = currentitem.name;
            document.querySelector('#foodcalorie').value = currentitem.calories;
            document.querySelector('#additembtn').style.display = 'none';
            document.querySelector('#undochangesbtn').style.display = 'block';
            document.querySelector('#deleteitembtn').style.display = 'block';
            document.querySelector('#updateitembtn').style.display = 'block';
        },
        updateItem: (updateitem) => {
            document.querySelector(`#item-${updateitem.id}`).innerHTML = 
                `<div class="row mx-1">
                    <strong>Name: ${updateitem.name}, Calories: ${updateitem.calories}</strong>
                    <button id="edititembtn" type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                </div>`;
        },
        deleteItem: (id) => {
            document.querySelector(`#item-${id}`).remove();
            UIController.resetFormUI();
            UIController.initialRender();
        },
        resetFormUI: () => {
            document.querySelector("#fooditem").value = '';
            document.querySelector("#foodcalorie").value = '';
            document.querySelector("#additembtn").blur();
        },
        clearEditUI: () => {
            UIController.resetFormUI();
            UIController.initialRender();
        },
        clearAllUI: () => {
            document.querySelector('#clearallbtn').blur();
            Array.from(document.querySelectorAll(".list-group-item")).forEach((item) => {
                item.remove();
            });
            UIController.setTotalCalories(0);
            UIController.resetFormUI();
            UIController.initialRender();
        },
        showError: () => {
            let inputs = UIController.getInputItems();
            let invalids = document.querySelectorAll('.invalid-input');
            if(inputs.itemname === '' && (isNaN(inputs.itemcalorie) || inputs.itemcalorie <= 0)) {
                for(let invalid of invalids) {
                    invalid.style.display = 'block';
                }
                document.querySelector('#fooditem').style.borderColor = "red";
                document.querySelector('#foodcalorie').style.borderColor = "red";
            } else if(inputs.itemname === '') {
                invalids[0].style.display = 'block';
                document.querySelector('#fooditem').style.borderColor = "red";
            } else if(isNaN(inputs.itemcalorie) || inputs.itemcalorie <= 0) {
                invalids[1].style.display = 'block';
                document.querySelector('#foodcalorie').style.borderColor = "red";
            }
        },
        clearInputItemInvalidation: () => {
            document.querySelector('#fooditem').style.borderColor = "";
            document.querySelectorAll('.invalid-input')[0].style.display = "none";
        },
        clearInputCalorieInvalidation: () => {
            document.querySelector('#foodcalorie').style.borderColor = "";
            document.querySelectorAll('.invalid-input')[1].style.display = "none";
        }
    }

})();

// App Controller
const AppController = (function (StorageController, ItemController, UIController) {
    
    const addItem = (event) => {
        let inputs = UIController.getInputItems();
        if(inputs.itemname !== '' && (!isNaN(inputs.itemcalorie) && inputs.itemcalorie > 0)) {
            const newitem = ItemController.addItem(inputs);
            UIController.addNewItem(newitem);
            UIController.setTotalCalories(ItemController.getTotalCalories());
            StorageController.setItem(newitem);
            UIController.resetFormUI();
        } else {
            UIController.showError();
            event.currentTarget.blur();
        }
    }

    const editItemForm = (event) => {
        if(event.target.getAttribute('id') === 'edititembtn') {
            event.target.blur();
            const id = event.target.closest('.list-group-item').getAttribute('id').split('item-')[1];
            const edititem = ItemController.getItemById(parseInt(id));
            ItemController.setCurrentItem(edititem);
            UIController.showEditForm(edititem);
        }
    }

    const updateItem = (event) => {
        let inputs = UIController.getInputItems();
        if(inputs.itemname !== '' && (!isNaN(inputs.itemcalorie) && inputs.itemcalorie > 0)) {
            const updateditem = ItemController.updateItem(inputs);
            StorageController.updateItem(updateditem);
            UIController.updateItem(updateditem);
            UIController.setTotalCalories(ItemController.getTotalCalories());
            UIController.clearEditUI();
        } else {
            UIController.showError();
        }
        event.currentTarget.blur();
    }

    const deleteItem = () => {
        const currentitem = ItemController.getCurrentItem();
        StorageController.deleteItem(currentitem);
        ItemController.deleteItem(currentitem);
        UIController.deleteItem(currentitem.id);
        UIController.setTotalCalories(ItemController.getTotalCalories());
    }

    const clearEditUI = () => {
        UIController.clearEditUI();
    }

    const clearAll = () => {
        ItemController.clearAll();
        UIController.clearAllUI();
        StorageController.clearStorage();
    }

    const clearInputItemInvalidation = () => {
        setTimeout(() => {
            UIController.clearInputItemInvalidation();
        }, 500);
    }

    const clearInputCalorieInvalidation = () => {
        setTimeout(() => {
            UIController.clearInputCalorieInvalidation();
        }, 500);
    }

    const loadEventListeners = () => {
        document.querySelector("#fooditem").addEventListener('keyup', clearInputItemInvalidation);
        document.querySelector("#foodcalorie").addEventListener('keyup', clearInputCalorieInvalidation);
        document.querySelector('.list-group').addEventListener('click', editItemForm);
        document.querySelector('#additembtn').addEventListener('click', addItem);
        document.querySelector("#updateitembtn").addEventListener('click', updateItem);
        document.querySelector("#undochangesbtn").addEventListener('click', clearEditUI);
        document.querySelector("#deleteitembtn").addEventListener('click', deleteItem);
        document.querySelector("#clearallbtn").addEventListener('click', clearAll);
    }

    return {
        initialize: () => {
            loadEventListeners();
            UIController.initialRender();
            UIController.fillItemList(ItemController.getItems());
            UIController.setTotalCalories(ItemController.getTotalCalories());
        }
    }

})(StorageController, ItemController, UIController);

AppController.initialize();
