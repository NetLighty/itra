package com.company;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public abstract class Computer {
    private static int turn;
    private static byte[] key;

    public static void makeTurn(String[] args) throws NoSuchAlgorithmException, InvalidKeyException {
        //a: 1   b: (args.length)
        //(int)(( Math.random() * (b - a + 1) + a)
        generateKey();
        turn=(int)(Math.random()*(args.length)+1);
        System.out.println("\n  HMAC: "+getHmac(args[turn-1], key));
    }
    public static void showConvertedKey(){
        System.out.println("   HMAC key: "+convertBytesToHex(key));
    }
    private static void generateKey() {
        SecureRandom secRandom=new SecureRandom();
        key= new byte[16];
        secRandom.nextBytes(key);
    }

    private static String convertBytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length);
        for(byte b: bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static String getHmac(String data, byte[] key) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac signer= Mac.getInstance("HmacSHA3-256");
        SecretKeySpec keySpec= new SecretKeySpec(key, "HmacSHA3-256");
        signer.init(keySpec);
        byte[] hmac= signer.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return convertBytesToHex(hmac);
    }


    public static int getTurn() {
        return turn;
    }
}
