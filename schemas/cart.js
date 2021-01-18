//References for this page:
//https://github.com/Napat07/Nextjs_projectlab/blob/aaeb9b3bc25e0e463aba2ee9bd5d2bf62fcb1e30/server/models/Cart.js
//The way how the cart will interact is defined in this file by this constrcutor
module.exports = function Cart(oldCart) {
    //We are using a boolean "or(||)" operator to get either the field by itself or an empty object
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    //Important to emphasize for the function "add":
    //The item details will be grouped, so the item details wont be repeated with a huge list
    //This function will check the new queries vs to the previous queries, so the items wont be repeated at the time they r being added
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    //The cart file on the views folder will use this function to reduce the quantity by one, as we can see the "id" field will lead the process
    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    //The cart file on the views folder will use this function to incrase the quantity by one, as we can see the "id" will lead the process
    this.increaseByOne = function (id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    //The cart file on the views folder will use this function to remove the item from the list, as we can see the "id" will lead the process
    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    //This function will display the items within an array, referenced by the id
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};