app.controller("Orders", function($scope, $sessionStorage, $http, $cookies, $sce){
	$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
	$scope.history = '6M';
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	$scope.begin = 0;
	$scope.setOrderRange = function(){
		$scope.D1;
		$scope.D2;
		switch($scope.history){
			case "6M":
				$scope.D1 = moment().subtract(6, "months").format("YYYY-MM-DD HH:mm:ss");
				$scope.D2 = moment().format("YYYY-MM-DD HH:mm:ss");
				break;
			case "30D":
				$scope.D1 = moment().subtract(30, "days").format("YYYY-MM-DD HH:mm:ss");
				$scope.D2 = moment().format("YYYY-MM-DD HH:mm:ss");
				break;
			default:
				$scope.D1 = moment().year($scope.history).month(0).date(1).format("YYYY-MM-DD");
				$scope.D2 = moment().year($scope.history).month(11).date(31).format("YYYY-MM-DD");
		}
		$http.get("/api/order/" + $scope.account.UserID + "?DateFrom=" + $scope.D1 + "&DateTo=" + $scope.D2).success(function(orders){
			$scope.orders = orders;
			$scope.totalItems = Math.ceil(orders.length / $scope.pageSize);
			$http.get("/api/product").success(function(data){
				$scope.products = data;
				$scope.getProduct = function(id){
					var product = _.find($scope.products, function(i){
						if(id == i.ProductID) return true;
					});
					return product;
				};
			}).error(function(err){
				console.log(err);
			});
		}).error(function(err){
			console.log(err);
		});
	}
	$scope.setOrderRange();
	$scope.popover = {
		templateUrl: 'address.html',
	};
	$scope.years = [2016,2015];
	$scope.goNext = function(change){
		$scope.currentPage = $scope.currentPage + change;
		$scope.begin = $scope.begin + ($scope.pageSize * change);
	};
	$scope.goPage = function(page){
		$scope.currentPage = page;
		$scope.begin = $scope.pageSize * (page - 1);
	};
});