package com.freedom.model;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.piece.*;

public class Game {
    private final Pieces whitePieces = PieceFactory.initWhitePieces();
    private final Pieces blackPieces = PieceFactory.initBlackPieces();
    private Color currentPlayerColor = Color.WHITE;
    public static Game create() {
        return new Game();
    }

    public void move(Move move) throws InvalidInputException {
        if(currentPlayerColor.equals(Color.WHITE)) movePiece(whitePieces, move);
        movePiece(blackPieces, move);
        currentPlayerColor = currentPlayerColor.next();
    }

    private void movePiece(Pieces pieces, Move move) throws InvalidInputException {
       Piece piece = pieces.find(move.pieceType(), move.from());
        if(piece == null) throw new InvalidInputException("Invalid piece or position");
        if(!piece.isValidNextMove(move.to())) throw new InvalidInputException("Invalid destination");
        piece.move(move.to());
    }
}
