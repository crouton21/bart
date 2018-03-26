myApp.controller('DrinkController', ['UserService', '$http', '$routeParams', '$location', '$mdDialog', '$mdToast', function(UserService, $http, $routeParams, $location, $mdDialog, $mdToast) {
  const self = this;
  
  self.userService = UserService;
  self.getuser = UserService.getuser;
  self.userObject = UserService.userObject;
  
  self.newDrink = { ingredients: [], userId: self.userObject.userId}
  
  self.newIngredient = {};

  self.addIngredient = function(newIngredient){
    self.newDrink.ingredients.push(newIngredient);
    self.newIngredient = {};
  }

  self.addIngredientEdit = function(newIngredient){
    self.drinkIngredients.push(newIngredient);
    self.newIngredient = {};
  }

  self.drinkDisplay = [];

  self.drinkRecipe = [];
  self.drinkIngredients = [];

  self.glassInputs = [];
  self.iceInputs = [];

  self.saveDrink = function(){
    if(self.newIngredient.name){
      self.addIngredient(self.newIngredient);
    }
    if(self.newDrink.ingredients.length > 0 ){
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
    else{
      alert('Please add ingredients');
    }
  }

  self.editDrink = function(){
    console.log(self.drinkRecipe);
    // if(self.drinkIngredients.length > 0 ){
    //   $http({
    //     method: 'PUT',
    //     url: '/drinks',
    //     data: self.drinkRecipe
    //   }).then(function(res){
    //     self.drinkRecipe = [];
    //   }).catch(function(error){
    //     console.log('error on post', error);
    //   })
    // }
    // else{
    //   alert('Please add ingredients');
    // }
  }

  self.formatEditedDrink = function(){
    delete self.drinkRecipe.ingredient_name;
    delete self.drinkRecipe.ingredient_quantity;
    delete self.drinkRecipe.ingredient_id;
    if(self.newIngredient.name){
      self.addIngredientEdit(self.newIngredient);
    }
    self.drinkRecipe.ingredients = self.drinkIngredients;
    self.editDrink();
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

  self.getuser();
  self.getDrinks(self.userObject.userId);

  self.formatIngredients = function(recipe){
    for (ingredient of recipe){
      self.drinkIngredients.push({ name: ingredient.ingredient_name, quantity: ingredient.ingredient_quantity})
    }
  }

  self.getDrinkRecipe = function(id){
    self.drinkRecipe = [];
    self.drinkIngredients = [];
    $http({
      method: 'GET',
      url: `/drinks/recipe/${id}`
    }).then(function(res){
      self.drinkRecipe = res.data[0];
      self.formatIngredients(res.data);
      console.log(res.data);
    }).catch(function(error){
      console.log('error on getting drinks', error);
    })
  }

  if($routeParams.id) {
    self.getDrinkRecipe($routeParams.id);
  };

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

  self.deleteDrink = function(id){
    $http({
      method: 'DELETE',
      url: `/drinks/${id}`
    }).then(function(res){
      self.getDrinks();
      $location.path('/drinks');
    }).catch(function(error){
      console.log('error deleting drink', error);
    })
  }

  self.confirmDelete = function(id, ev) {
    let confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this drink?')
          .targetEvent(ev)
          .ok('DELETE')
          .cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      self.deleteDrink(id);
    }, function() {
      console.log('not deleted');
    });
  };

  self.removeIngredient = function(ingredient){
    if(self.newDrink.ingredients.length > 0 ){
      self.newDrink.ingredients.splice(self.newDrink.ingredients.indexOf(ingredient));
    }
    else if (self.drinkIngredients.length > 0){
      self.drinkIngredients.splice(self.drinkIngredients.indexOf(ingredient));
    }
  }

}]);
