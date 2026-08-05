package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Move;
import com.freedom.model.coord.Position;
import com.freedom.model.piece.PieceType;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public interface Parser {
    Move parse(String rawMove)  throws InvalidInputException;
}
