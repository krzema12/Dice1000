angular.module('dice', []).controller('GameCopntroller', function($scope) {
	$scope.players = [ ];
	$scope.warning = "";
	
	$scope.hideNewPlayerPrompt = false;
	$scope.hidePointsPrompt = true;
	
	$scope.addNewPlayer = function() {
		if (!$scope.newPlayerName) {
			$scope.warning = "You must enter player's name!";
			return;
		} else if ($scope._playerAlreadyExists($scope.newPlayerName)) {
			$scope.warning = "Player called " + $scope.newPlayerName + " is already playing!";
			return;
		}

		$scope.players.push({ name: $scope.newPlayerName, points: 0, lastPointChange: 0 });
		$scope.newPlayerName = "";
		$scope.warning = "";
	};
	
	$scope.startGame = function() {
		if ($scope.players.length < 2) {
			$scope.warning = "There's too little players added!";
			return;
		}

		$scope.hideNewPlayerPrompt = true;
		$scope.hidePointsPrompt = false;
		$scope.currentPlayerIndex = 0;
		$scope.warning = "";
	};
	
	$scope._playerAlreadyExists = function(name) {
		var found = false;

		for(var i = 0; i < $scope.players.length; i++) {
			if ($scope.players[i].name == name) {
				found = true;
				break;
			}
		}
		
		return found;
	};
	
	$scope.addPoints = function() {
		if (($scope.newPoints == "" || $scope.newPoints == undefined) && $scope.newPoints != "0") {
			$scope.warning = "You must enter some points to be added!";
			return;
		}

		if (isNaN($scope.newPoints)) {
			$scope.warning = "You must enter some valid value!";
			return;
		}
		
		if ($scope.newPoints < 0) {
			$scope.warning = "You cannot add negative number of points!";
			return;
		}
		
		if ($scope.newPoints%5 != 0) {
			$scope.warning = "Points must be divisible by 5!";
			return;	
		}
	
		if ($scope.players[$scope.currentPlayerIndex].points == 0
			&& $scope.newPoints < 50 && $scope.newPoints > 0)
		{
			$scope.warning = "You must get at least 50 points to start!";
			return;
		}
		
		if ($scope.newPoints == "-0") {
			$scope.newPoints = 0;
		}

		$scope.players[$scope.currentPlayerIndex].points =
			Number($scope.players[$scope.currentPlayerIndex].points) + Number($scope.newPoints);
		$scope.players[$scope.currentPlayerIndex].lastPointChange = Number($scope.newPoints);
		$scope.warning = "";
		$scope.currentPlayerIndex = ($scope.currentPlayerIndex + 1)%$scope.players.length;
		$scope.newPoints = "";
	};
});