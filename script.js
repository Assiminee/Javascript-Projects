let app = angular.module('tictactoeApp', []);

app.controller('TicTacToeController', function ($scope, $window, $compile) {

    initializeScore();
    displayScore();
    alternatePlayers();
    // Game Variables:
    let gameOnGoing = true;
    let buttonAppended = false;
    $scope.winnerText = "";
    $scope.winningPlayer = "";
    $scope.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Actualiser le score si d'autres joueurs veullent jouer
    $scope.resetScore = function () {
        let score = { O: 0, X: 0, Draw: 0};
    
        // Stocker les scores nuls dans le local storage
        localStorage.setItem('score', JSON.stringify(score));
    
        // Faire appel a la fonction qui affiche le score
        displayScore();
    };

    function alternatePlayers(){
        let score = localStorage.getItem('score');
        if (score) {
            score = JSON.parse(score);
            if (score.O > score.X) {
                $scope.currentMove = "O";
            } else {
                $scope.currentMove = "X";
            }
        }
    }
    // Fonction qui definit le score dans le local storage s'il n'est pas 
    // encore definit.
    function initializeScore() {
        // Essayer de recuperer le score du local storage
        let score = localStorage.getItem('score');
        // Verifier si le score existe deja
        if (!score) {
            // initialiser le score avec des 0
            let initialScore = { O: 0, X: 0, Draw: 0};

            // le stocker dans le local storage
            localStorage.setItem('score', JSON.stringify(initialScore));
        }
    }

    // fonction qui actualise le score a chaque fois qu'un joueur a gagné
    function updateScore(winner) {
        // recuperer le score
        let score = localStorage.getItem('score');
        score = score ? JSON.parse(score) : { O: 0, X: 0, Draw: 0}; // parse a json string and turn it into a javascript object

        // ajouter un point au gagnant
        if (winner === 'O') {
            score.O++;
        } else if (winner === 'X') {
            score.X++;
        }
        else if (winner == "Draw") {
            score.Draw++;
        }

        // Stocker le score actualisé dans le local storage
        localStorage.setItem('score', JSON.stringify(score)); // convert a JavaScript object into a JSON string
    }

    // Fonction qui recupere et affiche le score
    function displayScore() {
        // recuperer le score du local storage
        let score = localStorage.getItem('score');
        score = score ? JSON.parse(score) : { O: 0, X: 0, Draw: 0};
        let scoreString = `Score: O a gagné ${score.O} fois. X a gagné ${score.X} fois. 
        ${score.Draw} matchs nul.`;
        // la variable $scope.score sera utiliser dand le fichier HTML pour afficher 
        // le score 
        $scope.score = scoreString;
    }

    // Assigner un Id a toutes les colonne du tableau
    $scope.getCellId = function (row, col) {
        return 'cell-' + ((row * 3) + col + 1);
    };

    // Actualiser la page
    $scope.reloadWindow = function(){
        updateScore($scope.winningPlayer);
        $window.location.reload();
    }
    
    // Ajoute un bouton "Rejouer!" a la page
    function addButton(){
        if (!buttonAppended){
            let div = angular.element(document.querySelector(".buttonPlace"));
            let button = angular.element('<button id="b" ng-click="reloadWindow()">Rejouer!</button>');
            div.append(button);
            //div.append("<br>");
            //div.append("<br>");
            buttonAppended = true;
            $compile(button)($scope);
        }
    }

    // Verifie si tous les elements d'une ligne sont identiques
    function areAllElementsSame(array) {
        return array.every(function (element) {
            return element !== '' && element === array[0];
        });
    }

    // Verifie si tous les elements de la diagonale sont identiques
    function isStraightDiag(matrix){
        let pos;
        if (matrix[0][0] != ''){
            pos  = matrix[0][0];
        }
        let straightDiag = 0;
        let i;
        for (i = 1; i < 3; i++){
            if (pos == matrix[i][i]){
                straightDiag += 1;
            }
        }
        if (straightDiag === 2){
            $scope.winnerText = "Le gagnant est " + pos + "!";
            $scope.winningPlayer = pos;
            for (i = 0; i < 3; i++) {
                let cellId = $scope.getCellId(i, i);
                let cellElement = angular.element(document.querySelector('#' + cellId));
                cellElement.css('background-color', 'yellow');
            }
            return true;
        }
        return false;
    }

    // Verifie si tous les elements de la diagonale inverse sont identiques
    function isRevDiag(matrix){
        let pos;
        if (matrix[0][2] != ''){
            pos  = matrix[0][2];
        }
        let i;
        let j = 2;
        let revDiag = 0;
        for (i = 1; i < 3; i++){
            if (pos == matrix[i][j-i]){
                revDiag += 1;
            }
        }
        if (revDiag === 2){
            $scope.winnerText = "Le gagnant est " + pos + "!";
            $scope.winningPlayer = pos;
            for (i = 0; i < 3; i++) {
                const cellId = $scope.getCellId(i, j - i);
                let cellElement = angular.element(document.querySelector('#' + cellId));
                cellElement.css('background-color', 'yellow');
            }
            return true;
        }
        return false;
    }
    
    // Inverse la matrice board qui contient les coups des joueurs
    // On inverse les lignes et les colonnes pour pouvoir utiliser
    // la fonction areAllElementsSame sur une colonne de differentes
    // lignes.
    function reverseMatrix(matrix){
        let reverseArr = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                reverseArr[i][j] = matrix[j][i];
            }
        }
        return reverseArr;
    }

    // Verifie si les elements d'une colonne de differentes lignes (ligne verticale)
    // sont tous identiques
    function areColsSame(matrix, reversed){
        let i, j;
        for (i = 0; i < 3; i++){
            if (areAllElementsSame(matrix[i])){
                $scope.winnerText = "Le gagnant est " + matrix[i][0] + "!";
                $scope.winningPlayer = matrix[i][0];
                for (let j = 0; j < 3; j++) {
                    let cellId = reversed ? $scope.getCellId(j, i) : $scope.getCellId(i, j);
                    let cellElement = angular.element(document.querySelector('#' + cellId));
                    cellElement.css('background-color', 'yellow');
                }
                return true;
            }
        }
        return false;
    }

    // Verifie si la table TicTacToe est remplis completement
    function isBoardFull(matrix){
        let i;
        let j;
        if (matrix[0][0] != ''){
            for (i = 0; i < 3; i++){
                for (j = 0; j < 3; j++){
                    if (matrix[i][j] === ''){
                        return false;
                    }
                }
            }
            $scope.winnerText = "Match Nul!";
            $scope.winningPlayer = "Draw";
            return true;
        }
    }

    // La fonction qui definie le jeu
    $scope.makeMove = function (row, col) {
        let i;
        let same = 0;
        if (gameOnGoing){
            if ($scope.board[row][col] === '') {
                if ($scope.currentMove === "O") {
                    $scope.board[row][col] = 'O';
                    $scope.currentMove = "X";
                }
                else {
                    $scope.board[row][col] = 'X';
                    $scope.currentMove = "O";
                }
            }
            let id = $scope.getCellId(row, col);
            let cellElement = angular.element(document.querySelector('#' + id));
            if ($scope.board[row][col] === 'X') {
                let element = angular.element('<img src="https://i.pinimg.com/originals/98/55/c9/9855c9a483948348793b935ec140b3b4.png">');

                cellElement.append(element);
                cellElement.addClass('x-cell');
            }
            else if ($scope.board[row][col] === 'O') {
                let element = angular.element('<img src="https://i.pinimg.com/originals/f7/16/ca/f716ca09d3b1f7d7bb04a15f95796c39.png">');

                cellElement.append(element);
                cellElement.addClass('o-cell');
            }
        }
        let revArr = reverseMatrix($scope.board);
        let mat = $scope.board;
        if (
            isStraightDiag(mat) || 
            isRevDiag(mat) || 
            areColsSame(mat, false) || 
            areColsSame(revArr, true) || 
            isBoardFull(mat)
            ){
            gameOnGoing = false;
            addButton();
            
        }
    }

});