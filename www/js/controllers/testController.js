var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('testController', function ($scope,$state,$translate,$rootScope,SweetAlert) {
      $scope.title1 = 'Button';
      $scope.title4 = 'Warn';
      $scope.isDisabled = true;

      $scope.googleUrl = 'http://google.com';

  $scope.context = '';


  //sweet alerts
      $scope.basic = function () {
        SweetAlert.swal("Here's a message");
      };
      $scope.withText = function () {
        SweetAlert.swal("Here's a message!", "It's pretty, isn't it?");
      };
      $scope.success = function () {
        SweetAlert.swal("Good job!", "You clicked the button!", "success");
      };
      $scope.warning_with_confirm = function () {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false},
          function(){
            SweetAlert.swal("Booyah!");
          });
      };
      $scope.confirm_with_success = function () {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false },
          function(isConfirm){
            if (isConfirm) {
              SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
            } else {
              SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
          });
      };
      $scope.alert_with_custom_icon = function () {
        SweetAlert.swal({
          title: "Sweet!",
          text: "Here's a custom image.",
          imageUrl: "http:://oitozero.com/avatar/avatar.jpg" });
      }
});
