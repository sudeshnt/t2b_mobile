/**
 * Created by SudeshNT on 1/23/2017.
 */
var t2b_mobile = angular.module('t2b_mobile');

t2b_mobile.controller('loginController', function ($scope,$state,serviceLocator,httpService,$translate,$rootScope) {

  var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;

  $scope.forgotPassword = false;
  $scope.user = {};
  $scope.forgetPasswordRequest = {};

  $scope.doLogin = function (isValid) {
    if (isValid) {
      var extended_url = '/User/login';
      var reqObj = {
        "userName": $scope.user.userName,
        "password": $scope.user.password,
        "channel": "mobile"
      };
      httpService.postRequest(t2bMobileApi, extended_url, reqObj, {}).then(function (response) {
        if (response != null){
          if(response.loginStatus==1){
            localStorage.setItem('loginStatus',true);
            localStorage.setItem('authResponse',JSON.stringify(response.user));
            $state.go('home');
          }else{
            $scope.errorMessage = response.message;
          }
        }
      });
    }
  };

  $scope.requestForgotPassword = function (isValid) {
    if (isValid) {
      var extended_url = '/User/forgotPassword';
      var reqObj = {
        "userName": $scope.forgetPasswordRequest.mobile
      };
      httpService.postRequest(t2bMobileApi, extended_url, reqObj, {}).then(function (response) {
        if (response != null){
          $state.go('confirmOTP',{mobile:$scope.forgetPasswordRequest.mobile});
        }
      });
    }
  };

  $scope.resentOTP = function () {

  };

  $scope.toggleForgotPassword = function () {
    $scope.forgotPassword = !$scope.forgotPassword;
  };

  $scope.goToRegister = function () {
    $state.go('register');
  };

});

t2b_mobile.controller('registerController', function ($scope,serviceLocator,httpService,$state,$translate,$rootScope) {

  $scope.user = {};
  $scope.type = 'password';

  $scope.toggleShowHide = function () {
    $scope.type = $scope.type == 'text' ? 'password' : 'text';
  };

  $scope.createUser = function (isValid) {
    if(isValid){
      var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;
      var extended_url = '/User/new';
      var reqObj = {
        "mobile": $scope.user.phoneNumber,
        "firstName": $scope.user.phoneNumber,
        "password": $scope.user.password,
        "channel": "mobile"
      };
      httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
        if(response!=null) {
          if(response.statusCode==0){
            $state.go('confirmOTP',{mobile:$scope.user.phoneNumber});
          }else{
            $scope.errorMessage = response.message;
          }
        }
      });
    }
  };

});

t2b_mobile.controller('confirmOTPController', function ($scope,$state,serviceLocator,httpService,$stateParams,$cordovaToast,$translate,$rootScope) {
    var t2bMobileApi = serviceLocator.serviceList.t2bMobileApi;
    $scope.verifyOtpReq = {};
    $scope.resetForgotPasswordReq = {};

    $scope.otpVerification = true;
    $scope.resetForgotPassword = false;

    if($stateParams.mobile!=null){
      $scope.mobile = $stateParams.mobile;
    }else{
      $state.go('login');
    }

    $scope.resendOTP = function () {
        var extended_url = '/User/resendOtp';
        var reqObj = {
          "mobile": $scope.mobile
        };
        httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
          if(response!=null) {
            $cordovaToast.showLongBottom('OTP resent').then();
          }
        });
    };

    $scope.verifyOTP = function (isValid) {
      if(isValid){
        var extended_url = '/User/verifyOtp';
        var reqObj = {
          "mobile": $scope.mobile,
          "otp": $scope.verifyOtpReq.otp
        };
        httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
          if(response!=null) {
            if(response.code == 0){
              $scope.resetForgotPassword = true;
              $cordovaToast.showLongBottom('OTP successfully verified').then();
            }else{
              $scope.errorMessage = response.message;
            }
          }
        });
      }
    };

    $scope.resetPassword = function (isValid) {
      if(isValid){
        var extended_url = '/User/resetForgotPassword';
        var reqObj = {
          "mobile": $scope.mobile,
          "otp": $scope.verifyOtpReq.otp,
          "password" : $scope.resetForgotPasswordReq.password
        };
        httpService.postRequest(t2bMobileApi,extended_url,reqObj,{}).then(function(response){
          if(response!=null) {
            if(response.code == 0 && response.isChanged){
               $cordovaToast.showLongBottom(response.message).then();
               $state.go('home');
            }else{
              $scope.errorMessage = response.message;
            }
          }
        });
      }
    };

});

