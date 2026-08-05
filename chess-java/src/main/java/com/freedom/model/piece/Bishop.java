package com.freedom.model.piece;

import com.freedom.model.coord.Offset;
import com.freedom.model.coord.Position;

import java.util.List;

public class Bishop implements Piece {
    private Position position;
    private final Color color;
    private final PieceType type = PieceType.BISHOP;
    private boolean hasMoved = false;

    public Bishop(Position position, Color color) {
        this.position = position;
        this.color = color;
    }

    @Override
    public void move(Position position) {
        this.position = position;
        this.hasMoved = true;
    }

    @Override
    public boolean match(PieceType pieceType, Position from) {
        return from.equals(this.position) && pieceType.equals(type);
    }

    @Override
    public List<Position> possibleMove() {
        return MoveGeometry.slide(position, Offset.DIAGONAL);
    }

    @Override
    public boolean isAt(Position position) {
        return this.position.equals(position);
    }

    @Override
    public boolean isColor(Color color) {
        return this.color == color;
    }

    @Override
    public String symbol() {
        return color == Color.WHITE ? "♝" : "♗";
    }

    @Override
    public Position position() {
        return position;
    }

    @Override
    public PieceType type() {
        return type;
    }

    @Override
    public boolean hasMoved() {
        return hasMoved;
    }
}
