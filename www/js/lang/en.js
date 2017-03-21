/**
 * Created by SudeshNT on 11/4/2016.
 */
angular.module('lang_en',['pascalprecht.translate','ngSanitize'])
.config(['$translateProvider',function($translateProvider){
  $translateProvider.translations('en', {
    BACK:'Back'
  });
  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("en");
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
}]);
