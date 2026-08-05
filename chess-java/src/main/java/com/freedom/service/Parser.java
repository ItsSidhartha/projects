package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Move;
import com.freedom.model.coord.Position;
import com.freedom.model.piece.PieceType;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Parser {

    private static final Pattern MOVE_PATTERN =
            Pattern.compile("^([KQRBN])?([a-h][1-8])x?([a-h][1-8])[+#]?$");

    public static Move parse(String rawMove) throws InvalidInputException {
        Matcher matcher = MOVE_PATTERN.matcher(rawMove.trim());
        if (!matcher.matches()) throw new InvalidInputException("Invalid move notation: " + rawMove);

        PieceType pieceType = pieceTypeFor(matcher.group(1));
        Position from = parseSquare(matcher.group(2));
        Position to = parseSquare(matcher.group(3));

        return new Move(pieceType, from, to);
    }

    private static PieceType pieceTypeFor(String letter) {
        if (letter == null) return PieceType.PAWN;
        return switch (letter) {
            case "K" -> PieceType.KING;
            case "Q" -> PieceType.QUEEN;
            case "R" -> PieceType.ROOK;
            case "B" -> PieceType.BISHOP;
            case "N" -> PieceType.KNIGHT;
            default -> throw new IllegalStateException("Unreachable, constrained by regex: " + letter);
        };
    }

    private static Position parseSquare(String square) throws InvalidInputException {
        return Position.at(square.charAt(0) - 'a', square.charAt(1) - '1')
                .orElseThrow(() -> new InvalidInputException("Invalid square: " + square));
    }
}
