package com.freedom.model.piece;

import com.freedom.model.coord.Position;

public class Queen implements Piece {
    private Position position;
    private final Color color;
    private final PieceType type = PieceType.QUEEN;

    public Queen(Position position, Color color) {
        this.position = position;
        this.color = color;
    }

    @Override
    public boolean isValidNextMove(Position position) {
        return false;
    }

    @Override
    public void move(Position position) {
        this.position = position;
    }

    @Override
    public boolean match(PieceType pieceType, Position from) {
        return from.equals(this.position) && pieceType.equals(type);
    }
}
