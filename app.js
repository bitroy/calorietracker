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
        totalcalories: 0,
    }

    return {
        getItems: function () {
            return itemsdata.items;
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
        }
    }

})();

// UI Controller
const UIController = (function () {

    return {
        fillItemList: function (items) {
            let listgroupitems = '';
            items.forEach(function (item) {
                listgroupitems += 
                `<li class="list-group-item" id=${item.id}>
                    <div class="row mx-1">
                        <strong>Name: ${item.name}, Calories: ${item.calories}</strong>
                        <button type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                    </div>
                </li>`;
            });

            document.querySelector(".list-group").innerHTML = listgroupitems;
        },
        getInputItems: function () {
            return {
                itemname: document.querySelector('#fooditem').value,
                itemcalorie: document.querySelector('#foodcalorie').value
            }
        },
        addNewItem: function (newitem) {
            let listgroupitem = 
                `<li class="list-group-item" id=${newitem.id}>
                    <div class="row mx-1">
                        <strong>Name: ${newitem.name}, Calories: ${newitem.calories}</strong>
                        <button type="button" class="btn btn-outline-secondary ml-auto">Edit</button> 
                    </div>
                </li>`;
            
            document.querySelector(".list-group").innerHTML += listgroupitem;
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
            UIController.resetFormUI();
        } else {
            UIController.showError();
        }
        event.preventDefault();
    }

    const loadEventListeners = function () {
        document.querySelector('#additembtn').addEventListener('click', addItem);    
    }

    return {
        initialize: function () {
            loadEventListeners();
            UIController.fillItemList(ItemController.getItems());
        }
    }

})(ItemController, UIController);

AppController.initialize();
