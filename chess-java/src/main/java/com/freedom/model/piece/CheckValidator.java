package com.freedom.model.piece;

import com.freedom.model.coord.Position;

public class CheckValidator {

    public static boolean isSquareAttacked(Position square, Color byColor, AllPieces pieces) {
        for (Piece attacker : pieces.of(byColor)) {
            if (attacker.attackSquares().contains(square)
                    && PathValidator.isPathClear(attacker.position(), square, pieces.all())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isKingInCheck(Color kingColor, AllPieces pieces) {
        Piece king = pieces.of(kingColor).king();
        return isSquareAttacked(king.position(), kingColor.opposition(), pieces);
    }
}
