var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('deliveryGuestController', function ($scope,$state,$translate,$rootScope) {

});

t2b_mobile.controller('deliveryMemberController', function ($scope,$state,serviceLocator,httpService,$translate,$rootScope) {
    $scope.editEnabled = false;
    $scope.addNewEnabled = false;
    $scope.newAddress = {};
    $scope.checkoutCart = {};
    var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;

    initCheckoutCart();

    function initCheckoutCart(){
      if(localStorage.getItem('CHECKOUT_CART')!=null && localStorage.getItem('CHECKOUT_CART')!=''){
        if(JSON.parse(localStorage.getItem('CHECKOUT_CART')).orders!=null && JSON.parse(localStorage.getItem('CHECKOUT_CART')).orders.length>0){
          $scope.checkoutCart = JSON.parse(localStorage.getItem('CHECKOUT_CART'));
          initLoginStatus();
          initDeliveryOptions();
        }else{
          $state.go('restaurant');
        }
      }else{
        $state.go('restaurant');
      }
    }

    function initLoginStatus(){
      if(localStorage.getItem('loginStatus')!=null){
        if(localStorage.getItem('loginStatus') && localStorage.getItem('loginStatus')){
          $scope.loginStatus = true;
          $scope.authResponse = JSON.parse(localStorage.getItem('authResponse'));
          $scope.checkoutCart.communityUser = $scope.authResponse.mobile;
          initAddress();
        }else{
          $scope.loginStatus = false;
        }
      }else{
        $scope.loginStatus = false;
      }
    }

    function initDeliveryOptions(){
      var extended_url = '/public/delevaryOptions';
      httpService.postRequest(t2bMobileApi,extended_url,{},{}).then(function(response){
        if(response!=null) {
          // console.log(response);
          $scope.deliveryOptions = response;
        }
      });
    }

    function initAddress() {
      console.log($scope.authResponse.email);
        var extended_url = '/User/get';
        var reqObj = {
          "userName": $scope.authResponse.email!=undefined ? $scope.authResponse.email : $scope.authResponse.mobile
        };
        httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
          if(response!=null) {
            $scope.addresses = response.addresses;
            if($scope.addresses.length==0){
              $scope.addNewEnabled = true;
            }
            console.log($scope.addresses);
          }
        });
    }

    $scope.addNew = function () {
      $scope.addNewEnabled = $scope.addNewEnabled ? false : true;
    };

    $scope.closeAddNew = function (){
      $scope.addNewEnabled = false;
    };

    $scope.submitNewAddress = function () {
      $scope.addNewEnabled = false;
      // console.log($scope.newAddress);
      var extended_url = '/User/address/new';
      var reqObj = {
        "addressId": 0,
        "userId": $scope.authResponse.userId,
        "contactName": $scope.newAddress.name,
        "addressLine1": $scope.newAddress.address.lineOne,
        "addressLine2": $scope.newAddress.address.lineTwo,
        "city": $scope.newAddress.address.city,
        "cityId": 11,
        "areaId": 0,
        "areaName": "",
        "state": "",
        "zipCode": "",
        "telephone": $scope.newAddress.mobile,
        "country": "",
        "longitude": 0,
        "latitude": 0
      };
      console.log(reqObj);
      httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
        if(response!=null) {
          initAddress();
          console.log(response);
        }
      });
    };

    $scope.edit = function (address) {
      $scope.addNewEnabled = false;
      $scope.selectedAddress = address;
      angular.forEach($scope.addresses,function(obj){
          obj.editEnabled = false;
      });
      $scope.selectedAddress.editEnabled = true;
    };

    $scope.editAddress = function (address) {
      delete address.editEnabled;
      var extended_url = '/User/address/update';
      httpService.postRequest(t2bMobileApi,extended_url,address,{}).then(function(response){
        if(response!=null) {
          address.editEnabled = false;
        }
      });
    };

    $scope.deleverHere = function (deliveryAddress) {
      $scope.checkoutCart.addressLine1 = deliveryAddress.addressLine1;
      $scope.checkoutCart.addressLine2 = deliveryAddress.addressLine2;
      $scope.checkoutCart.city = deliveryAddress.city;
      $scope.checkoutCart.customerMobile = deliveryAddress.telephone;
      $scope.checkoutCart.customerName = deliveryAddress.contactName;
      console.log(JSON.stringify($scope.checkoutCart));
      var extended_url = '/orders/new';
      httpService.postRequest(t2bMobileApi,extended_url,$scope.checkoutCart,{}).then(function(response){
        if(response!=null) {
          var confirmedCart = localStorage.getItem('BOOKING_CART');
          localStorage.removeItem('BOOKING_CART');
          localStorage.removeItem('CHECKOUT_CART');
          $state.go('confirm_order',{bookingCart:confirmedCart});
        }
      });
    }
});
