// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var t2b_mobile = angular.module('t2b_mobile',
  [
    'ngCordova',
    'ngSanitize',
    'ionic',
    'pascalprecht.translate',
    'lang_en',
    'ngMaterial',
    'oitozero.ngSweetAlert',
    'ion-floating-menu',
    'angular-carousel',
    'tabSlideBox',
    'ngProgress',
    'ngAnimate',
    'bookingCartService'
  ]);

t2b_mobile.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

t2b_mobile.config(function($stateProvider, $urlRouterProvider ,$translateProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/profile/login.html',
      controller: 'loginController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/profile/register.html',
      controller: 'registerController'
    })
    .state('confirmOTP', {
      url: '/confirmOTP',
      templateUrl: 'templates/profile/confirmOTP.html',
      controller: 'confirmOTPController',
      params:{mobile:null}
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeController'
    })
    .state('test', {
      url: '/test',
      templateUrl: 'templates/test.html',
      controller: 'testController'
    })
    .state('restaurant', {
      url: '/restaurant',
      templateUrl: 'templates/restaurant.html',
      controller: 'restaurantController',
      params : {organization : null}
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'templates/checkout.html',
      controller: 'checkoutController'
    })
    .state('delivery_guest', {
      url: '/delivery_guest',
      templateUrl: 'templates/delivery_guest.html',
      controller: 'deliveryGuestController'
    })
    .state('delivery_member', {
      url: '/delivery_member',
      templateUrl: 'templates/delivery_member.html',
      controller: 'deliveryMemberController'
    })
    .state('confirm_order', {
      url: '/confirm_order',
      templateUrl: 'templates/confirm_order.html',
      controller: 'confirmOrderController',
      params : {bookingCart : null}
    })
    .state('order_history', {
      url: '/order_history',
      templateUrl: 'templates/orderHistory.html',
      controller: 'orderHistoryController',
    })
    .state('search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'searchController'
    });
  $urlRouterProvider.otherwise('/home');
  $translateProvider.preferredLanguage("en");
  // $translateProvider.fallbackLanguage("en");
});

t2b_mobile.controller("initialController",function($scope,$state,$rootScope,cartService,$filter, $timeout, ngProgressFactory,$mdBottomSheet){

  $scope.content = $filter('translate')('BACK');
  $scope.progressbar = ngProgressFactory.createInstance();

  $rootScope.$on('$stateChangeStart', function (event,toState,toParams, fromState, fromParams) {
    $scope.progressbar.start();
    if(fromState.name == 'restaurant'){
      $rootScope.cartVisible = false;
    }

    //init loginStatus
    if(localStorage.getItem('loginStatus')==null && localStorage.getItem('loginStatus')==''){
      localStorage.setItem('loginStatus',false);
    }else if(JSON.parse(localStorage.getItem('loginStatus'))==true){
      if(localStorage.getItem('authResponse')!=null && localStorage.getItem('authResponse')!=''){
        if(JSON.parse(localStorage.getItem('authResponse')).email != undefined || JSON.parse(localStorage.getItem('authResponse')).mobile != undefined){
          $scope.loginStatus = true;
          $scope.authUser = JSON.parse(localStorage.getItem('authResponse'));
        }else{
          localStorage.setItem('loginStatus',false);
        }
      }
    }else if(JSON.parse(localStorage.getItem('loginStatus'))!=true){
      $scope.loginStatus = false;
    }

  });

  $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        $scope.progressbar.complete()
  });

  $rootScope.$watch('cart',function () {
    if($rootScope.cart!=undefined){
      cartService.CART.addCartObject($rootScope.cart);
    }
  },true);

  $scope.clearCart = function () {
    $rootScope.cart.orders = [];
    delete $rootScope.cart.totalAmount;
    $rootScope.$emit("resetCartItemQty");
  };

  $scope.checkout = function () {
    $mdBottomSheet.hide();
    $state.go('checkout');
  };

  $scope.getTotal = function(){
    var total = 0;
    for(var i = 0; i < $rootScope.cart.orders.length; i++){
      var product = $rootScope.cart.orders[i];
      total += (product.selectedSize.finalPrice * product.selectedSize.qty);
    }
    return total;
  };

  $scope.showListBottomSheet = function() {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'templates/bottomSheetList.html',
      controller: 'ListBottomSheetCtrl'
    }).then(function(clickedItem) {
      // $scope.alert = clickedItem['name'] + ' clicked!';
    });
  };

  $scope.toggleRight = buildToggler('right');

  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  };

  $scope.closeCart = function () {
    $mdBottomSheet.hide();
  }
});

