package com.freedom.model;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.coord.Col;
import com.freedom.model.coord.Position;
import com.freedom.model.coord.Row;
import com.freedom.model.piece.*;
import org.springframework.stereotype.Component;

import java.util.List;

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
        if (move.castlingSide() != null) {
            performCastling(movingColor, move.castlingSide());
            return;
        }

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

        if (move.promotesTo() != null) {
            pieces.of(movingColor).remove(piece);
            piece = PieceFactory.create(move.promotesTo(), piece.position(), movingColor);
            pieces.of(movingColor).add(piece);
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

        Row promotionRow = movingColor == Color.WHITE ? Row.EIGHT : Row.ONE;
        boolean reachesBackRank = move.to().isAtRow(promotionRow);
        if (reachesBackRank && move.promotesTo() == null)
            throw new InvalidInputException("Pawn reaching the back rank must promote");
        if (!reachesBackRank && move.promotesTo() != null)
            throw new InvalidInputException("Cannot promote except on the back rank");
    }

    private void performCastling(Color movingColor, CastlingSide side) throws InvalidInputException {
        Row backRow = movingColor == Color.WHITE ? Row.ONE : Row.EIGHT;
        Position kingFrom = new Position(Col.E, backRow);
        Position rookFrom = new Position(side == CastlingSide.KINGSIDE ? Col.H : Col.A, backRow);
        Position kingTo = new Position(side == CastlingSide.KINGSIDE ? Col.G : Col.C, backRow);
        Position rookTo = new Position(side == CastlingSide.KINGSIDE ? Col.F : Col.D, backRow);
        Position passThrough = new Position(side == CastlingSide.KINGSIDE ? Col.F : Col.D, backRow);

        Piece king = pieces.of(movingColor).king();
        Piece rook = pieces.of(movingColor).at(rookFrom);

        validateCastlingPieces(king, rook, kingFrom);
        validateCastlingPath(side, backRow);
        validateCastlingSafety(movingColor, kingFrom, passThrough, kingTo);

        moveCastlingPieces(king, rook, kingTo, rookTo);
    }

    private void validateCastlingPieces(Piece king, Piece rook, Position kingFrom) throws InvalidInputException {
        if (king == null || !king.isAt(kingFrom) || king.hasMoved())
            throw new InvalidInputException("King is not in position to castle");
        if (rook == null || rook.type() != PieceType.ROOK || rook.hasMoved())
            throw new InvalidInputException("Rook is not in position to castle");
    }

    private void validateCastlingPath(CastlingSide side, Row backRow) throws InvalidInputException {
        List<Col> betweenCols = side == CastlingSide.KINGSIDE
                ? List.of(Col.F, Col.G)
                : List.of(Col.B, Col.C, Col.D);
        for (Col col : betweenCols) {
            if (!PathValidator.isEmpty(new Position(col, backRow), pieces.all()))
                throw new InvalidInputException("Castling path is blocked");
        }
    }

    private void validateCastlingSafety(Color movingColor, Position kingFrom, Position passThrough, Position kingTo)
            throws InvalidInputException {
        Color opponent = movingColor.opposition();
        if (CheckValidator.isSquareAttacked(kingFrom, opponent, pieces))
            throw new InvalidInputException("Cannot castle while in check");
        if (CheckValidator.isSquareAttacked(passThrough, opponent, pieces))
            throw new InvalidInputException("Cannot castle through a square under attack");
        if (CheckValidator.isSquareAttacked(kingTo, opponent, pieces))
            throw new InvalidInputException("Cannot castle into a square under attack");
    }

    private void moveCastlingPieces(Piece king, Piece rook, Position kingTo, Position rookTo) {
        screen.clearSquare(king.position());
        screen.clearSquare(rook.position());
        king.move(kingTo);
        rook.move(rookTo);
        screen.setSquare(king.position(), king.symbol());
        screen.setSquare(rook.position(), rook.symbol());
    }

    public Color currentTurn() {
        return currentPlayerColor;
    }
}
