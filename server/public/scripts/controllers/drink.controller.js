myApp.controller('DrinkController', ['UserService', '$http', function(UserService, $http) {
  const self = this;
  
  self.userService = UserService;
  self.userObject = UserService.userObject;

  self.newDrink = { ingredients: [], userId: self.userObject.userId}
  
  self.newIngredient = {};

  self.addIngredient = function(newIngredient){
    self.newDrink.ingredients.push(newIngredient);
    self.newIngredient = {};
  }

  self.glassInputs = [];
  self.iceInputs = [];

  self.saveDrink = function(){
    console.log(self.newDrink);
    $http({
      method: 'POST',
      url: '/drinks',
      data: self.newDrink
    }).then(function(res){
      self.newDrink = { ingredients: [], userId: self.userObject.userId};
      console.log('newDrink', self.newDrink);
    }).catch(function(error){
      console.log('error on post', error);
    })
  }

  self.getInputs = function(){
    $http({
      method: 'GET',
      url: '/drinks/inputs'
    }).then(function(res){
      self.glassInputs = res.data[0].rows;
      self.iceInputs = res.data[1].rows;
      console.log(self.glassInputs);
      console.log(self.iceInputs);
      
    }).catch(function(error){
      console.log('error on getting inputs', error);
    })
  }

  self.getInputs();

}]);
