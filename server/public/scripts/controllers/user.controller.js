myApp.controller('UserController', ['UserService', function(UserService) {

  const self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;
  
}]);
