myApp.controller('LoginController', ['$http', '$location', 'UserService', '$mdToast', function($http, $location, UserService, $mdToast) {
    console.log('LoginController created');
    var self = this;
    self.user = {
      username: '',
      password: ''
    };
    self.message = '';

    self.login = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      } else {
        // console.log('sending to server...', self.user);
        $http.post('/api/user/login', self.user).then(
          function (response) {
            if (response.status == 200) {
              // console.log('success: ', response.data);
              // location works with SPA (ng-route)
              $location.path('/drinks');
              self.loginToast = function(event) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(`CHEERS, ${self.user.username.toUpperCase()}!`)
                );
              }
              self.loginToast();
            } else {
              console.log('failure error: ', response);
              self.message = "Incorrect credentials. Please try again.";
            }
          },
          function (response) {
            console.log('failure error: ', response);
            self.message = "Incorrect credentials. Please try again.";
          });
      }
    };

    self.registerUser = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/register', self.user).then(function (response) {
          console.log('success');
          $location.path('/home');
        },
          function (response) {
            console.log('error');
            self.message = "Something went wrong. Please try again."
          });
      }
    }
}]);
