angular.module('dice', ['ui.bootstrap']).controller('GameCopntroller', function($scope) {
	$scope.players = [ ];
	$scope.oneStepZones = [ { begin: 400, end: 500 }, { begin: 800, end: 900 } ];
	$scope.stage = 'adding_players';
	$scope.warning = "";

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

		$scope.stage = 'playing';
		$scope.currentPlayerIndex = 0;
		$scope.warning = "";
	};
	
	$scope._playerAlreadyExists = function(name) {
		var found = false;

		for (var i = 0; i < $scope.players.length; i++) {
			if ($scope.players[i].name == name) {
				found = true;
				break;
			}
		}
		
		return found;
	};
	
	$scope._addPoints = function(playerIndex, points) {
		$scope.players[playerIndex].points = Number($scope.players[playerIndex].points) + Number(points);
		$scope.players[playerIndex].lastPointChange = (Number(points) > 0 ? '+' + Number(points) : Number(points));
	};
	
	$scope._checkInWhichOneStepZone = function(points) {
		for (var i = 0; i < $scope.oneStepZones.length; i++) {
			if (points >= $scope.oneStepZones[i].begin && points < $scope.oneStepZones[i].end) {
				return i;
			}
		}
		
		return -1;
	}
	
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
	
		if ($scope.players[$scope.currentPlayerIndex].points == 0
			&& $scope.newPoints < 50 && $scope.newPoints > 0)
		{
			$scope.warning = "You must get at least 50 points to start!";
			return;
		}

		if ($scope.newPoints%5 != 0) {
			$scope.warning = "Points must be divisible by 5!";
			return;	
		}
		
		if ($scope.newPoints == "-0") {
			$scope.newPoints = 0;
		}
		
		// Input normalization and error handling done.
		
		var zone = $scope._checkInWhichOneStepZone($scope.players[$scope.currentPlayerIndex].points);
		
		if (zone != -1 && $scope.newPoints > 0 && Number($scope.players[$scope.currentPlayerIndex].points) + Number($scope.newPoints) < $scope.oneStepZones[zone].end) {
			$scope.warning = "You must get at least " + ($scope.oneStepZones[zone].end - $scope.players[$scope.currentPlayerIndex].points) + " points to get out of the one-step zone!";
			return;
		}
		
		for (var i = 0; i < $scope.players.length; i++) {
			if (i == $scope.currentPlayerIndex) {
				continue;
			}
			
			if ($scope.players[i].points > $scope.players[$scope.currentPlayerIndex].points &&
				$scope.players[i].points < Number($scope.players[$scope.currentPlayerIndex].points) + Number($scope.newPoints))
			{
				$scope._addPoints(i, -Math.min(50, $scope.players[i].points));
			}
		}

		$scope._addPoints($scope.currentPlayerIndex, $scope.newPoints);
		
		if ($scope.players[$scope.currentPlayerIndex].points >= 1000) {
			$scope.players[$scope.currentPlayerIndex].won = true;
		}
		
		if ($scope.players.filter(function (player) { return player.points >= 1000; }).length + 1 == $scope.players.length) {
			$scope.stage = 'finished';
		}
		
		$scope.warning = "";
		
		do {
			$scope.currentPlayerIndex = ($scope.currentPlayerIndex + 1)%$scope.players.length;
		}
		while ($scope.players[$scope.currentPlayerIndex].won);
		
		$scope.newPoints = "";
	};
});