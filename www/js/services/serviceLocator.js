(function(){

angular.module('t2b_mobile').service('serviceLocator', [serviceLocator]);

  function serviceLocator(){

    var serviceList = {
        t2bMobileApi:{
          serviceId:1,
          serviceName:'touch2but Mobile Api',
          serviceUrl:'http://52.221.14.28',
          port:'8080',
          base_url:'/api'
        },
        t2bMobileApi_new:{
          serviceId:2,
          serviceName:'touch2but Mobile Api New',
          serviceUrl:'http://192.168.1.200',
          port:'8090',
          base_url:'/online-shop'
        }
    };

    var statusList = {
        CREATED : 0,
        PENDING : 1,
        APPROVED : 2,
        CANCELED : 3,
        REVERTED : 4,
        REJECTED : 5,
        SUSPENDED : 6,
        BLACKLISTED : 7
    };

    return {
      serviceList: serviceList, // revealing module pattern to expose the  method as a public method of RequestsService.
      statusList: statusList // revealing module pattern to expose the  method as a public method of RequestsService.
    };
  }
})();
