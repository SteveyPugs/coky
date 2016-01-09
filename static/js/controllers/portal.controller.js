app.controller("Portal", function($scope, $http, $filter){
	$http.get("/api/product").success(function(data){
		for(var item in data){
			for(var key in data[item]){
				if(key === "Category"){
					data[item]["CategoryName"] = data[item][key].CategoryName;
					delete data[item]["Category"];
				}
				if(key === "ProductActive"){
					if(data[item][key]){
						data[item]["ProductStatus"] = "Live";
					} else {
						data[item]["ProductStatus"] = "Draft";
					}
					delete data[item]["ProductActive"];
				}
			}	
		}
		$scope.products = data;
		$scope.safeproducts = data;
		$http.get("/api/category").success(function(data){
			$scope.categories = data;
			$scope.safecategories = data;
		}).error(function(err){
			console.log(err);
		});
	}).error(function(err){
		console.log(err);
	});
	$scope.createProduct = function(){
		var fd = new FormData();
		fd.append("ProductImage", $scope.image);
		fd.append("ProductName", $scope.ProductName);
		fd.append("ProductPrice", $scope.ProductPrice);
		fd.append("ProductActive", $scope.select.active);
		fd.append("CategoryID", $scope.select.category);
		$http.post("/api/product", fd, {
			transformRequest: angular.identity,
			headers: {
				"Content-Type": undefined
			}
		}).success(function(data){
			$scope.image = "";
			$scope.ProductName = "";
			$scope.ProductPrice = "";
			$scope.select = "";
			$("#AddProductModal").modal("hide");
		}).error(function(err){
			//do something on error
		});
	};
	$scope.createCategory = function(){
		$http.post("/api/category", {
			CategoryName: $scope.Category
		}).success(function(data){
			$scope.Category = "";
			$("#AddCatModal").modal("hide");
		}).error(function(err){
			//do something on error
		});
	};
});