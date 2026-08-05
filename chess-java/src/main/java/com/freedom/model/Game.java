package com.freedom.model;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.coord.Position;
import com.freedom.model.piece.*;
import org.springframework.stereotype.Component;

@Component
public class Game {
    public final AllPieces pieces = new AllPieces(PieceFactory.initWhitePieces(), PieceFactory.initBlackPieces());
    private final Screen screen;
    private Color currentPlayerColor = Color.WHITE;

    public Game(Screen screen) {
        this.screen = screen;
    }

    public void move(Move move) throws InvalidInputException {
        movePiece(currentPlayerColor, move);
        currentPlayerColor = currentPlayerColor.opposition();
    }

    private void movePiece(Color movingColor, Move move) throws InvalidInputException {
        Piece piece = pieces.of(movingColor).find(move.pieceType(), move.from());
        if (piece == null) throw new InvalidInputException("Invalid piece or position");

        if (piece.type() == PieceType.PAWN) {
            validatePawnMove(piece, movingColor, move);
        } else {
            validateMove(piece, movingColor, move);
        }

        Position originalPosition = piece.position();
        Piece capturedPiece = pieces.of(movingColor.opposition()).at(move.to());
        if (capturedPiece != null) pieces.of(movingColor.opposition()).remove(capturedPiece);

        piece.move(move.to());

        if (CheckValidator.isKingInCheck(movingColor, pieces)) {
            piece.move(originalPosition);
            if (capturedPiece != null) pieces.of(movingColor.opposition()).add(capturedPiece);
            throw new InvalidInputException("Move would leave king in check");
        }

        screen.clearSquare(originalPosition);
        screen.setSquare(piece.position(), piece.symbol());
    }

    private void validateMove(Piece piece, Color movingColor, Move move) throws InvalidInputException {
        if (!piece.isValidNextMove(move.to())) throw new InvalidInputException("Invalid destination");
        if (!PathValidator.isPathClear(move.from(), move.to(), pieces.all())) throw new InvalidInputException("Path is blocked");
        if (!PathValidator.isDestinationFree(move.to(), movingColor, pieces.all())) throw new InvalidInputException("Destination occupied by own piece");
    }

    private void validatePawnMove(Piece piece, Color movingColor, Move move) throws InvalidInputException {
        if (!piece.isValidNextMove(move.to())) throw new InvalidInputException("Invalid destination");
        if (!PathValidator.isPathClear(move.from(), move.to(), pieces.all())) throw new InvalidInputException("Path is blocked");

        boolean isDiagonalMove = move.from().col() != move.to().col();
        if (isDiagonalMove) {
            if (!PathValidator.isCapturing(move.to(), pieces.of(movingColor.opposition())))
                throw new InvalidInputException("Pawn can only move diagonally to capture");
        } else {
            if (!PathValidator.isEmpty(move.to(), pieces.all()))
                throw new InvalidInputException("Pawn cannot capture by moving forward");
        }
    }

    public Color currentTurn() {
        return currentPlayerColor;
    }
}
