This is yet another implementation of the famous game [Tic-Tac-Toe](https://en.wikipedia.org/wiki/Tic-tac-toe).

## Main features
* Two players playing against each other over the Internet.
* Customisable size of the game board, from 3x3 to 8x8.
* Multiple independent concurrent game sessions.
* Capability to detect a draw and a win.
* Being able to reset and restart the game by either of the players.

## How to play
* Go to https://tic-tac-toe.xuzhuang.org and invite your peer to do the same. Each of you will be assigned a symbol (✿ or ⚘).
* The system will coordinate the moves - once player ✿ has taken a move, it will wait for player ⚘ to move.
* If it has become clear that neither player can win, the system will declare a draw, even before all the boxes have been filled.
* When a winner comes up, the system will mark out the winning path on the board.
* Any time during a game, either player can go to the *Settings* tab to change the dimension of the board, and the existing moves will be cleared.
* Any time during a game, either player can click the *Reset* link to reset the game board to an empty state.
