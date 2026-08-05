package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Game;
import com.freedom.model.Move;

import java.util.Scanner;

public class GameService {

    public static void play() {
        Game game = Game.create();
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("Enter Move : ");
            String rawMove = scanner.next();

            Move move;
            try {
                move = Parser.parse(rawMove);
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
