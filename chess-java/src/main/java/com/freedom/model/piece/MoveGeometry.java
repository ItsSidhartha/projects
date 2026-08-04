package com.freedom.model.piece;

import com.freedom.model.coord.Offset;
import com.freedom.model.coord.Position;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

final class MoveGeometry {

    static List<Position> slide(Position from, List<Offset> directions) {
        List<Position> moves = new ArrayList<>();
        for (Offset direction : directions) {
            int col = from.col().ordinal() + direction.colDelta();
            int row = from.row().ordinal() + direction.rowDelta();
            Optional<Position> next = Position.at(col, row);
            while (next.isPresent()) {
                moves.add(next.get());
                col += direction.colDelta();
                row += direction.rowDelta();
                next = Position.at(col, row);
            }
        }
        return moves;
    }

    static List<Position> offsets(Position from, List<Offset> offsets) {
        List<Position> moves = new ArrayList<>();
        for (Offset offset : offsets) {
            Position.at(from.col().ordinal() + offset.colDelta(), from.row().ordinal() + offset.rowDelta())
                    .ifPresent(moves::add);
        }
        return moves;
    }
}
