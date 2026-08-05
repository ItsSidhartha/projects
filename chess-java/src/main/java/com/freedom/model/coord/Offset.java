package com.freedom.model.coord;

import java.util.List;

public record Offset(int colDelta, int rowDelta) {
    public static final Offset UP = new Offset(0, 1);
    public static final Offset DOWN = new Offset(0, -1);
    public static final Offset LEFT = new Offset(-1, 0);
    public static final Offset RIGHT = new Offset(1, 0);
    public static final Offset UP_LEFT = new Offset(-1, 1);
    public static final Offset UP_RIGHT = new Offset(1, 1);
    public static final Offset DOWN_LEFT = new Offset(-1, -1);
    public static final Offset DOWN_RIGHT = new Offset(1, -1);

    public static final List<Offset> PAWN_DOUBLE_UP = List.of(UP, new Offset(0, 2));
    public static final List<Offset> PAWN_DOUBLE_DOWN = List.of(DOWN, new Offset(0, -2));

    public static final List<Offset> ORTHOGONAL = List.of(UP, DOWN, LEFT, RIGHT);
    public static final List<Offset> DIAGONAL = List.of(UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT);
    public static final List<Offset> ALL_DIRECTIONS =
            List.of(UP, DOWN, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT);
    public static final List<Offset> KNIGHT_JUMPS = List.of(
            new Offset(1, 2), new Offset(2, 1), new Offset(2, -1), new Offset(1, -2),
            new Offset(-1, -2), new Offset(-2, -1), new Offset(-2, 1), new Offset(-1, 2)
    );
}
