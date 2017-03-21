var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('checkoutController', function ($scope,$state,$translate,$rootScope,cartService) {

  $scope.isMemberLogin = false;
  $scope.isEditSeen = false;

  $scope.cart = cartService;

  initCart();

  function initCart() {
    if($scope.cart.CART.cartObject!=null && $scope.cart.CART.cartObject.orders.length>0){
      $rootScope.cart = $scope.cart.CART.cartObject;
      $scope.currentCart = angular.copy($scope.cart.CART.cartObject);
      initLoginStatus();
      calculateCartFullAmount();
    }else{
      $state.go('restaurant');
    }
  }

  function initLoginStatus(){
    if(localStorage.getItem('loginStatus')!=null){
      $scope.loginStatus = localStorage.getItem('loginStatus')=='true' && localStorage.getItem('loginStatus') != 'undefined' ? true : false;
    }else{
      $scope.loginStatus = false;
    }
  }

  $scope.toggleMemberLoginForm = function() {
    $scope.isMemberLogin = $scope.isMemberLogin ? false : true;
  };

  $scope.toggleEdit = function (item) {
    item.editEnabled = true;
  };

  $scope.add = function (item) {
      item.selectedSize.qty++;
      calculateCartFullAmount();
  };

  $scope.sub = function (item) {
      item.selectedSize.qty>0 ? item.selectedSize.qty-- : '';
      calculateCartFullAmount();
  };

  $scope.deleteItemFromCart = function (item) {
    console.log(item);
    for(var i=0;i< $scope.currentCart.orders.length;i++){
      if($scope.currentCart.orders[i].selectedSize.foodProductId == item.selectedSize.foodProductId){
        // console.log($scope.currentCart.orders[i]);
        $scope.currentCart.orders.splice(i, 1);
      }
    }
    calculateCartFullAmount();
  };

  $scope.resetCart = function () {
    $scope.currentCart = angular.copy($scope.cart.CART.cartObject);
    calculateCartFullAmount();
  };

  $scope.backToRestaurant = function () {
    $state.go('restaurant');
  };

  function calculateCartFullAmount(){
      if($rootScope.cart.orders.length>0){
          $scope.currentCart.totalAmount = 0;
          for(var i=0;i< $scope.currentCart.orders.length;i++){
            console.log($scope.currentCart.orders[i].selectedSize);
            $scope.currentCart.totalAmount += $scope.currentCart.orders[i].selectedSize.finalPrice * $scope.currentCart.orders[i].selectedSize.qty;
          }
      }
  };

  $scope.continueToDelivery = function () {
    processCartObject();
  };

  function processCartObject(){
    var orders = [];
    angular.forEach($scope.currentCart.orders,function(itemObj){
        orders.push(
          {
            "foodItemId": itemObj.itemId,
            "quantity": itemObj.selectedSize.qty,
            "sizeId": itemObj.selectedSize.sizeId
          }
        );
    });
    $scope.currentCart.orders = orders;
    delete $scope.currentCart.organizationName;
    delete $scope.currentCart.totalAmount;
    localStorage.setItem('CHECKOUT_CART',JSON.stringify($scope.currentCart));
    $state.go('delivery_member');
  }

  $scope.logIn = function () {
    $state.go('delivery_member');
  };

  $scope.guestDelivery = function () {
    $state.go('delivery_guest');
  };

});

t2b_mobile.controller('confirmOrderController', function ($scope,$state,$translate,$rootScope,$stateParams) {

  if($stateParams.bookingCart!=null){
    $scope.confirmedCart = JSON.parse($stateParams.bookingCart);
    calculateCartFullAmount();
  }else{
    $state.go('restaurant');
  }
  console.log($scope.confirmedCart);

  function calculateCartFullAmount(){
    if($scope.confirmedCart.orders.length>0){
      $scope.confirmedCart.totalAmount = 0;
      for(var i=0;i< $scope.confirmedCart.orders.length;i++){
        $scope.confirmedCart.totalAmount += $scope.confirmedCart.orders[i].selectedSize.finalPrice * $scope.confirmedCart.orders[i].selectedSize.qty;
      }
    }
  };

});

