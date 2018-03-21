myApp.controller('DrinkController', ['UserService', '$http', '$routeParams', function(UserService, $http, $routeParams) {
  const self = this;
  
  self.userService = UserService;
  self.userObject = UserService.userObject;

  self.newDrink = { ingredients: [], userId: self.userObject.userId}
  
  self.newIngredient = {};

  self.addIngredient = function(newIngredient){
    self.newDrink.ingredients.push(newIngredient);
    self.newIngredient = {};
  }

  self.drinkDisplay = [];

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

  self.getDrinks = function(id){
    $http({
      method: 'GET',
      url: `/drinks/${id}`
    }).then(function(res){
      self.drinkDisplay = res.data;
    }).catch(function(error){
      console.log('error on getting drinks', error);
    })
  }

  self.getDrinks(self.userObject.userId);

  self.getInputs = function(){
    $http({
      method: 'GET',
      url: '/drinks/inputs'
    }).then(function(res){
      self.glassInputs = res.data[0].rows;
      self.iceInputs = res.data[1].rows;
    }).catch(function(error){
      console.log('error on getting inputs', error);
    })
  }

  self.getInputs();

}]);
