package com.freedom.model.piece;

import java.util.ArrayList;
import java.util.List;

public class AllPieces {
    private final Pieces white;
    private final Pieces black;

    public AllPieces(Pieces white, Pieces black) {
        this.white = white;
        this.black = black;
    }

    public Pieces of(Color color) {
        return color == Color.WHITE ? white : black;
    }

    public List<Piece> all() {
        List<Piece> combined = new ArrayList<>(white);
        combined.addAll(black);
        return combined;
    }
}
