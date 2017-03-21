var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('homeController', function ($scope,$state,$mdBottomSheet,$mdSidenav, $log,serviceLocator,httpService,$ionicHistory,$sce,$translate,$rootScope) {
  var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;

  $scope.restaurants = [];
  $scope.searchEnabled = false;
  initRestaurants();

  function initRestaurants() {
    var extended_url = '/organization/getAll';
    httpService.postRequest(t2bMobileApi,extended_url,{},{}).then(function(response){
      if(response!=null) {
        for(var i=0 ; i<response.length ; i++){
          response[i].status = 'open';
          response[i].imageUrl = 'img/food_slider/'+Math.floor(Math.random() * (4 - 1) + 1)+'.jpg';
          response[i].description = 'L’artiste Feridun Akgüngö';
          response[i].rating = Math.floor(Math.random() * (5 - 1) + 1);
          response[i].shareUrl = 'http://touch2buydev.xyz/profileView/90';
          if($scope.restaurants[Math.floor(i/2)] == undefined){
            $scope.restaurants[Math.floor(i/2)] = [];
          }
          $scope.restaurants[Math.floor(i/2)].push(response[i]);
        }
        // console.log($scope.restaurants);
      }
    });
    // $scope.restaurants = [
    //   [
    //     {
    //       restaurantId:1,
    //       restaurantName : 'Green Apple',
    //       status : 'open',
    //       imageUrl : 'img/food_slider/1.jpg',
    //       description : 'L’artiste Feridun Akgüngö',
    //       rating : 4,
    //       shareUrl : 'http://touch2buydev.xyz/profileView/90'
    //     },
    //     {
    //       restaurantId:2,
    //       restaurantName : 'Royal Burgers',
    //       status : 'open',
    //       imageUrl : 'img/food_slider/2.jpg',
    //       description : 'L’artiste Feridun Akgüngö',
    //       rating : 3,
    //       shareUrl : 'http://touch2buydev.xyz/profileView/88'
    //     }
    //   ],
    //   [
    //     {
    //       restaurantId:3,
    //       restaurantName : 'Green Foods',
    //       status : 'open',
    //       imageUrl : 'img/food_slider/3.jpg',
    //       description : 'L’artiste Feridun Akgüngö',
    //       rating : 4,
    //       shareUrl : 'http://touch2buydev.xyz/profileView/35'
    //     },
    //     {
    //       restaurantId:4,
    //       restaurantName : 'Yaal Rest',
    //       status : 'close',
    //       imageUrl : 'img/food_slider/4.jpg',
    //       description : 'L’artiste Feridun Akgüngö',
    //       rating : 2,
    //       shareUrl : 'http://touch2buydev.xyz/profileView/90'
    //     }
    //   ]
    // ];
  };

  // $scope.slideHasChanged = function($index){
  //   console.log($index);
  // };

  $scope.goToRestaurant = function (selectedOrganization) {
    var extended_url = '/organization/getOrganizationDetails';
    var reqObj = {
      "orgId": selectedOrganization.orgId,
      "lang": "en"
    };
    httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
      if(response!=null) {
        localStorage.setItem('lastVisitedOrg',JSON.stringify(response));
        $state.go('restaurant',{organization:response});
      }
    });
  };

  $scope.goToRegistration = function () {
    $state.go('register');
  };

  $scope.goToOrderHistory = function () {
    $state.go('order_history');
  };

  $scope.goToLogin = function () {
    $ionicHistory.clearCache().then(function(){ $state.go('login') })
  };

  $scope.logOut = function () {
    localStorage.setItem('loginStatus',false);
    localStorage.setItem('authResponse','');
    $scope.loginStatus = false;
    $scope.authUser = {};
    $mdSidenav('right').close();
  };

  $scope.toggleSearch = function () {
    $scope.searchEnabled = $scope.searchEnabled ? false : true;
  };

  // $scope.showListBottomSheet = function() {
  //   $scope.alert = '';
  //   $mdBottomSheet.show({
  //     templateUrl: 'templates/bottomSheetList.html',
  //     controller: 'ListBottomSheetCtrl'
  //   }).then(function(clickedItem) {
  //     $scope.alert = clickedItem['name'] + ' clicked!';
  //   });
  // };
  $scope.toggleSideBar = buildToggler('right');

  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };

  var originatorEv;
  $scope.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  }
});

t2b_mobile.controller('orderHistoryController', function($scope,$state,serviceLocator,httpService) {
    var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;
    var offset = 0;
    var limit = 0;
    var shops = {};

    initShops();

    function initShops(){
      var extended_url = '/organization/getAll';
      httpService.postRequest(t2bMobileApi,extended_url,{},{}).then(function(response){
        if(response!=null) {
          for(var i=0;i<response.length;i++){
            shops[response[i].orgId] = response[i];
          }
          initOrderHistory();
        }
      });
    }

    function initOrderHistory() {
      var extended_url = '/orders/orderList';
      var reqObj = {
        "userName": $scope.authUser.email!=undefined ? $scope.authUser.email : $scope.authUser.mobile,
        "offset": offset,
        "limit": limit
      };
      httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
        if(response!=null) {
          for(var i=0;i<response.data.length;i++){
            response.data[i].organization = shops[response.data[i].organizationId];
          }
         $scope.orderHistory = response.data;
         console.log($scope.orderHistory);
        }
      });
    }

});

t2b_mobile.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {

  $scope.items = [
    { name: 'Share', icon: 'share-arrow' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});


