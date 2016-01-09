app.controller("Payment", function($scope, $localStorage, $sessionStorage, $http, $cookies, Stripe){
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
		$scope.getTotal = function(){
			$scope.total = 0;
			$scope.shipping = 15;
			for(var item in $scope.cart){
				var product = $scope.getProduct(item);
				$scope.total = $scope.total + product.ProductPrice * $scope.cart[item].count;
			}
			$scope.subtotal = $scope.total;
			$scope.tax = $scope.total * 0.08875;
			$scope.total = $scope.total + $scope.tax + $scope.shipping;
		};
		$scope.getTotal();
		var UserEmail = null;
		if($cookies.get("User")){
			$scope.account = JSON.parse($cookies.get("User").substring($cookies.get("User").indexOf("{"), $cookies.get("User").lastIndexOf("}") + 1));
			UserEmail = $scope.account.UserEmail;
		}
		var handler = StripeCheckout.configure({
			key: Stripe.key,
			locale: "auto",
			email: UserEmail,
			allowRememberMe: false,
			token: function(token){
				$http.post("/store/cart/charge", {
					address: {
						Save: $("#UserAddressSave").val(),
						UserAddressFullName: $("#UserAddressFullName").val(),
						UserAddressStreet: $("#UserAddressStreet").val(),
						UserAddressCity: $("#UserAddressCity").val(),
						UserAddressState: $("#UserAddressState").val(),
						UserAddressZip: $("#UserAddressZip").val(),
					},
					token: token,
					items: $localStorage.cartItems,
					total: parseFloat($scope.total.toFixed(2)),
					subtotal: parseFloat($scope.subtotal.toFixed(2)),
					shipping: parseFloat($scope.shipping.toFixed(2)),
					tax: parseFloat($scope.tax.toFixed(2))
				}).success(function(data){
					$localStorage.cartCount = 0;
					$localStorage.cartItems = {};
					window.location = "/store/cart/confirmation/" + data;
				}).error(function(err){
					console.log(err);
				});
			}
		});
		$("#paymentButton").on("click", function(e){
			handler.open({
				name: "Tweedles Bakery",
				amount: $scope.total.toFixed(2) * 100
			});
			e.preventDefault();
		});
		$(window).on("popstate", function(){
			handler.close();
		});

	}).error(function(err){
		console.log(err);
	});
});