package com.freedom.piece;

import com.freedom.model.Position;

public class King implements ChessPiece{
    private final Position position;
    private final Color color;

    public King(Position position, Color color) {
        this.position = position;
        this.color = color;
    }
}
