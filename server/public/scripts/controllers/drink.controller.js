myApp.controller('DrinkController', ['UserService', '$http', function(UserService, $http) {
  const self = this;
  
  self.userService = UserService;
  self.userObject = UserService.userObject;

  self.newDrink = { ingredients: [], username: self.userObject.userName}
  
  self.newIngredient = {};

  self.addIngredient = function(newIngredient){
    self.newDrink.ingredients.push(newIngredient);
    self.newIngredient = {};
  }

  self.saveDrink = function(){
    console.log(self.newDrink);
    $http({
      method: 'POST',
      url: '/drinks',
      data: self.newDrink
    }).then(function(res){
      self.newDrink = { ingredients: [], username: self.userObject.userName};
      console.log('newDrink', self.newDrink);
    }).catch(function(error){
      console.log('error on post', error);
    })
  }

}]);
