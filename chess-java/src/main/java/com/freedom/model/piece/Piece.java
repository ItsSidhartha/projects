package com.freedom.model.piece;

import com.freedom.model.coord.Position;

import java.util.List;

public interface Piece {
    default boolean isValidNextMove(Position position) {
        return possibleMove().contains(position);
    }

    void move(Position position);

    boolean match(PieceType pieceType, Position from);

    List<Position> possibleMove();

    boolean isAt(Position position);

    boolean isColor(Color color);
}
