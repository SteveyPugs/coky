app.controller("Shipping", function($scope, $cookies){
	if($cookies.get("User")){
		$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	}
});