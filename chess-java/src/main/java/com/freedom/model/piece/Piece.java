package com.freedom.model.piece;

import com.freedom.model.coord.Position;

import java.util.List;

public interface Piece {
    boolean isValidNextMove(Position position);

    void move(Position position);

    boolean match(PieceType pieceType, Position from);

    List<Position> possibleMove();
}
