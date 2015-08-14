describe("gameController", function() {
	beforeEach(module('dice'));
	var $controller, scope;
	
	beforeEach(inject(function(_$controller_) {
		$controller = _$controller_;
		$scope = {};
		controller = $controller('GameCopntroller', { $scope: $scope });
	}));
	
	describe("app at startup", function() {
		it("has new player's prompt visible", function() {
			expect($scope.hideNewPlayerPrompt).toEqual(false);
		});
		
		it("has new points prompt invisible", function() {
			expect($scope.hidePointsPrompt).toEqual(true);
		});
		
		it("has no warning", function() {
			expect($scope.warning).toEqual("");
		});
		
		it("has current player's index set to anything but positive number", function() {
			expect($scope.currentPlayerIndex >= 0).toEqual(false);
		});
	});

	describe("addNewPlayer()", function() {
		it("adds new player to empty list", function() {
			$scope.players = [ ];
			$scope.newPlayerName = "John";
			
			$scope.addNewPlayer();
			
			expect($scope.players).toEqual([ { name: "John", points: 0, lastPointChange: 0 } ]);
		});
		
		it("resets new player's name prompt after successful adding", function() {
			$scope.players = [ ];
			$scope.newPlayerName = "John";
			
			$scope.addNewPlayer();
			
			expect($scope.newPlayerName).toEqual('');
		});
		
		it("raises a warning when trying to add a player already existing on the list", function() {
			$scope.players = [ { name: "John", points: 0, lastPointChange: 0 } ];
			$scope.newPlayerName = "John";
			
			$scope.addNewPlayer();
			
			expect($scope.players).toEqual([ { name: "John", points: 0, lastPointChange: 0 } ]);
			expect($scope.warning).toEqual("Player called John is already playing!");
		});
		
		it("raises a warning when trying to add a player with empty name", function() {
			$scope.players = [ { name: "John", points: 0, lastPointChange: 0 } ];
			$scope.newPlayerName = "";
			
			$scope.addNewPlayer();
			
			expect($scope.players).toEqual([ { name: "John", points: 0, lastPointChange: 0 } ]);
			expect($scope.warning).toEqual("You must enter player's name!");
		});
		
		it("raises a warning when trying to add a player when 'player' field is undefined", function() {
			$scope.players = [ { name: "John", points: 0, lastPointChange: 0 } ];
			
			$scope.addNewPlayer();
			
			expect($scope.players).toEqual([ { name: "John", points: 0, lastPointChange: 0 } ]);
			expect($scope.warning).toEqual("You must enter player's name!");
		});
		
		it("removes warning if the name isn't incorrect any more", function() {
			$scope.warning = "Some warning";
			$scope.newPlayerName = "John";
			
			$scope.addNewPlayer();
			
			expect($scope.warning).toEqual("");
		});	
	});
	
	describe("startGame()", function() {
		it("raises a warning if the players list has less than two players", function() {
			$scope.players = [ { name: "John", points: 0, lastPointChange: 0 } ];
		
			$scope.startGame();
		
			expect($scope.warning).toEqual("There's too little players added!");
			expect($scope.hideNewPlayerPrompt).toEqual(false);
			expect($scope.hidePointsPrompt).toEqual(true);
		});	
	
		describe("with list of players with more than one player", function() {
			beforeEach(function() {
				$scope.players = [
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
			});

			it("hides the field to add new players", function() {
				$scope.startGame();
			
				expect($scope.hideNewPlayerPrompt).toEqual(true);
			});
			
			it("shows the field to add points", function() {
				$scope.startGame();
			
				expect($scope.hidePointsPrompt).toEqual(false);
			});
			
			it("removes any warning", function() {
				$scope.warning = "Some warning";
			
				$scope.startGame();
			
				expect($scope.warning).toEqual("");
			});
			
			it("current player is set to the first one (with index = 0)", function() {
				$scope.startGame();
			
				expect($scope.currentPlayerIndex).toEqual(0);
			});
		});	
	});
});