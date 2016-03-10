app.controller("Cart", function($scope, $localStorage, $sessionStorage, $http, $cookies){
	if($cookies.get("User")){
		$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	}
	$http.get("/api/product").success(function(data){
		for(var item in data){
			for(var key in data[item]){
				if(key === "Category"){
					data[item]["CategoryName"] = data[item][key].CategoryName;
					delete data[item]["Category"];
				}
			}
		}
		$scope.products = data;
		$scope.cart = $localStorage.cartItems;
		$scope.getProduct = function(id){
			var product = _.find($scope.products, function(i){			
				if(id == i.ProductID) return true;
			});
			return product;
		};
		$scope.isEmpty = function (obj) {
			return angular.equals({},obj); 
		};
		$scope.getTotal = function(){
			$scope.total = 0;
			for(var item in $scope.cart){
				var product = $scope.getProduct(item);
				$scope.total = $scope.total + product.ProductPrice * $scope.cart[item].count;
			}
		};
		$scope.removeFromCart = function(product){
			if($localStorage.cartCount !== 0){
				$localStorage.cartCount = $localStorage.cartCount - $localStorage.cartItems[product.ProductID].count;	
			}
			if($localStorage.cartItems.hasOwnProperty(product.ProductID)){
				delete $localStorage.cartItems[product.ProductID];
			}
			$scope.getTotal();
		};
		$scope.getTotal();
	}).error(function(err){
		console.log(err);
	});
});