package com.freedom.model;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.piece.*;

public class Game {
    private final AllPieces pieces = new AllPieces(PieceFactory.initWhitePieces(), PieceFactory.initBlackPieces());
    private Color currentPlayerColor = Color.WHITE;
    public static Game create() {
        return new Game();
    }

    public void move(Move move) throws InvalidInputException {
        if(currentPlayerColor.equals(Color.WHITE)) movePiece(Color.WHITE, move);
        movePiece(Color.BLACK, move);
        currentPlayerColor = currentPlayerColor.next();
    }

    private void movePiece(Color movingColor, Move move) throws InvalidInputException {
        Piece piece = pieces.of(movingColor).find(move.pieceType(), move.from());
        if(piece == null) throw new InvalidInputException("Invalid piece or position");
        if(!piece.isValidNextMove(move.to())) throw new InvalidInputException("Invalid destination");

        if (!PathValidator.isPathClear(move.from(), move.to(), pieces.all()))
            throw new InvalidInputException("Path is blocked");
        if (!PathValidator.isDestinationFree(move.to(), movingColor, pieces.all()))
            throw new InvalidInputException("Destination occupied by own piece");

        piece.move(move.to());
    }
}
