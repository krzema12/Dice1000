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
	
	describe("addPoints()", function() {
		it("adds points for the current player at start", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 120;
			
			$scope.addPoints();
		
			expect($scope.players).toEqual([
				{ name: "John", points: 120, lastPointChange: 120 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			]);
		});
		
		it("raises warning when trying to add less than 50 points at start", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 30;
			
			$scope.addPoints();
		
			expect($scope.warning).toEqual("You must get at least 50 points to start!");
			expect($scope.players).toEqual([
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			]);
		});
		
		it("raises proper warning when trying to add less than 50 points at start and the points aren't divisible by 5", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 34;
			
			$scope.addPoints();
		
			expect($scope.warning).toEqual("You must get at least 50 points to start!");
			expect($scope.players).toEqual([
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			]);
		});
		
		describe("raises warning when trying to add", function() {
			beforeEach(function() {
				$scope.players = [
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 0;
			});
			
			it("an empty points value", function() {
				$scope.newPoints = "";
				
				$scope.addPoints();
			
				expect($scope.warning).toEqual("You must enter some points to be added!");
				expect($scope.players).toEqual([
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
			});
			
			it("an undefined value", function() {
				$scope.newPoints = undefined;
				
				$scope.addPoints();
			
				expect($scope.warning).toEqual("You must enter some points to be added!");
				expect($scope.players).toEqual([
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
			});
			
			describe("something that is not a legal number of points,", function() {
				it("like a negative number", function() {
					$scope.newPoints = -45;
					
					$scope.addPoints();
				
					expect($scope.warning).toEqual("You cannot add negative number of points!");
					expect($scope.players).toEqual([
						{ name: "John", points: 0, lastPointChange: 0 },
						{ name: "Kate", points: 0, lastPointChange: 0 }
					]);
				});
				
				it("like a positive number, not divisible by 5", function() {
					$scope.newPoints = 84;
					
					$scope.addPoints();
				
					expect($scope.warning).toEqual("Points must be divisible by 5!");
					expect($scope.players).toEqual([
						{ name: "John", points: 0, lastPointChange: 0 },
						{ name: "Kate", points: 0, lastPointChange: 0 }
					]);
				});
				
				it("like a string consisting of letters", function() {
					$scope.newPoints = "Abc";
					
					$scope.addPoints();
				
					expect($scope.warning).toEqual("You must enter some valid value!");
					expect($scope.players).toEqual([
						{ name: "John", points: 0, lastPointChange: 0 },
						{ name: "Kate", points: 0, lastPointChange: 0 }
					]);
				});
			});
		});
		
		describe("correctly normalizes numeric values", function() {
			beforeEach(function() {
				$scope.players = [
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 0;
			});

			it("like -0", function() {
				$scope.newPoints = "-0";
				
				$scope.addPoints();
			
				expect($scope.players).toEqual([
					{ name: "John", points: 0, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
				expect($scope.warning).toEqual("");
			});
			
			it("like 00050", function() {
				$scope.newPoints = "00050";
				
				$scope.addPoints();
			
				expect($scope.players).toEqual([
					{ name: "John", points: 50, lastPointChange: 50 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
				expect($scope.warning).toEqual("");
			});
			
			it("like '    80  '", function() {
				$scope.newPoints = "    80  ";
				
				$scope.addPoints();
			
				expect($scope.players).toEqual([
					{ name: "John", points: 80, lastPointChange: 80 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
				expect($scope.warning).toEqual("");
			});
		});		

		it("lets add 0 points even if player has 0 points", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 0;
			
			$scope.addPoints();
		
			expect($scope.warning).toEqual("");
			expect($scope.players).toEqual([
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			]);
		});
		
		it("removes any warning if the move is legal", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.warning = "Some warning";
			$scope.newPoints = 80;
			
			$scope.addPoints();
		
			expect($scope.warning).toEqual("");
		});
		
		it("resets the points field if the move is legal", function() {
			$scope.players = [
				{ name: "John", points: 0, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.warning = "Some warning";
			$scope.newPoints = 80;
			
			$scope.addPoints();
		
			expect($scope.newPoints).toEqual("");
		});
		
		it("correctly adds two non-zero values of points", function() {
			$scope.players = [
				{ name: "John", points: 80, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 40;
			
			$scope.addPoints();
			
			expect($scope.players).toEqual([
				{ name: "John", points: 120, lastPointChange: 40 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			]);
			expect($scope.warning).toEqual("");
		});
		
		it("resets new points value", function() {
			$scope.players = [
				{ name: "John", points: 80, lastPointChange: 0 },
				{ name: "Kate", points: 0, lastPointChange: 0 }
			];
			$scope.currentPlayerIndex = 0;
			$scope.newPoints = 40;
			
			$scope.addPoints();
			
			expect($scope.newPoints).toEqual("");
		});		
		
		// TODO: a problem with adding two integers. If points are equal to 0 and one
		// adds a number to it, it becomes e.g. '040' (a string!) instead of just 40.
		// It's solved by using Number(...) on eah operand. But how should I test it?
		
		describe("moves to the next active player", function() {
			it("if two active players and first is active", function() {
				$scope.players = [
					{ name: "John", points: 80, lastPointChange: 0 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 0;
				$scope.newPoints = 40;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 120, lastPointChange: 40 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				]);
				expect($scope.currentPlayerIndex).toEqual(1);
			});
			
			it("if two active players and the second is active", function() {
				$scope.players = [
					{ name: "John", points: 80, lastPointChange: 80 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 1;
				$scope.newPoints = 60;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 80, lastPointChange: 80 },
					{ name: "Kate", points: 60, lastPointChange: 60 }
				]);
				expect($scope.currentPlayerIndex).toEqual(0);
			});			
		});
		
		describe("subtracts 50 points from another player(s) when current player precedes them", function() {
			it("and the current player is strictly before players that are to be preceded", function() {
				$scope.players = [
					{ name: "John", points: 80, lastPointChange: 0 },
					{ name: "Kate", points: 60, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 1;
				$scope.newPoints = 40;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 30, lastPointChange: -50 },
					{ name: "Kate", points: 100, lastPointChange: 40 }
				]);
				expect($scope.currentPlayerIndex).toEqual(0);				
			});
			
			it("and the current player is equal with another player", function() {
				$scope.players = [
					{ name: "John", points: 80, lastPointChange: 0 },
					{ name: "Kate", points: 80, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 1;
				$scope.newPoints = 40;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 80, lastPointChange: 0 },
					{ name: "Kate", points: 120, lastPointChange: 40 }
				]);
				expect($scope.currentPlayerIndex).toEqual(0);				
			});
			
			it("and the current player will be equal with another player after the move", function() {
				$scope.players = [
					{ name: "John", points: 100, lastPointChange: 0 },
					{ name: "Kate", points: 60, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 1;
				$scope.newPoints = 40;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 100, lastPointChange: 0 },
					{ name: "Kate", points: 100, lastPointChange: 40 }
				]);
				expect($scope.currentPlayerIndex).toEqual(0);				
			});
			
			it("and some player has less than 50 points and will be preceded", function() {
				$scope.players = [
					{ name: "John", points: 20, lastPointChange: -50 },
					{ name: "Kate", points: 0, lastPointChange: 0 }
				];
				$scope.currentPlayerIndex = 1;
				$scope.newPoints = 50;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 0, lastPointChange: -20 },
					{ name: "Kate", points: 50, lastPointChange: 50 }
				]);
				expect($scope.currentPlayerIndex).toEqual(0);				
			});
		});
		
		describe("winning", function() {
			it("in case of 2 players, causes the current player to win and stop playing if it gets 1000 points or more", function() {
				$scope.players = [
					{ name: "John", points: 850, lastPointChange: 20, won: false },
					{ name: "Kate", points: 425, lastPointChange: 60, won: false }
				];
				$scope.currentPlayerIndex = 0;
				$scope.newPoints = 200;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 1050, lastPointChange: 200, won: true },
					{ name: "Kate", points: 425, lastPointChange: 60, won: false }
				]);
				expect($scope.currentPlayerIndex).toEqual(1);
				expect($scope.gameFinished).toEqual(true);
			});
			
			it("in case of 3 players, jumps over players that already won", function() {
				$scope.players = [
					{ name: "John", points: 600, lastPointChange: 20, won: false },
					{ name: "Kate", points: 1025, lastPointChange: 60, won: true },
					{ name: "Ron", points: 425, lastPointChange: 60, won: false }
				];
				$scope.currentPlayerIndex = 0;
				$scope.newPoints = 200;
				
				$scope.addPoints();
				
				expect($scope.players).toEqual([
					{ name: "John", points: 800, lastPointChange: 200, won: false },
					{ name: "Kate", points: 1025, lastPointChange: 60, won: true },
					{ name: "Ron", points: 425, lastPointChange: 60, won: false }
				]);
				expect($scope.currentPlayerIndex).toEqual(2);
			});			
		});
	});
});