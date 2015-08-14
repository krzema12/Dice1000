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
});