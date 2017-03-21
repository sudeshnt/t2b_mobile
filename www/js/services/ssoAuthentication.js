
angular.module('ssoAuthentication',['googleplus','facebook','configKeys'])
    .config(['GooglePlusProvider','FacebookProvider','CKey', function(GooglePlusProvider,FacebookProvider,CKey) {
        GooglePlusProvider.init({
            clientId: CKey.SocialNetworksProviderKEY.GooglePlusProvider
        });
        FacebookProvider.init(CKey.SocialNetworksProviderKEY.FacebookProvider);
    }])
    .service('session',function(){
        this.create=function(sessionId,userName,loginType,userObj){
            this.id=sessionId;
            this.userName=userName;
            this.loginType=loginType;
            this.userObject=userObj;
        };
        this.distroy=function(){
            this.id=null;
            this.userName=null;
            this.loginType=null;
            this.userObject=null;
        };
    })
    .factory('ssoAuth',['session','GooglePlus','Facebook','comSrv','$cookieStore',function(session,GooglePlus,Facebook,comSrv,$cookieStore){
        
        return{
            googlePlushAuth:function(next){
                GooglePlus.login().then(function (authResult) {
                    var accessToken=authResult.access_token;
                    GooglePlus.getUser().then(function (user) {
                        // update user info to BackEnd
                        var authUser={
                            "provider":"gplus",
                            "name":user.name,
                            "first_name":user.given_name,
                            "middle_name":'',
                            "last_name":user.family_name,
                            "email":user.email,
                            "token":accessToken,
                            "channel":"web"
                        };
                        comSrv.postCall('/user/OAuthLogin',authUser,function(status,data){
                            if(status==200 ){
                                var timstamp=new Date().getTime();
                                var user = new userObj(data.username,data.email,data.first_name,data.middle_name,data.last_name,data.gender,data.country,'en',data.mobile,data.session_id);
                                session.create(timstamp,user.email,"gplus",user);
                                next(null,user);
                            }
                        });
                    });
                }, function (err) {
                    console.log(err);
                    // localStorage["loginStatus"]=false;
                    next(err,null);
                });
            },
            googlePlusLogOut:function(next){
                session.distroy();
                GooglePlus.logout();
                next();
            },
            facebookLogin:function(next){
                Facebook.login(function(response){
                    if(response.status === 'connected') {
                        Facebook.api('/me',{fields:'name,first_name,middle_name,last_name,email,picture'}, function(user) {
                            // update back end
                            var authUser={
                                "provider":"fb",
                                "name":user.name,
                                "first_name":user.first_name,
                                "middle_name":user.middle_name,
                                "last_name":user.last_name,
                                "email":user.email,
                                "token":response.authResponse.accessToken,
                                "channel":"web"
                            };
                            comSrv.postCall('/user/OAuthLogin',authUser,function(status,data){
                                if(status==200){
                                    var user = new userObj(data._id,data.username,data.email,data.first_name,data.middle_name,data.last_name,data.gender,data.country,'en',data.mobile,data.session_id);
                                    session.create(data._id,data.email,"fb",user);
                                    $cookieStore.put('user',session);
                                    next(null,user);
                                }
                            });
                        });
                    } else {

                    }
                },{
                    scope: 'email,publish_actions',
                    return_scopes: true
                });
            },
            facebookLogOut:function(next){
                Facebook.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        session.distroy();
                        Facebook.logout(function(response){
                            next();
                        });
                    }
                });
            },
            generalLogin:function(username,password,next){
                var loginReq={
                    "username": username,
                    "password": password,
                    "channel": "web"
                };
                comSrv.postCall('/user/login',loginReq,function(status,data){
                    if(status==200){ //console.log(data)
                        var user = new userObj(data._id,data.username,data.email,data.first_name,data.middle_name,data.last_name,data.gender,data.country,'en',data.mobile,data.session_id);
                        session.create(data._id,data.email,"gen",user);
                        $cookieStore.put('user',session);
                        next(status,user,null);
                        /*
                            // Removing a cookie
                            $cookieStore.remove('username');
                            $cookieStore.remove('authToken');
                            $cookieStore.remove('isCorporateUser');
                            // Setting a cookie
                            $cookieStore.put('username',userName);
                            $cookieStore.put('authToken',data.authToken);
                            $cookieStore.put('isCorporateUser',data.user.isCorporateUser);
                            *!/
                        }*/
                    }
                    else{
                        next(status,null,"Invalid username or password");
                    }
                });
            },
            //updateUserSession:function(lastName,firstName,imageUrl,mobile,next){
            //    var usr = new userObj(session.userObject.email,session.userObject.email,lastName,firstName,'en',firstName,imageUrl,mobile);
            //    session.create(session.id,session.userObject.email,session.loginType,usr);
            //    next(1,usr);
            //},
            updateUserFromCookie : function(cookie,next){
                var user = new userObj(cookie.userObject.id,cookie.userObject.username,cookie.userObject.email,cookie.userObject.first_name,cookie.userObject.middle_name,cookie.userObject.last_name,cookie.userObject.gender,cookie.userObject.country,'en',cookie.userObject.mobile,cookie.userObject.session_id);
                session.create(cookie.id,cookie.userObject.email,cookie.loginType,user);
                next(1,user);
            },
            ssoLogin:function(authResponse,next){
                if(authResponse!=undefined){
                    var user = new userObj(authResponse._id,authResponse.username,authResponse.email,authResponse.first_name,authResponse.middle_name,authResponse.last_name,authResponse.gender,authResponse.country,'en',authResponse.mobile,authResponse.session_id);
                    session.create(authResponse._id,authResponse.email,"sso",user);
                    $cookieStore.put('user',session);
                    next(user,null);
                }else{
                    next({},'authResponse is undefined');
                }
            },
            generalLogOut:function(next){
                session.distroy();
                next();
            },
            isAuthenticated : function () {
                return !!session.id;
            },
            getUserLogginType : function () {
                return session.loginType;
            },
            getLoggedInUser:function(){
                return session.userObject;
            }
        }
    }]);

function userObj(id,userName,email,firstName,middleName,lastName,gender,country,language,mobile,session_id){
    this.id = id;
    this.username = userName;
    this.email=email;
    this.first_name=firstName;
    this.middle_name=middleName;
    this.last_name=lastName;
    this.gender=gender;
    this.country=country;
    this.language=language;
    this.mobile=mobile;
    this.session_id=session_id;
}
