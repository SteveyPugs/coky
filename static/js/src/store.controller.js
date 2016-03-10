app.controller("Store", function($scope, $localStorage, $sessionStorage, $rootScope){
	$scope.priceFilter = function (item) {
		if($scope.MinPrice && !$scope.MaxPrice){
			return (item.ProductPrice >= $scope.MinPrice);
		}
		else if(!$scope.MinPrice && $scope.MaxPrice){
			return (item.ProductPrice <= $scope.MaxPrice);
		}
		else if($scope.MinPrice && $scope.MaxPrice){
			return (item.ProductPrice >= $scope.MinPrice && item.ProductPrice <= $scope.MaxPrice);
		}
		else{
			return (item);
		}
	}
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