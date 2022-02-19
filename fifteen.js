/**
 * Created by Takatathien on 10/31/2016.
 * This page is the JavaScript of fifteen.html
 * It control what to do when the user click on a square,
 * and how to shuffle the square when the button is clicked.
 * The extra feature allowed the puzzle to change size to either
 * 4x4 or 5x5
 */
(function() {
    'use strict';

    var emptyRow = 4;
    var emptyCol = 4;
    var size = 4;
    var neighbors;

    window.onload = function() {
        document.getElementById("puzzlearea").onmouseover = getNeighbors;
        document.getElementById("shufflebutton").onclick = shuffle;
        createOptions();
    };

    // Create the size options for player.
    function createOptions() {
        var controls = document.getElementById("controls");
        var newList = document.createElement("select");

        newList.appendChild(new Option("4x4", "4"));
        newList.appendChild(new Option("5x5", "5"));

        controls.appendChild(newList);
        controls.onchange = changeSize;
        createPuzzle();
    }

    // Create the puzzle
    function createPuzzle() {
        document.getElementById("puzzlearea").innerHTML = "";
        for (var i = 0; i < (size * size) - 1; i++) {
            createOneSquare();
        }
        setPosition();
    }

    // Create one square and put into the puzzle area
    function createOneSquare() {
        var puzzle = document.getElementById("puzzlearea");
        var newSquare = document.createElement("div");
        newSquare.className = "square";
        puzzle.appendChild(newSquare);
    }

    // input information about the position of the square
    // set the background to match the input position
    function setPosition() {
        var squares = document.querySelectorAll(".square");
        var index = 0;
        for (var row = 1; row < size + 1; row++) {
            for (var col = 1; col < size + 1; col++) {
                squares[index].innerHTML = index + 1;
                squares[index].style.top = ((row - 1) * (400 / size)) + "px";
                squares[index].style.left = ((col - 1) * (400 / size)) + "px";
                squares[index].style.width = ((400 / size) - 10) + "px";
                squares[index].style.height = ((400 / size) - 10) + "px";
                squares[index].setAttribute("id", "square_" + row + "_" + col);
                squares[index].style.backgroundPosition = "-" + ((col - 1) * (400 / size)) + "px -" + ((row - 1) * (400 / size)) + "px";
                index++;
            }
        }
    }

    // find all of the neighbor square next to the empty spot and push
    // them in an array.
    // if the position is invalid then take them out of the array.
    function getNeighbors() {
        neighbors = [];

        var aboveEmptySquare = "square_" + (emptyRow - 1) + "_" + emptyCol;
        var belowEmptySquare = "square_" + (emptyRow + 1) + "_" + emptyCol;
        var leftEmptySquare = "square_" + emptyRow + "_" + (emptyCol - 1);
        var rightEmptySquare = "square_" + emptyRow + "_" + (emptyCol + 1);


        neighbors.push(aboveEmptySquare);
        neighbors.push(belowEmptySquare);
        neighbors.push(leftEmptySquare);
        neighbors.push(rightEmptySquare);

        for (var i = 0; i < neighbors.length; i++) {
            if (document.getElementById(neighbors[i])) {
                document.getElementById(neighbors[i]).classList.add("movable");
                document.getElementById(neighbors[i]).onclick = clickMethod;
            } else {
                neighbors.splice(i, 1);
                i--;
            }
        }
    }

    // remove the square from being the neighbor of the empty spot once the
    // square is moved.
    function removeNeighbors() {
        for (var i = 0; i < neighbors.length; i++) {
            if (document.getElementById(neighbors[i])) {
                document.getElementById(neighbors[i]).classList.remove("movable");
            }
        }
    }

    // move the square that is movable into the empty spot
    // then update the position information of the square
    // and of the empty spot.
    // then update the list of neighbors.
    function moveSquare(square) {
        if (neighbors.indexOf(square.id) > -1) {
            var oldRow = parseInt(square.style.top) / (400 / size) + 1;
            var oldCol = parseInt(square.style.left) / (400 / size) + 1;
            square.style.top = ((emptyRow - 1) * (400 / size)) + "px";
            square.style.left = ((emptyCol - 1) * (400 / size)) + "px";
            square.setAttribute("id", "square_" + emptyRow + "_" + emptyCol);
            emptyRow = oldRow;
            emptyCol = oldCol;
            removeNeighbors();
            getNeighbors();
        }
    }

    // helper method to call moveSquare without having it attach
    // to an event handler directly.
    function clickMethod() {
        moveSquare(this);
    }

    // shuffle the puzzle by moving the squares randomly for 1000 times
    // when the user click the button
    function shuffle() {
        getNeighbors();
        for (var i = 0; i < 1000; i++) {
            var index = Math.floor((Math.random() * neighbors.length));
            moveSquare(document.getElementById(neighbors[index]));
        }
    }

    // change the size of the puzzle when the player select the option
    function changeSize() {
        if (size == 4) {
            size = 5;
            emptyRow = 5;
            emptyCol = 5;
            createPuzzle();
        } else {
            size = 4;
            emptyRow = 4;
            emptyCol = 4;
            createPuzzle();
        }
    }
})();