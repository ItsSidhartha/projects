package com.freedom.piece;

import com.freedom.model.Position;

public class Bishop implements ChessPiece{
    private final Position position;
    private final Color color;

    public Bishop(Position position, Color color) {
        this.position = position;
        this.color = color;
    }
}
