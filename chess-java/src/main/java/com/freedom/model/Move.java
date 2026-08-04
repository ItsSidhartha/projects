package com.freedom.model;

import com.freedom.model.coord.Position;
import com.freedom.model.piece.PieceType;

public record Move(PieceType pieceType, Position from, Position to) {
}
