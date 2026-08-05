package com.freedom.model.piece;

import com.freedom.model.coord.Offset;
import com.freedom.model.coord.Position;
import com.freedom.model.coord.Row;

import java.util.List;

public class Pawn implements Piece {
    private Position position;
    private final Color color;
    private final PieceType type = PieceType.PAWN;

    public Pawn(Position position, Color color) {
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
        Offset forward = color == Color.WHITE ? Offset.UP : Offset.DOWN;
        Row row = color == Color.WHITE ? Row.TWO : Row.SEVEN;
        if (position.isAtRow(row)) {
            List<Offset> offsets = color == Color.WHITE ? Offset.PAWN_DOUBLE_UP : Offset.PAWN_DOUBLE_DOWN;
            return MoveGeometry.offsets(position, offsets);
        }
        return MoveGeometry.offsets(position, List.of(forward));
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
