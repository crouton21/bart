myApp.service('UserService', ['$http', '$location', '$mdDialog', function($http, $location, $mdDialog){

 const self = this;
  self.userObject = {};

  self.getuser = function(){

    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            self.userObject.userId = response.data.id;
            
            // console.log('UserService -- getuser -- User Data: ', self.userObject);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  },

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  },

  self.confirmLogout = function(ev) {
    let confirm = $mdDialog.confirm()
          .title('Are you sure you want to log out?')
          .targetEvent(ev)
          .ok('LOGOUT')
          .cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      self.logout();
    }, function() {
      console.log('cancel logout');
    });
  };

}]);
