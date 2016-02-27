app.controller("Shipping", function($scope, $cookies,$localStorage){
	if($localStorage.cartCount === 0){
		window.location.href = "/store/cart";
	}
	if($cookies.get("User")){
		$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	}
});