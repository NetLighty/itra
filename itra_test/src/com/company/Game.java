package com.company;

import java.util.Scanner;

public abstract class Game {
    private static String[] verifiedArgs;

    public static void start() throws Exception {
            checkArgs(verifiedArgs);
            Computer.makeTurn(verifiedArgs);
            System.out.println("\n  Available moves: \n");
            int playerTurn;
            Scanner sc = new Scanner(System.in);

            while (true) {
                for (int i = 0; i < verifiedArgs.length; i++) {
                    System.out.println("  " + (i + 1) + " - " + verifiedArgs[i] + "\n");
                }
                System.out.println("  0 - exit\n");
                System.out.print("   Enter your move: ");
                if (!sc.hasNextInt()) {
                    System.out.println();
                    sc.next();
                    continue;
                }
                playerTurn = sc.nextInt();
                System.out.println();
                if (playerTurn > verifiedArgs.length || playerTurn < 0) continue;
                if (playerTurn == 0) break;
                System.out.println("   Your move: " + verifiedArgs[playerTurn - 1]+"\n");
                showResult(playerTurn, Computer.getTurn(), verifiedArgs);
                Computer.showConvertedKey();
                break;
        }
    }
public static void checkArgs(String[] args) throws Exception {
    Exception err= new Exception("""
                
         
             Неверный ввод параметров, нада шобы было
             нечетное кол-во(>=3) и без повторений
             примерно так: Камень Ножницы Бумага или 1 2 3 4 5 6 7
             или Камень Ножницы Бумага Спок Ящерица
                
                                                      """);
    for(int i=0; i<args.length-1; i++){
        for(int j=i+1; j< args.length; j++){
            if(args[i].equals(args[j])){throw err;}
        }
    }
    if(args.length<3||(args.length % 2)==0)
        throw err;
    verifiedArgs=args;
   }

   private static void showResult(int playerTurn, int computerTurn, String[] args){

        System.out.println("   Computer move: "+args[computerTurn-1]+"\n");
        int result= (((playerTurn-computerTurn) % args.length) + args.length) % args.length;//((x-y) % n) + n) % n
        if(result==0) System.out.println("   Draw.\n");
        if(result % 2 != 0) System.out.println("   You win!\n");
        if(result%2==0&&result!=0) System.out.println("   You lose...\n");
    }
 }
