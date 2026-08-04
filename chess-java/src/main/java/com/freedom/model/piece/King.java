package com.freedom.model.piece;

import com.freedom.model.coord.Offset;
import com.freedom.model.coord.Position;

import java.util.List;

public class King implements Piece {
    private Position position;
    private final Color color;
    private final PieceType type = PieceType.KING;

    public King(Position position, Color color) {
        this.position = position;
        this.color = color;
    }

    @Override
    public void move(Position position) {
        this.position = position;
    }

    @Override
    public boolean match(PieceType pieceType, Position from) {
        return from.equals(this.position) && pieceType.equals(type);
    }

    @Override
    public List<Position> possibleMove() {
        return MoveGeometry.offsets(position, Offset.ALL_DIRECTIONS);
    }

    @Override
    public boolean isAt(Position position) {
        return this.position.equals(position);
    }

    @Override
    public boolean isColor(Color color) {
        return this.color == color;
    }
}
