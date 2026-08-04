package com.freedom.model.coord;

import java.util.Optional;

public enum Col {
    A, B, C, D, E, F, G, H;

    public static Optional<Col> fromOrdinal(int ordinal) {
        if (ordinal < 0 || ordinal > 7) return Optional.empty();
        return Optional.of(values()[ordinal]);
    }
}
