package com.company;


import java.util.Scanner;

public abstract class Player {

    private static int turn;

    public static void makeChoice(String[] args) {

        System.out.println("\n  Available moves: \n");
        Scanner sc = new Scanner(System.in);

        while (true) {
            for (int i = 0; i < args.length; i++) {
                System.out.println("  " + (i + 1) + " - " + args[i] + "\n");
            }
            System.out.println("  0 - exit\n");
            System.out.print("   Enter your move: ");
            if (!sc.hasNextInt()) {
                System.out.println();
                sc.next();
                continue;
            }
            turn = sc.nextInt();
            System.out.println();
            if (turn > args.length || turn < 0) continue;
            if (turn == 0) break;
            System.out.println("   Your move: " + args[turn - 1]+"\n");
            break;
        }
   }

    public static int getTurn() {
        return turn;
    }
}

