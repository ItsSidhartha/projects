package com.freedom.service;

import com.freedom.execption.InvalidInputException;
import com.freedom.model.Move;

public class Validator {
    public static Move validate(String rawMove) throws InvalidInputException {
        if(isValid()) throw new InvalidInputException("Invalid Input");
        return null;
    }

    private static boolean isValid() {
        return false;
    }
}
