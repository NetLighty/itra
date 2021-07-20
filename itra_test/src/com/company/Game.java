package com.company;

public abstract class Game {

    public static void start(String[] args) throws Exception {
        checkArgs(args);
        Computer.makeTurn(args);
        Player.makeChoice(args);
        showResult(Player.getTurn(), Computer.getTurn(), args);
        Computer.showConvertedKey();

    }
private static void checkArgs(String[] args) throws Exception {
    Exception err= new Exception("""
                
         
             Неверный ввод параметров, нада шобы было
             нечетное кол-во(>=3) и без повторений
             примерно так: Камень Ножницы Бумага или 1 2 3 4 5 6 7
             или Камень Ножницы Бумага Спок Ящерица
                
                                                      """);
    for(int i=0; i<args.length-1; i++){
        for(int j=i+1; j< args.length-1; j++){
            if(args[i].equals(args[j])){throw err;}
        }
    }
    if(args.length<3||(args.length % 2)==0)
        throw err;
   }

   private static void showResult(int playerTurn, int computerTurn, String[] args){

        System.out.println("   Computer move: "+args[computerTurn-1]+"\n");
        int result= (((playerTurn-computerTurn) % args.length) + args.length) % args.length;//((x-y) % n) + n) % n
        if(result==0) System.out.println("   Draw.\n");
        if(result % 2 != 0) System.out.println("   You win!\n");
        if(result%2==0&&result!=0) System.out.println("   You lose...\n");
    }
 }
