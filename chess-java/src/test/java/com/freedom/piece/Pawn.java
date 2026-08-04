package com.freedom.piece;

import com.freedom.model.Position;

public class Pawn implements ChessPiece{
    private final Position position;
    private final Color color;

    public Pawn(Position position, Color color) {
        this.position = position;
        this.color = color;
    }
}
