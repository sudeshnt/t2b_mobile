var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('restaurantController', function ($scope,$state,$translate,$rootScope,$stateParams,cartService,serviceLocator,httpService) {
  var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;

  var resetCartItemQty = $rootScope.$on("resetCartItemQty", function(){
    $scope.resetCartItemQty();
  });

  $rootScope.cartVisible = true;

  $scope.cart = cartService;
  $scope.restaurant = {};
  $scope.foodItems = [];

  var offset = 0;
  var limit = 10;

  init();

  function init() {
    $scope.activeTab = 0;
    initRestaurant();
    initCart();
    initFoodItems('all');
  }

  function initRestaurant (){
    if($stateParams.organization!=null){
      $scope.restaurant = $stateParams.organization;
    }else if(localStorage.getItem('lastVisitedOrg')!=undefined){
      $scope.restaurant = JSON.parse(localStorage.getItem('lastVisitedOrg'));
    }else{
      $state.go('home');
    }
    // init Main Branch
    var extended_url = '/organization/branches';
    var reqObj = {
      "organizationId": $scope.restaurant.orgId
    };
    httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
      $scope.restaurant.mainBranch = response[0];
      $scope.restaurant.organizationRating = 3;
      $scope.restaurant.categories = [];
      initCategories($scope.restaurant.orgId);
    });
  };

  function initCategories(orgId){
    var extended_url = '/organization/publishedCategories';
    var reqObj = {
      "orgId": orgId,
      "offset": 0,
      "limit": 0
    };
    httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
      if(response!=null) {
        // console.log(response);
        $scope.restaurant.categories.push({
          branchId: 0,
          categoryId: 0,
          categoryName: "All",
          description: "All",
          imageUrl: "https://s3-ap-southeast-1.amazonaws.com/horanaapi/mobile_test/LUNCH.jpg",
          organizationId: orgId
        });
        angular.forEach(response.data,function (category) {
          if(category.itemCount>0){
            $scope.restaurant.categories.push(category);
          }
        });
        $scope.selectedCategory = 'all';
      }
    });
  };

  function initCart(){
     // console.log($scope.cart);
     if($scope.cart.CART.cartObject!=null){
       // console.log($scope.cart.CART.cartObject.organizationId,$scope.restaurant.orgId);
       if($scope.cart.CART.cartObject.organizationId==$scope.restaurant.orgId){
         $rootScope.cart = $scope.cart.CART.cartObject;
       }else{
         $rootScope.cart = {
           organizationId : $scope.restaurant.orgId,
           branchId : $scope.restaurant.mainBranchId,
           channel:'android',
           organizationName : $scope.restaurant.orgName,
           orders : [

           ]
         };
       }
     }else{
       $rootScope.cart = {
         organizationId : $scope.restaurant.orgId,
         branchId : $scope.restaurant.mainBranchId,
         channel:'android',
         organizationName : $scope.restaurant.orgName,
         orders : [

         ]
       };
     }
  }

  function initFoodItems(category){
     // switch(category){
     //   case 'all':
     //     $scope.foodItems = [
     //       {
     //         itemId : 1,
     //         itemName : 'Chilly Chicken',
     //         imageUrl : 'img/food_items/1.jpeg',
     //         description : 'Prevent food spoilage...',
     //         category:'non-veg',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:100
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:150
     //           }
     //         ]
     //       },{
     //         itemId : 2,
     //         itemName : 'Chicken Burger',
     //         imageUrl : 'img/food_items/2.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'non-veg',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:50
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:80
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:150
     //           }
     //         ]
     //       },{
     //         itemId : 3,
     //         itemName : 'Potato Chips',
     //         imageUrl : 'img/food_items/3.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'veg',
     //         sizes : [
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:150
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:250
     //           }
     //         ]
     //       },{
     //         itemId : 4,
     //         itemName : 'BBQ Pizza',
     //         imageUrl : 'img/food_items/4.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'pizza',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:200
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:250
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:350
     //           }
     //         ]
     //       },{
     //         itemId : 5,
     //         itemName : 'Egg Bun',
     //         imageUrl : 'img/food_items/5.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'breakfast',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:30
     //           }
     //         ]
     //       },{
     //         itemId : 6,
     //         itemName : 'Sea Food Burger',
     //         imageUrl : 'img/food_items/6.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'sea-food',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:70
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:100
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:150
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'non-veg':
     //     $scope.foodItems = [
     //       {
     //         itemId : 1,
     //         itemName : 'Chilly Chicken',
     //         imageUrl : 'img/food_items/1.jpeg',
     //         description : 'Prevent food spoilage...',
     //         category:'non-veg',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:100
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:150
     //           }
     //         ]
     //       },{
     //         itemId : 2,
     //         itemName : 'Chicken Burger',
     //         imageUrl : 'img/food_items/2.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'non-veg',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:50
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:75
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:100
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'veg':
     //     $scope.foodItems = [
     //       {
     //         itemId : 3,
     //         itemName : 'Potato Chips',
     //         imageUrl : 'img/food_items/3.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'veg',
     //         sizes : [
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:150
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:175
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'pizza':
     //     $scope.foodItems = [
     //       {
     //         itemId : 4,
     //         itemName : 'BBQ Pizza',
     //         imageUrl : 'img/food_items/4.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'pizza',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:200
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:225
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:275
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'burger':
     //     $scope.foodItems = [
     //       {
     //         itemId : 2,
     //         itemName : 'Chicken Burger',
     //         imageUrl : 'img/food_items/2.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'non-veg',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:50
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:100
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:150
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'sea-food':
     //     $scope.foodItems = [
     //       {
     //         itemId : 6,
     //         itemName : 'Sea Food Burger',
     //         imageUrl : 'img/food_items/6.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'sea-food',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:70
     //           },
     //           {
     //             sizeId:2,
     //             text:'medium',
     //             qty:0,
     //             unitPrice:100
     //           },
     //           {
     //             sizeId:3,
     //             text:'large',
     //             qty:0,
     //             unitPrice:130
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   case 'breakfast':
     //     $scope.foodItems = [
     //       {
     //         itemId : 5,
     //         itemName : 'Egg Bun',
     //         imageUrl : 'img/food_items/5.jpg',
     //         description : 'Prevent food spoilage...',
     //         category:'breakfast',
     //         sizes : [
     //           {
     //             sizeId:1,
     //             text:'small',
     //             qty:0,
     //             unitPrice:30
     //           }
     //         ]
     //       }
     //     ];
     //     break;
     //   default :
     //     $scope.foodItems = [];
     //     break;
     // }
    $scope.foodItems = [];
    loadFoods(category,function (response) {
      $scope.foodItems = response;
    });
  };

  function loadFoods(category,next){
    $scope.noMoreItemsAvailable = true;
    var extended_url;
    var reqObj;
    switch(category){
      case 'all':
        extended_url = '/organization/items';
        reqObj = {
          "organizationId": $scope.restaurant.orgId,
          "offset": offset,
          "limit": limit
        };
        break;
      default:
        extended_url = '/organization/publishedcategories/items';
        reqObj = {
          "orgId": $scope.restaurant.orgId,
          "catId": category.categoryId,
          "offset": offset,
          "limit": limit
        };
        break;
    }
    httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
      if(response!=null) {
        if(response.length>0){
          if($rootScope.cart.orders.length>0){
            for(var i=0 ; i<response.length ; i++){
              for(var j=0 ; j<$rootScope.cart.orders.length ; j++ ){
                if(response[i].itemId==$rootScope.cart.orders[j].itemId){
                   response[i].selectedSize = angular.copy($rootScope.cart.orders[j].selectedSize);
                   for(var k=0;k<response[i].products.length;k++){
                     if(response[i].selectedSize.foodProductId==response[i].products[k].foodProductId){
                       response[i].selectedIndex = k;
                       response[i].products[k].qty = $rootScope.cart.orders[j].selectedSize.qty;
                     }
                   };
                }
              }
            }
          }
          if(response.length==limit){
            offset+=limit;
            $scope.noMoreItemsAvailable = false;
          } else{
            response[response.length-1].class = 'item-card-last-child';
          }
          if(next!=undefined){
            next(response);
          }
        }else{
          $scope.noMoreItemClass = 'padding-bottom-zero-items'
        }
      }
    });
  }

  $scope.onSlideMove = function(data){
    $scope.activeTab = data.index;
    offset = 0;
    limit = 5;
    // switch(data.index){
    //   case 0:
    //     initFoodItems('all');
    //     break;
    //   case 1:
    //     initFoodItems('non-veg');
    //     break;
    //   case 2:
    //     initFoodItems('veg');
    //     break;
    //   case 3:
    //     initFoodItems('pizza');
    //     break;
    //   case 4:
    //     initFoodItems('burger');
    //     break;
    //   case 5:
    //     initFoodItems('sea-food');
    //     break;
    //  case 5:
    //     initFoodItems('breakfast');
    //     break;
    //   default :
    //     initFoodItems('');
    //     break;
    // }
    if(data.index == 0){
      $scope.selectedCategory = 'all';
      initFoodItems('all');
    }else{
      $scope.selectedCategory = $scope.restaurant.categories[data.index];
      initFoodItems($scope.restaurant.categories[data.index]);
    }
  };

  $scope.loadMore = function () {
    // console.log(offset,limit);
    loadFoods($scope.selectedCategory,function (response) {
      angular.forEach(response,function (foodItem) {
        $scope.foodItems.push(foodItem);
      });
    });
  };

  $scope.resetCartItemQty = function () {
    console.log("I'm remote");
    angular.forEach($scope.foodItems,function(foodItem){
      for(var i=0;i< foodItem.products.length;i++) {
        foodItem.products[i].qty = 0;
      }
      foodItem.selectedSize =  foodItem.products[0];
    });
  };

  $scope.subQty = function (item) {
    if(item.selectedSize.qty>0){
      item.selectedSize.qty--;
      angular.forEach($rootScope.cart.orders, function(obj,iterator) {
        if(obj.itemId == item.itemId && obj.selectedSize.sizeId == item.selectedSize.sizeId){
          obj.selectedSize.qty--;
          if(obj.selectedSize.qty==0){
              $rootScope.cart.orders.splice(iterator, 1);
          }
        }
      });
      // console.log($rootScope.cart);
    }
  };

  $scope.addQty = function (item) {
    item.selectedSize.qty++;
    if($rootScope.cart.orders.length>0){
      var itemAvailable = false;
      angular.forEach($rootScope.cart.orders, function(obj) {
        // console.log(obj.itemId == item.itemId);
        // console.log(obj.selectedSize.sizeId == item.selectedSize.sizeId);
        if(obj.itemId == item.itemId && obj.selectedSize.sizeId == item.selectedSize.sizeId){
          obj.selectedSize.qty++;
          itemAvailable = true;
        }
      });
      if(!itemAvailable){
        $rootScope.cart.orders.push(angular.copy(item));
      }
    }else {
      $rootScope.cart.orders.push(angular.copy(item));
    }
     // console.log($rootScope.cart);
  };

  var originatorEv;

  $scope.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
  $scope.checkout = function () {
    $state.go('checkout');
  };

  $scope.goToHome = function () {
    $state.go('home');
  };

  $scope.isCartSeen = false;
  $scope.$on('floating-menu:open', function(){
    $scope.isCartSeen = true;
  });
  $scope.$on('floating-menu:close', function(){
    $scope.isCartSeen = false;
  });

});
