/** Created by Sudesh on 1/26/2017 */

angular.module('bookingCartService',[]).factory('cartService',function(){
    var bookingCart = new cart("BOOKING_CART");
    return {
        CART: bookingCart
    };
});
function cart(bookingCart){
    this.cartName = bookingCart;
    this.cartObject = {};
    this.clearCart = false;
    this.loadCart();
}
cart.prototype.loadCart = function(){
    var cartObj = localStorage != null ? localStorage[this.cartName] : null;
    if(cartObj != null && JSON != null){
        this.cartObject = JSON.parse(cartObj);
    }
};
cart.prototype.addCartObject = function (cartObj) {
    this.cartObject = cartObj;
    this.saveCart();
};
cart.prototype.removeCartObject = function () {
    this.cartObject = {};
    this.clearCart = true;
    this.saveCart();
};
cart.prototype.saveCart = function () {
  if (localStorage != null && JSON != null) {
    localStorage[this.cartName] = JSON.stringify(this.cartObject);
  }
};
