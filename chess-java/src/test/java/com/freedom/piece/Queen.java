package com.freedom.piece;

import com.freedom.model.Position;

public class Queen implements ChessPiece{
    private final Position position;
    private final Color color;

    public Queen(Position position, Color color) {
        this.position = position;
        this.color = color;
    }
}
