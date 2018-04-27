/*
I stole the image files from an online example because I wanted the changing 
face pictures.
*/
var minesweeper = (function(){
    var SQUARES = {
        blank: 1,
        opened: 2,
        flagged: 3
    },
    IMAGE = {
        blank: 'images/board/blank.gif',
        flagged: 'images/board/flagged.gif',
        minedeath: 'images/mine/minedeath.gif',
        minemisflagged: 'images/mine/minemisflagged.gif',
        minerevealed: 'images/mine/minerevealed.gif',
        facedead: 'images/face/facedead.gif',
        facesmile: 'images/face/facesmile.gif',
        facewin: 'images/face/facewin.gif',
        'number-': 'images/number/number-.gif',
        number0: 'images/number/number0.gif',
        number1: 'images/number/number1.gif',
        number2: 'images/number/number2.gif',
        number3: 'images/number/number3.gif',
        number4: 'images/number/number4.gif',
        number5: 'images/number/number5.gif',
        number6: 'images/number/number6.gif',
        number7: 'images/number/number7.gif',
        number8: 'images/number/number8.gif',
        number9: 'images/number/number9.gif',
        open0: 'images/open/open0.gif',
        open1: 'images/open/open1.gif',
        open2: 'images/open/open2.gif',
        open3: 'images/open/open3.gif',
        open4: 'images/open/open4.gif',
        open5: 'images/open/open5.gif',
        open6: 'images/open/open6.gif',
        open7: 'images/open/open7.gif',
        open8: 'images/open/open8.gif'
      },
      options = {
          width: 16,
          height: 16,
          mines: 40
      };
      var limit = function(num,low,high){
        if(!num){
            num=0;
        }
        if(num<low){
            return min;
        } else if(num>high){
            return high;
        } else{
            return num;
        }
      };

      var validPosition = function(position){
        return position[0]>=0 && position[0]<options.height
            && position[1]>=0 && position[1]<options.width;
      };

      var compositePosition = function(position){
          return position[0]*16+position[1];
      }

      var board = {
        initialize: function(){
            this.rows = options.height;
            this.cols = options.width;
            this.minesRemaining = options.mines;
            this.time = 0;
            this.timerID = 0;
            this.squares = [];
            this.mineLocations = [];
            this.squaresClicked = 0;
            this.noneOpened = true;
            this.squaresOpened = 0;
            this.create();
        },

        create: function() {
            var content;
            for(var i =0; i < this.rows; i++){
                content += '<tr>';
                for (var j = 0; j< this.cols; j++){
                    this.squares.push( new Square([i,j]));
                    content += '<td><img src="' + 
                        IMAGE.blank + '"id='+(i*this.cols+j)+'></td>';
                }
                content += '</tr>';
            }
            $('.container').width(this.cols*16+20);
            $('tbody').empty().append(content);
            this.displayMineCount();
            this.displayTime()
        },

        displayMineCount: function(){
            var display = limit(this.minesRemaining,-1,100),
                displayString = ('00'+ Math.abs(display)).slice(-3);
            if(display<0){
                displayString = '-'+displayString.slice(-2);
            }
            $( '#mine_0' ).attr( 'src', IMAGE['number' + displayString[0]] );
            $( '#mine_1' ).attr( 'src', IMAGE['number' + displayString[1]] );
            $( '#mine_2' ).attr( 'src', IMAGE['number' + displayString[2]] );
        },

        displayTime: function(){
            var displayString = ('00' + Math.abs(this.time) ).slice(-3);
            $( '#time_0' ).attr( 'src', IMAGE['number' + displayString[0]] );
            $( '#time_1' ).attr( 'src', IMAGE['number' + displayString[1]] );
            $( '#time_2' ).attr( 'src', IMAGE['number' + displayString[2]] );
        },

        updateTime: function(){
            this.time++;
            this.displayTime();
        },
        //add mines
        placeMines: function(){
            var square,adSquare,adPositions,squares = this.squares;
            $.each(this.mineLocations, function(index,position){
                square = squares[position];
                square.isMine = true;
                adPositions = square.adjacentPositions();
                $.each(adPositions,function(index,adPosition){
                    adSquare = squares[adPosition];
                    adSquare.adjacentMines +=1;
                });
            });

            this.timerID = setInterval( this.updateTime.bind( this ), 1000 );
            
        },
        //generate mines
        createMines: function(position){
            var size = options.width * options.height;

            shuffle =function(array){
                for(var i = 0; i<array.length; i++){
                    var rand = Math.floor(Math.random() * (i-1));
                    var temp = array[i];
                    array[i]=array[rand];
                    array[rand]=temp;
                }
                return array;
            }
            for(var i =0; i<size; i++){
                if(i!=position){this.mineLocations.push(i)}
            }
            this.mineLocations = shuffle(this.mineLocations).slice(0,options.mines);
            this.placeMines()
        },
        //handle play
        playGame: function(click, $square){
            var square = this.squares[$square.attr('id')];
            if (click === 1){
                if (square.state === SQUARES.blank){
                    this.openSquare(square, $square);
                }            
            }
            else if(click === 3){
                if(square.state===SQUARES.blank){
                    this.setSquare(IMAGE.flagged,square,$square,SQUARES.flagged);
                    this.minesRemaining--;
                    this.displayMineCount();
                }
                else if(square.state===SQUARES.flagged){
                    this.setSquare(IMAGE.blank,square,$square,SQUARES.blank);
                    this.minesRemaining++
                    this.displayMineCount();
                }
            }
        },
        //handle open
        openSquare: function(square, $square){
            if(this.noneOpened){
                this.noneOpened = false;
                this.createMines(compositePosition(square.position));
            }

            if(square.isMine){
                this.lose($square);
            }
            else if(square.adjacentMines===0){
                this.openMoreSquares(square, $square);
            }
            else{
                this.setSquare(IMAGE['open' + square.adjacentMines], square, $square, SQUARES.opened);
                this.numberOpened();
                
            }
            
        },

        openMoreSquares: function(square, $square){
            var nextSquare, $nextSquare, near, visited = [compositePosition(square.position)],
                needOpened = [compositePosition(square.position)];

            while(needOpened.length){
                nextSquare = this.squares[needOpened.shift()];
                $nextSquare = $('#' + compositePosition(nextSquare.position));
                if (nextSquare.adjacentMines===0){
                    near = nextSquare.adjacentPositions();
                    $.each(near, function(index,near){
                        if(visited.indexOf(near)===-1){
                            visited.push(near);
                            needOpened.push(near);
                        }
                    });
                }
                if( nextSquare.state === SQUARES.blank) {
                    this.setSquare( IMAGE['open' + nextSquare.adjacentMines], nextSquare, $nextSquare, SQUARES.opened);
                    this.numberOpened();
                }
            }
        },
        //update square
        setSquare: function(image, square, $square, state){
            square.state = state;
            $square.attr('src',image);
        },

        win: function(){
            $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facewin );
            this.end();
        },

        lose: function($squareClicked){
            for(var i=0; i<options.mines;i++){
                var square = this.squares[this.mineLocations[i]];
                var $square = $('#' + this.mineLocations[i]);

                if(square.state === SQUARES.blank){
                    this.setSquare( IMAGE.minerevealed, square, $square, SQUARES.opened);
                }
            }
            $squareClicked.attr('src', IMAGE.minedeath);
            $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facedead );
            
            this.end();
        },
        end: function(){
            clearInterval(this.timerID);
            $('tbody').off('mousedown', 'img');
        },

        restart: function(){
            this.end();
            $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facesmile );
            this.initialize();
        },

        numberOpened: function(){
            this.squaresOpened++;
            if(this.squaresOpened === options.height*options.width-options.mines){
                this.win();
            }
        }

    };

    function Square(position){
          this.position = position;
          this.state = SQUARES.blank;
          this.isMine = false;
          this.adjacentMines = 0;
    }



    Square.prototype.adjacentPositions = function() {
        var newPos,
            neighbors = [],
            direction = {
              U: [-1, 0],
              D: [1, 0],
              L: [0, 1],
              R: [0, -1],
              UL: [-1, -1],
              UR: [-1, 1],
              DL: [1, 1],
              DR: [1, -1],
            };
        for(var dir in direction){
          newPos = [ this.position[0] + direction[dir][0],
                     this.position[1] + direction[dir][1] ];
          if (validPosition(newPos)){
            neighbors.push(compositePosition(newPos));
          }
        }
        return neighbors;
      };

      return{
        board: board
    };

})();

$(document).ready(function() {
    minesweeper.board.initialize();

    var setupPlayGame = function() {
        $('tbody').on('mousedown', 'img', function( event ) {
          minesweeper.board.playGame( event.which, $(this) );
        });
    };

    $( '.game_container' ).on( 'contextmenu', function( event ) {
        event.preventDefault();
    });

    setupPlayGame();

    $( '.face' ).on( 'click', 'img', function() {
        minesweeper.board.restart();
        setupPlayGame();
      });

    $( document ).mouseup( function ( event ) {
       var $container = $( '.menu' );
       if ( !$container.is( event.target ) &&
           $container.has( event.target ).length === 0 ) { 
         $( '#form' ).fadeOut();
       }
    });
});