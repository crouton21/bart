myApp.service('DrinkService', ['$http', '$location', function($http, $location){

    const self = this;
     
    self.drinkDisplay = {recipes: []};

    self.getDrinks = function(id){
        $http({
          method: 'GET',
          url: `/drinks/${id}`
        }).then(function(res){
          self.drinkDisplay.recipes = res.data;
        }).catch(function(error){
          console.log('error on getting drinks', error);
        })
    }

}]);