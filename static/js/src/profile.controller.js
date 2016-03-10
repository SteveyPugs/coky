app.controller("Profile", function($scope, $sessionStorage, $http, $cookies){
	$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	$http.get("/api/address/" + $scope.account.UserID).success(function(addresses){
		$scope.addresses = addresses;
	}).error(function(err){
		console.log(err);
	});
	$scope.setDefault = function(id){
		$http.post("/api/address", {
			UserID: $scope.account.UserID,
			UserAddressID: id
		}).success(function(data){
			_.filter($scope.addresses, function(a){
				if(a.UserAddressID !== id){
					a.UserAddressDefault = false;
				}
				else{
					a.UserAddressDefault = true;
				}
			});
		}).error(function(err){
			console.log(err);
		});
	}
});

