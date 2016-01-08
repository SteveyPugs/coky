app.controller("Store", function($scope, $localStorage, $sessionStorage, $rootScope){
	$scope.addToCart = function(product){
		if($localStorage.cartCount){
			$localStorage.cartCount = $localStorage.cartCount + 1;
		}
		else{
			$localStorage.cartCount = 1;
		}
		if($localStorage.cartItems){
			if($localStorage.cartItems.hasOwnProperty(product.ProductID)){
				$localStorage.cartItems[product.ProductID]["count"] = $localStorage.cartItems[product.ProductID]["count"] + 1; 
			}
			else{
				$localStorage.cartItems[product.ProductID] = {
					count: 1,
				};
			}
		}
		else{
			$localStorage.cartItems = {};
		}
	};
});