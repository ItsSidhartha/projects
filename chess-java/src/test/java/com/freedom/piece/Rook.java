package com.freedom.piece;

import com.freedom.model.Position;

public class Rook implements ChessPiece{
    private final Position position;
    private final Color color;

    public Rook(Position position, Color color) {
        this.position = position;
        this.color = color;
    }
}
