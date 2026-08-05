package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Game;
import com.freedom.model.Move;
import com.freedom.model.Screen;
import com.freedom.model.piece.Color;
import org.springframework.stereotype.Service;

import java.util.Scanner;

@Service
public class GameService {

    private final Screen screen;
    private final Game game;
    private final Parser parser;

    public GameService(Screen screen, Game game) {
        this.screen = screen;
        this.game = game;
        this.parser = new SanNotationParser(game);
    }

    public void play() {
        screen.init(game.pieces);
        Scanner scanner = new Scanner(System.in);
        while (true) {
            screen.print(game.currentTurn());
            System.out.printf("%s's move: ", game.currentTurn());
            String rawMove = scanner.next();

            Move move;
            try {
                move = parser.parse(rawMove);
            } catch (InvalidInputException e) {
                System.out.println(e.getMessage());
                continue;
            }

            try {
                game.move(move);
            } catch (InvalidInputException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
