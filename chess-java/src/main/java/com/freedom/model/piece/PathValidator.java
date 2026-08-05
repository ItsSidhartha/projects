package com.freedom.model.piece;

import com.freedom.model.coord.Position;

import java.util.ArrayList;
import java.util.List;

public class PathValidator {

    public static boolean isPathClear(Position from, Position to, List<Piece> allPieces) {
        List<Position> between = squaresBetween(from, to);
        for (Position square : between) {
            for (Piece piece : allPieces) {
                if (piece.isAt(square)) return false;
            }
        }
        return true;
    }

    public static boolean isDestinationFree(Position to, Color movingColor, List<Piece> allPieces) {
        for (Piece piece : allPieces) {
            if (piece.isAt(to) && piece.isColor(movingColor)) return false;
        }
        return true;
    }

    private static List<Position> squaresBetween(Position from, Position to) {
        int colDelta = to.col().ordinal() - from.col().ordinal();
        int rowDelta = to.row().ordinal() - from.row().ordinal();

        boolean isStraightOrDiagonal =
                colDelta == 0 || rowDelta == 0 || Math.abs(colDelta) == Math.abs(rowDelta);

        int steps = Math.max(Math.abs(colDelta), Math.abs(rowDelta));
        if (!isStraightOrDiagonal || steps <= 1) {
            return List.of();
        }

        int colStep = Integer.signum(colDelta);
        int rowStep = Integer.signum(rowDelta);

        List<Position> between = new ArrayList<>();
        for (int i = 1; i < steps; i++) {
            int colOrdinal = from.col().ordinal() + colStep * i;
            int rowOrdinal = from.row().ordinal() + rowStep * i;
            Position.at(colOrdinal, rowOrdinal).ifPresent(between::add);
        }
        return between;
    }

    public static boolean isCapturing(Position to, Pieces pieces) {
        for (Piece piece : pieces) {
            if(piece.isAt(to)) return true;
        }
        return false;
    }

    public static boolean isEmpty(Position position, List<Piece> allPieces) {
        for (Piece piece : allPieces) {
            if (piece.isAt(position)) return false;
        }
        return true;
    }

}
