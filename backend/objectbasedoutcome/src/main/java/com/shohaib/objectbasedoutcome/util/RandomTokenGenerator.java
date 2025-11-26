package com.shohaib.objectbasedoutcome.util;

import java.util.Random;

public class RandomTokenGenerator {
    public static String generate(int length){
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$!.1234567890";
        StringBuilder salt = new StringBuilder();
        Random random = new Random();
        while(salt.length() < length){
            int index = (int) (random.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;
    }
}
