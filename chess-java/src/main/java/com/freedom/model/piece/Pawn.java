package com.freedom.model.piece;

import com.freedom.model.coord.Offset;
import com.freedom.model.coord.Position;
import com.freedom.model.coord.Row;

import java.util.ArrayList;
import java.util.List;

public class Pawn implements Piece {
    public Position position;
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
        List<Offset> forwardOffsets = position.isAtRow(row)
                ? (color == Color.WHITE ? Offset.PAWN_DOUBLE_UP : Offset.PAWN_DOUBLE_DOWN)
                : List.of(forward);

        List<Position> moves = new ArrayList<>(MoveGeometry.offsets(position, forwardOffsets));
        moves.addAll(MoveGeometry.offsets(position, diagonalOffsets()));
        return moves;
    }

    @Override
    public List<Position> attackSquares() {
        return MoveGeometry.offsets(position, diagonalOffsets());
    }

    private List<Offset> diagonalOffsets() {
        return color == Color.WHITE
                ? List.of(Offset.UP_LEFT, Offset.UP_RIGHT)
                : List.of(Offset.DOWN_LEFT, Offset.DOWN_RIGHT);
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
        return color == Color.WHITE ? "♟" : "♙";
    }

    @Override
    public Position position() {
        return position;
    }

    @Override
    public PieceType type() {
        return type;
    }
}
