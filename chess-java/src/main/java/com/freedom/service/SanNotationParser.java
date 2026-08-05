package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Game;
import com.freedom.model.Move;
import com.freedom.model.coord.Col;
import com.freedom.model.coord.Position;
import com.freedom.model.coord.Row;
import com.freedom.model.piece.PathValidator;
import com.freedom.model.piece.Piece;
import com.freedom.model.piece.PieceType;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class SanNotationParser implements Parser {

    private static final Pattern CASTLE_PATTERN = Pattern.compile("^O-O(-O)?[+#]?$");
    private static final Pattern MOVE_PATTERN =
            Pattern.compile("^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[QRBN])?[+#]?$");

    private final Game game;

    public SanNotationParser(Game game) {
        this.game = game;
    }

    @Override
    public Move parse(String rawMove) throws InvalidInputException {
        String trimmed = rawMove.trim();
        if (CASTLE_PATTERN.matcher(trimmed).matches())
            throw new InvalidInputException("Castling is not yet supported: " + trimmed);

        Matcher matcher = MOVE_PATTERN.matcher(trimmed);
        if (!matcher.matches()) throw new InvalidInputException("Invalid move notation: " + trimmed);
        if (matcher.group(6) != null)
            throw new InvalidInputException("Pawn promotion is not yet supported: " + trimmed);

        PieceType pieceType = pieceTypeFor(matcher.group(1));
        Col fileHint = matcher.group(2) == null ? null : Col.valueOf(matcher.group(2).toUpperCase());
        Row rankHint = matcher.group(3) == null ? null : Row.fromInt(Integer.parseInt(matcher.group(3)));
        Position destination = parseSquare(matcher.group(5));

        List<Piece> candidates = game.pieces.of(game.currentTurn()).stream()
                .filter(piece -> piece.type() == pieceType)
                .filter(piece -> fileHint == null || piece.position().col() == fileHint)
                .filter(piece -> rankHint == null || piece.position().row() == rankHint)
                .filter(piece -> piece.isValidNextMove(destination)
                        && PathValidator.isPathClear(piece.position(), destination, game.pieces.all()))
                .toList();

        if (candidates.isEmpty())
            throw new InvalidInputException("No " + pieceType + " can move to " + matcher.group(5));
        if (candidates.size() > 1)
            throw new InvalidInputException("Ambiguous move to " + matcher.group(5) + " - specify which "
                    + pieceType + " (" + describeCandidates(candidates) + ")");

        return new Move(pieceType, candidates.getFirst().position(), destination);
    }

    private String describeCandidates(List<Piece> candidates) {
        return candidates.stream()
                .map(piece -> piece.position().col().toString().toLowerCase() + piece.position().row().value())
                .collect(Collectors.joining(" or "));
    }

    private PieceType pieceTypeFor(String letter) {
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

    private Position parseSquare(String square) throws InvalidInputException {
        return Position.at(square.charAt(0) - 'a', square.charAt(1) - '1')
                .orElseThrow(() -> new InvalidInputException("Invalid square: " + square));
    }
}
