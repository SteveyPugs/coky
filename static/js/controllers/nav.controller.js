app.controller("Nav", function($scope, $localStorage, $sessionStorage, $location, $http, $cookies){
	$scope.$storage = $localStorage.$default({
    	cartCount: 0,
    	cartItems: {}
	});
	if($location.$$hash === "complete") $("#CompleteModal").modal("show");
	if($location.$$hash === "confirm") $("#ConfirmModal").modal("show");
	if($location.$$hash === "noconfirm") $("#NoConfirmModal").modal("show");
	if($cookies.get("User")){
		$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	}
	$scope.login = function(){
		$http.post("/login",{
			UserEmail: $scope.UserEmail,
			UserPassword: $scope.UserPassword,
		}).success(function(data){
			if(data){
				window.location.reload();
			}
			else{
				$("#BadLogin").removeClass("hide");
			}
		}).error(function(err){
			console.log(err);
		});
	};
});