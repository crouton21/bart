myApp.controller('LoginController', ['$http', '$location', 'UserService', '$mdToast', '$mdDialog', function($http, $location, UserService, $mdToast, $mdDialog) {
    console.log('LoginController created');
    var self = this;
    self.user = {
      username: '',
      password: ''
    };
    self.message = '';

    self.login = function (ev) {
      if (self.user.username === '' || self.user.password === '') {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please enter your username and password.')
            .ok('OK')
            .targetEvent(ev)
        );
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
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('Incorrect credentials. Please try again.')
                  .ok('OK')
                  .targetEvent(ev)
              );
            }
          },
          function (response) {
            console.log('failure error: ', response);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Incorrect credentials. Please try again.')
                .ok('OK')
                .targetEvent(ev)
            );
          });
      }
    };

    self.registerUser = function (ev) {
      if (self.user.username === '' || self.user.password === '') {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please choose a username and password.')
            .ok('OK')
            .targetEvent(ev)
        );
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/register', self.user).then(function (response) {
          console.log('success');
          $location.path('/home');
        },
          function (response) {
            console.log('error');
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Something went wrong. Please try again.')
                .ok('OK')
                .targetEvent(ev)
            );
          });
      }
    }
}]);
