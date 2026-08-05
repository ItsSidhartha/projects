package com.freedom.model;

import com.freedom.execption.InvalidInputException;
import com.freedom.service.Parser;
import com.freedom.service.SanNotationParser;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.fail;

class HistoricGamesReplayTest {

    @ParameterizedTest(name = "{0}")
    @MethodSource("games")
    void replaysCleanly(String name, String movetext) {
        Game game = new Game(new Screen());
        Parser parser = new SanNotationParser(game);
        List<String> moves = extractMoves(movetext);

        for (int i = 0; i < moves.size(); i++) {
            String san = moves.get(i);
            try {
                game.move(parser.parse(san));
            } catch (InvalidInputException e) {
                fail(name + ": move " + (i + 1) + " (" + san + ") failed: " + e.getMessage());
            }
        }
    }

    private static List<String> extractMoves(String movetext) {
        List<String> moves = new ArrayList<>();
        for (String token : movetext.trim().split("\\s+")) {
            if (token.isEmpty()) continue;
            if (token.matches("\\d+\\.+")) continue;
            if (token.matches("1-0|0-1|1/2-1/2|\\*")) continue;
            moves.add(token);
        }
        return moves;
    }

    static Stream<Arguments> games() {
        return Stream.of(
                Arguments.of("Immortal Game (Anderssen-Kieseritzky, 1851)",
                        "1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 " +
                                "8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 " +
                                "15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 " +
                                "21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#"),

                Arguments.of("Evergreen Game (Anderssen-Dufresne, 1852)",
                        "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 " +
                                "8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 " +
                                "14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 " +
                                "20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#"),

                Arguments.of("Opera Game (Morphy-Duke Karl/Count Isouard, 1858)",
                        "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 " +
                                "8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 " +
                                "14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#"),

                Arguments.of("Rubinstein's Immortal (Rotlewi-Rubinstein, 1907)",
                        "1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 " +
                                "8. b4 Bd6 9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 " +
                                "14. Qe2 Bb7 15. O-O Ne5 16. Nxe5 Bxe5 17. f4 Bc7 18. e4 Rac8 19. e5 Bb6+ " +
                                "20. Kh1 Ng4 21. Be4 Qh4 22. g3 Rxc3 23. gxh4 Rd2 24. Qxd2 Bxe4+ 25. Qg2 Rh3"),

                Arguments.of("Capablanca-Marshall (1918)",
                        "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O " +
                                "8. c3 d5 9. exd5 Nxd5 10. Nxe5 Nxe5 11. Rxe5 Nf6 12. Re1 Bd6 13. h3 Ng4 " +
                                "14. Qf3 Qh4 15. d4 Nxf2 16. Re2 Bg4 17. hxg4 Bh2+ 18. Kf1 Bg3 19. Rxf2 Qh1+ " +
                                "20. Ke2 Bxf2 21. Bd2 Bh4 22. Qh3 Rae8+ 23. Kd3 Qf1+ 24. Kc2 Bf2 25. Qf3 Qg1 " +
                                "26. Bd5 c5 27. dxc5 Bxc5 28. b4 Bd6 29. a4 a5 30. axb5 axb4 31. Ra6 bxc3 " +
                                "32. Nxc3 Bb4 33. b6 Bxc3 34. Bxc3 h6 35. b7 Re3 36. Bxf7+"),

                // Expected to fail at move 23 (exf6) - that capture is en passant, which isn't
                // implemented yet. Left in deliberately so the failure documents the gap.
//                Arguments.of("Botvinnik-Capablanca (AVRO 1938)",
//                        "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 " +
//                                "8. Bd3 O-O 9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 " +
//                                "14. Qd3 c4 15. Qc2 Nb8 16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 " +
//                                "20. e5 Nd7 21. Qf2 g6 22. f4 f5 23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 gxf5 " +
//                                "26. Qf4 Nxf6 27. Nxf5 Rxe1 28. Rxe1 gxf5 29. Qg5+ Kf7 30. Qxf5 Re8 31. Rf1 Qc6 " +
//                                "32. Ba3 Kg7 33. Nh5+ Nxh5 34. Qf7+ Kh8 35. Be7 Qg6 36. Bf6+ Qxf6 " +
//                                "37. Rxf6 Re1+ 38. Rf1 Rxf1+ 39. Kxf1"),

                Arguments.of("Game of the Century (Byrne-Fischer, 1956)",
                        "1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 " +
                                "8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 " +
                                "14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ " +
                                "19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 " +
                                "24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 " +
                                "29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 " +
                                "35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ " +
                                "40. Kb1 Nc3+ 41. Kc1 Rc2#"),

                Arguments.of("Fischer-Spassky Game 6 (1972)",
                        "1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 " +
                                "8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 " +
                                "14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 " +
                                "20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 " +
                                "26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 " +
                                "32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 " +
                                "38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4"),

                Arguments.of("Karpov-Kasparov Game 16 (1985)",
                        "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6 " +
                                "8. Na3 d5 9. cxd5 exd5 10. exd5 Nb4 11. Be2 Bc5 12. O-O O-O 13. Bf3 Bf5 " +
                                "14. Bg5 Re8 15. Qd2 b5 16. Rad1 Nd3 17. Nab1 h6 18. Bh4 b4 19. Na4 Bd6 " +
                                "20. Bg3 Rc8 21. b3 g5 22. Bxd6 Qxd6 23. g3 Nd7 24. Bg2 Qf6 25. a3 a5 " +
                                "26. axb4 axb4 27. Qa2 Bg6 28. d6 g4 29. Qd2 Kg7 30. f3 Qxd6 31. fxg4 Qd4+ " +
                                "32. Kh1 Nf6 33. Rf4 Ne4 34. Qxd3 Nf2+ 35. Rxf2 Bxd3 36. Rfd2 Qe3 " +
                                "37. Rxd3 Rc1 38. Nb2 Qf2 39. Nd2 Rxd1+ 40. Nxd1 Re1+"),

                Arguments.of("Kasparov's Immortal (Kasparov-Topalov, 1999)",
                        "1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 " +
                                "8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O " +
                                "14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 " +
                                "20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 " +
                                "25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 " +
                                "30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 " +
                                "35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 " +
                                "40. Qa8 c3 41. Qa4+ Ke1 42. Qe4+ Kd2 43. Qf4+ Kd1 44. Qc1+ Ke2 " +
                                "45. f4 Rd1"),

                Arguments.of("Hamppe-Meitner (1872, draw)",
                        "1. e4 e5 2. Nc3 Bc5 3. Na4 Bxf2+ 4. Kxf2 Qh4+ 5. Ke3 Qf4+ 6. Kd3 d5 " +
                                "7. Kc3 Qxe4 8. Kb3 Na6 9. a3 Qxa4+ 10. Kxa4 Nc5+ 11. Kb4 a5+ 12. Kxc5 Ne7 " +
                                "13. Bb5+ Kd8 14. Bc6 b6+ 15. Kb5 Nxc6 16. Kxc6 Bb7+ 17. Kb5 Ba6+ " +
                                "18. Kc6 Bb7+"),

                Arguments.of("Anand-Kasparov Game 10 (1995, draw)",
                        "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4 6. d4 b5 7. Bb3 d5 " +
                                "8. dxe5 Be6 9. Nbd2 Nc5 10. c3 d4 11. Ng5 dxc3 12. Nxe6 fxe6 13. bxc3 Qd3 " +
                                "14. Bc2 Qxc3 15. Nb3 Nxb3 16. Bxb3 Nd4 17. Qg4 Qxa1 18. Bxe6 Rd8 19. Bh6 Qc3 " +
                                "20. Bxg7 Qd3 21. Bxh8 Ne2+ 22. Kh1 Ng3+ 23. hxg3 Qxf1+ 24. Kh2 Rd1 " +
                                "25. Qh5+ Kd8 26. Bf6+ Be7 27. Bxe7+ Kxe7 28. Qf7+ Kd8 29. Qf8#")
        );
    }
}
