package com.freedom.model.coord;

import java.util.Optional;

public enum Row {
    ONE(1), TWO(2), THREE(3), FOUR(4),
    FIVE(5), SIX(6), SEVEN(7), EIGHT(8);

    private final int value;

    Row(int value) {
        this.value = value;
    }

    public int value() {
        return value;
    }

    public static Row fromInt(int value) {
        if (value < 1 || value > 8) {
            throw new IllegalArgumentException("Value must be between 1 and 8, got: " + value);
        }

        return values()[value - 1];
    }

    public static Optional<Row> fromOrdinal(int ordinal) {
        if (ordinal < 0 || ordinal > 7) return Optional.empty();
        return Optional.of(values()[ordinal]);
    }
}
