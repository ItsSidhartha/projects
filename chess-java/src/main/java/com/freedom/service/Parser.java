package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Move;

public class Validator {
    public static Move validate(String rawMove) throws InvalidInputException {
        if(!isValid(rawMove)) throw new InvalidInputException("Invalid Input");
        return null;
    }

    private static boolean isValid(String rawMove) {
        return false;
    }
}
