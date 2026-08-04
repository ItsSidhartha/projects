package com.freedom.model.piece;

public enum Color {
    WHITE, BLACK;

    public Color next() {
        if (this.equals(WHITE)) return BLACK;
        return WHITE;
    }
}
