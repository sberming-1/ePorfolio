

import java.util.Scanner;


public class Interpreter {

    private static GameState state; // not strictly necessary; GameState is 
    // singleton

    public static String USAGE_MSG =
            "Usage: Interpreter borkFile.bork|saveFile.sav.";

    public static void main(String args[]) {

        if (args.length < 1) {
            System.err.println(USAGE_MSG);
            System.exit(1);
        }

        String command;
        Scanner commandLine = new Scanner(System.in);

        try {
            state = GameState.instance();
            if (args[0].endsWith(".bork")) {
                state.initialize(new Dungeon(args[0]));
                System.out.println("\nWelcome to " +
                        state.getDungeon().getName() + "!");
            } else if (args[0].endsWith(".sav")) {
                state.restore(args[0]);
                System.out.println("\nWelcome back to " +
                        state.getDungeon().getName() + "!");
            } else {
                System.err.println(USAGE_MSG);
                System.exit(2);
            }

            System.out.print("\n" +
                    state.getAdventurersCurrentRoom().describe() + "\n");

            command = promptUser(commandLine);


            while (!command.equals("q")) {

                System.out.print(
                        CommandFactory.instance().parse(command).execute());

                if(state.getWinCondition() == true || state.getLoseCondition() == true
                        || state.getAdventurersCurrentHealth() <= 14) {break;}
                command = promptUser(commandLine);
            }
            if(state.getCurrentScore() >= 89){state.setWinCondition(true);}
            if(state.getAdventurersCurrentHealth()<=25){state.setLoseCondition(true);};
            if(state.getLoseCondition() == true){GameState.instance().setAdventurersCurrentHealth(0);}

            if (state.getWinCondition() == true){
                System.out.println("Winner winner. Chicken Dinner.");
                System.out.println("Final room: " + state.getAdventurersCurrentRoom().getTitle());
                System.out.println("Final score: " + state.getCurrentScore());
                System.out.println("Final health: " + state.getAdventurersCurrentHealth());
                System.out.println("Final inventory: " + state.getInventoryNames());

            }

            if (state.getLoseCondition() == true){
                System.out.println("You are officially a loser.");
                System.out.println("Final room " + state.getAdventurersCurrentRoom().getTitle());
                System.out.println("Final score: " + state.getCurrentScore());
                System.out.println("Final health: " + state.getAdventurersCurrentHealth());
                System.out.println("Final inventory: " + state.getInventoryNames());
            }


            System.out.println("Bye!");

        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    private static String promptUser(Scanner commandLine) {

        System.out.print("> ");
        return commandLine.nextLine();
    }


}
