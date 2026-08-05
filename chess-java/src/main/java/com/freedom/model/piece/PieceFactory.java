package com.freedom.model.piece;

import com.freedom.model.coord.Col;
import com.freedom.model.coord.Position;
import com.freedom.model.coord.Row;

public class PieceFactory {

    public static Pieces initWhitePieces() {
        return initPieces(Color.WHITE, Row.ONE, Row.TWO);
    }

    public static Pieces initBlackPieces() {
        return initPieces(Color.BLACK, Row.EIGHT, Row.SEVEN);
    }

    private static Pieces initPieces(Color color, Row backRow, Row pawnRow) {
        Pieces pieces = new Pieces();

        pieces.add(new Rook(new Position(Col.A, backRow), color));
        pieces.add(new Knight(new Position(Col.B, backRow), color));
        pieces.add(new Bishop(new Position(Col.C, backRow), color));
        pieces.add(new Queen(new Position(Col.D, backRow), color));
        pieces.add(new King(new Position(Col.E, backRow), color));
        pieces.add(new Bishop(new Position(Col.F, backRow), color));
        pieces.add(new Knight(new Position(Col.G, backRow), color));
        pieces.add(new Rook(new Position(Col.H, backRow), color));

        for (Col col : Col.values()) {
            pieces.add(new Pawn(new Position(col, pawnRow), color));
        }

        return pieces;
    }
}
