package com.freedom.model;

import com.freedom.model.coord.Position;
import com.freedom.model.piece.AllPieces;
import com.freedom.model.piece.Color;
import com.freedom.model.piece.Piece;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class Screen {
    private String[][] squares;
    private int rows = 8;
    private int cols = 8;

    public Screen() {
        this.squares = new String[rows][cols];

        for (String[] row : this.squares) {
            Arrays.fill(row, " ");
        }
    }

    void setSquare(Position position, String symbol) {
        int row = position.row().value() - 1;
        int col = position.col().ordinal();
        squares[row][col] = symbol;
    }

    public void print(Color color) {
        if (color.equals(Color.WHITE)) whiteView();
        else blackView();
    }

    private void blackView() {
        StringBuilder stringBuilder = new StringBuilder();
        for (String[] row : squares) {
            for (int i = squares.length - 1; i >= 0; i--) {
                String square = row[i];
                stringBuilder.append(square);
            }
            stringBuilder.append("\n");
        }
        System.out.println(stringBuilder);
    }

    private void whiteView() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = squares.length - 1; i >= 0; i--) {
            String[] row = squares[i];
            for (String square : row) {
                stringBuilder.append(square);
            }
            stringBuilder.append("\n");
        }
        System.out.println(stringBuilder);
    }

    public void init(AllPieces pieces) {
        for (Piece piece : pieces.all()) {
            setSquare(piece.position(), piece.symbol());
        }
    }

    public void clearSquare(Position position) {
        int row = position.row().value() - 1;
        int col = position.col().ordinal();
        squares[row][col] = " ";
    }
}
