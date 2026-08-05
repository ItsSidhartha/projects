package com.freedom.model.coord;

import java.util.Optional;

public record Position(Col col, Row row ) {
    public static Optional<Position> at(int colOrdinal, int rowOrdinal) {
        return Col.fromOrdinal(colOrdinal)
                .flatMap(c -> Row.fromOrdinal(rowOrdinal).map(r -> new Position(c, r)));
    }

    public boolean isAtRow(Row row) {
        return this.row.equals(row);
    }
}
