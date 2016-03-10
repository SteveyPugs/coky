app.controller("Shipping", function($scope, $cookies, $localStorage, $http){
	$scope.preset = true;
	if($localStorage.cartCount === 0){
		window.location.href = "/store/cart";
	}
	if($cookies.get("User")){
		$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	}
	$http.get("/api/address/" + $scope.account.UserID).success(function(addresses){
		$scope.addresses = addresses;
	}).error(function(err){
		console.log(err);
	});
	$scope.setAddress = function(id){
		$scope.preset = false;
		var address = _.find($scope.addresses, {
			UserAddressID: id
		});
		$scope.UserAddressCity = address.UserAddressCity;
		$scope.UserAddressFullName = address.UserAddressFullName;
		$scope.UserAddressState = address.UserAddressState;
		$scope.UserAddressStreet = address.UserAddressStreet;
		$scope.UserAddressZip = address.UserAddressZip;
	};
	$scope.states = [{
		name: "Alabama"
	},{
		name: "Alaska"
	},{
		name: "Arizona"
	},{
		name: "Arkansas"
	},{
		name: "California"
	},{
		name: "Colorado"
	},{
		name: "Connecticut"
	},{
		name: "Delaware"
	},{
		name: "District Of Columbia"
	},{
		name: "Florida"
	},{
		name: "Georgia"
	},{
		name: "Guam"
	},{
		name: "Hawaii"
	},{
		name: "Idaho"
	},{
		name: "Illinois"
	},{
		name: "Indiana"
	},{
		name: "Iowa"
	},{
		name: "Kansas"
	},{
		name: "Kentucky"
	},{
		name: "Louisiana"
	},{
		name: "Maine"
	},{
		name: "Maryland"
	},{
		name: "Massachusetts"
	},{
		name: "Michigan"
	},{
		name: "Minnesota"
	},{
		name: "Mississippi"
	},{
		name: "Missouri"
	},{
		name: "Montana"
	},{
		name: "Nebraska"
	},{
		name: "Nevada"
	},{
		name: "New Hampshire"
	},{
		name: "New Jersey"
	},{
		name: "New Mexico"
	},{
		name: "New York"
	},{
		name: "North Carolina"
	},{
		name: "North Dakota"
	},{
		name: "Ohio"
	},{
		name: "Oklahoma"
	},{
		name: "Oregon"
	},{
		name: "Pennsylvania"
	},{
		name: "Rhode Island"
	},{
		name: "South Carolina"
	},{
		name: "South Dakota"
	},{
		name: "Tennessee"
	},{
		name: "Texas"
	},{
		name: "Utah"
	},{
		name: "Vermont"
	},{
		name: "Virginia"
	},{
		name: "Washington"
	},{
		name: "West Virginia"
	},{
		name: "Wisconsin"
	},{
		name: "Wyoming"
	}];
});