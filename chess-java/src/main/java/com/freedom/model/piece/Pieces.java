package com.freedom.model.piece;

import com.freedom.model.coord.Position;

import java.util.ArrayList;

public class Pieces extends ArrayList<Piece> {
    public Piece find(PieceType pieceType, Position from) {
        return this.stream()
                .filter(piece -> piece.match(pieceType, from))
                .findFirst()
                .orElse(null);
    }
}
