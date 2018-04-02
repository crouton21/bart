myApp.controller('DrinkController', ['UserService', '$http', '$routeParams', '$location', '$mdDialog', '$mdToast', '$window', function(UserService, $http, $routeParams, $location, $mdDialog, $mdToast, $window) {
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

  self.drinkRecipe = {};
  self.drinkIngredients = [];

  self.glassInputs = [];
  self.iceInputs = [];

  self.editing;

  self.requiredInputsAlert = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Please enter required (*) fields.')
        .ok('OK')
        .targetEvent(ev)
    );
  }

  self.savedToast = function(event) {
    $mdToast.show(
        $mdToast.simple()
        .textContent('DRINK SAVED')
    );
  }

  self.editToast = function(event) {
    $mdToast.show(
        $mdToast.simple()
        .textContent('CHANGES SAVED')
    );
  }

  self.deleteToast = function(event) {
    $mdToast.show(
        $mdToast.simple()
        .textContent('DRINK DELETED')
    );
  }

  self.saveDrink = function(){
    if(self.newIngredient.name){
      self.addIngredient(self.newIngredient);
    }
    if(self.newDrink.ingredients.length == 0 || !self.newDrink.name || !self.newDrink.glass || !self.newDrink.ice){
      self.requiredInputsAlert();
    }
    else {
      $http({
        method: 'POST',
        url: '/drinks',
        data: self.newDrink
      }).then(function(res){
        self.newDrink = { ingredients: [], userId: self.userObject.userId};
        $window.scrollTo(0, 0);
        self.savedToast();
        console.log('newDrink', self.newDrink);
      }).catch(function(error){
        console.log('error on post', error);
      })
    }
  }

  self.editDrink = function(id){
    if (self.drinkIngredients.length == 0 || self.drinkRecipe.recipe_name.length == 0 || self.drinkRecipe.glass_id.length == 0 || self.drinkRecipe.ice_id.length == 0){
      self.requiredInputsAlert();
    }
    else {
      $http({
        method: 'PUT',
        url: '/drinks',
        data: self.drinkRecipe
      }).then(function(res){
        self.getDrinkRecipe(id);
        // $window.scrollTo(0, 0);
        // self.editing = false;
        $location.path('/drinks');
        self.editToast();
      }).catch(function(error){
        console.log('error on post', error);
      })
    }
  }

  self.formatEditedDrink = function(){
    delete self.drinkRecipe.ingredient_name;
    delete self.drinkRecipe.ingredient_quantity;
    delete self.drinkRecipe.ingredient_id;
    if(self.newIngredient.name){
      self.addIngredientEdit(self.newIngredient);
    }
    self.drinkRecipe.ingredients = self.drinkIngredients;
    self.drinkRecipe.glass_id = self.editedRecipe.glass_id;
    self.drinkRecipe.ice_id = self.editedRecipe.ice_id;
    self.editDrink(self.drinkRecipe.recipe_id);
  }

  self.getDrinks = function(){
    $http({
      method: 'GET',
      url: '/drinks'
    }).then(function(res){
      self.drinkDisplay = res.data;
    }).catch(function(error){
      console.log('error on getting drinks', error);
    })
  }

  self.getuser();
  self.getDrinks();

  self.formatIngredients = function(recipe){
    for (ingredient of recipe){
      self.drinkIngredients.push({ name: ingredient.ingredient_name, quantity: ingredient.ingredient_quantity})
    }
  }

  self.getDrinkRecipe = function(id){
    self.drinkRecipe = {};
    self.drinkIngredients = [];
    $http({
      method: 'GET',
      url: `/drinks/recipe/${id}`
    }).then(function(res){
      console.log(res.data);
      self.drinkRecipe = res.data[0];
      self.formatIngredients(res.data);
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
      self.deleteToast();
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

  self.removeIngredient = function(index){
    if(self.newDrink.ingredients.length > 0 ){
      self.newDrink.ingredients.splice(index, 1);
    }
    else if (self.drinkIngredients.length > 0){
      self.drinkIngredients.splice(index, 1);
    }
  }

}]);