t2b_mobile.directive('customHeader', function($ionicHistory,$state) {
  return {
    restrict: 'AE',
    scope: {
      back:'=',
    },
    link: function (scope, elem, attrs) {
      scope.myGoBack = function () {
        if(scope.back){
          $state.go(scope.back);
        }else{
          $ionicHistory.goBack();
        }
      }
    },
    template: ''
  };
});

t2b_mobile.directive('compareTo',[function(){
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
}]);

// This service keeps track of pending requests
t2b_mobile.service('pendingRequests', function() {
  var pending = [];
  this.get = function() {
    return pending;
  };
  this.add = function(request) {
    pending.push(request);
  };
  this.remove = function(request) {
    pending = _.filter(pending, function(p) {
      return p.url !== request;
    });
  };
  this.cancelAll = function() {
    angular.forEach(pending, function(p) {
      p.canceller.resolve();
    });
    pending.length = 0;
  };
});
//header shrink with scroll
t2b_mobile.directive('headerShrink', function($document,$sce,$rootScope) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {

    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      $scope.margin_top = 'thick-header';
      var headerContentString = '<div style="position: absolute; left: 5px;">'+
        '<a class="button button-icon row"  ng-click="myGoBack()">'+
        '<i class="ion-navicon" style="font-size: 30px;"></i>'+
        '</a>'+
        '</div>'+
        '<h3 class="side-margin-auto">Touch2Buy</h3>'+
        '<div style="position: absolute; right: 5px;">'+
        '<a class="button button-icon row"  ng-click="myGoBack()">'+
        '<i class="ion-ios-search-strong" style="font-size: 30px;"></i>'+
        '</a>'+
        '</div>';
      $rootScope.headerContent = $sce.trustAsHtml(headerContentString);

      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(38, (starty + headerHeight) - scrollTop);
          $scope.margin_top = 'thin-header';
          var headerContentString =  '<div id="search" class="full-width" style="margin-top: 22px !important;">'+
          '<input name="q" type="text" size="40" placeholder="Search..." />'+
          '</div>';
          $rootScope.headerContent = $sce.trustAsHtml(headerContentString);
          $scope.$apply();
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          $scope.margin_top = 'thick-header';
          var headerContentString = '<div style="position: absolute; left: 5px;">'+
            '<a class="button button-icon row"  ng-click="myGoBack()">'+
            '<i class="ion-navicon" style="font-size: 30px;"></i>'+
            '</a>'+
            '</div>'+
            '<h3 class="side-margin-auto">Touch2Buy</h3>'+
            '<div style="position: absolute; right: 5px;">'+
            '<a class="button button-icon row"  ng-click="myGoBack()">'+
            '<i class="ion-ios-search-strong" style="font-size: 30px;"></i>'+
            '</a>'+
            '</div>';
          $rootScope.headerContent = $sce.trustAsHtml(headerContentString);
          $scope.$apply();
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
});

//header shrink of restaurant
t2b_mobile.directive('restaurantHeaderShrink', function($document,$rootScope,$sce) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt = 0;

      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      $scope.margin_top = 'thick-header';
      $rootScope.headerText = 'Touch2Buy';
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        $scope.scrollTop = scrollTop;
        $scope.$apply();

        if(scrollTop>170 && scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(40, (starty + headerHeight) - scrollTop);
          $scope.margin_top = 'thin-header';
          $rootScope.headerText = 'Green Foods';
          // $scope.$apply();
          // shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          $scope.margin_top = 'thick-header';
          $rootScope.headerText = 'Touch2Buy';
          // $scope.$apply();
          // shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
});
