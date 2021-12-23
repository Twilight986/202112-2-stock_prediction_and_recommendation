package org.launchcode.stocks.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by cbay on 5/15/15.
 *
 * Based on approach outlined at http://viralpatel.net/blogs/java-md5-hashing-salting-password/
 */
public class PasswordHash {

    private static final String salt = "asdf";

    public static String getHash(String password){

        // Create a one-way hash of a password

        String hash = null;
        String saltedPassword = applySalt(password);

        if(null == password) return null;

        try {
            //Create MessageDigest object for MD5
            MessageDigest digest = MessageDigest.getInstance("MD5");

            //Update input string in message digest
            digest.update(saltedPassword.getBytes(), 0, saltedPassword.length());

            //Converts message digest value in base 16 (hex)
            hash = new BigInteger(1, digest.digest()).toString(16);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return hash;

    }

    private static String applySalt(String password) {
        return password + salt;
    }

    public static boolean isValidPassword(String password, String hash) {

        // Determine whether or not hash represents password
        String hashedPassword = getHash(password);
        return hashedPassword.equals(hash);

    }

}
