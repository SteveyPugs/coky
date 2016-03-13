app.controller("Forget", function($scope, $location){
	if($location.$$hash === "success") $("#success").removeClass("hide");
});