

import java.util.Scanner;
import java.util.Hashtable;

public class Item {

    static class NoItemException extends Exception {}

    private String primaryName;
    private int weight;
    private Hashtable<String,String> messages;


    Item(Scanner s) throws NoItemException,
        Dungeon.IllegalDungeonFormatException {

        messages = new Hashtable<String,String>();

        // Read item name.
        primaryName = s.nextLine();
        if (primaryName.equals(Dungeon.TOP_LEVEL_DELIM)) {
            throw new NoItemException();
        }

        // Read item weight.
        weight = Integer.valueOf(s.nextLine());

        // Read and parse verbs lines, as long as there are more.
        String verbLine = s.nextLine();
        while (!verbLine.equals(Dungeon.SECOND_LEVEL_DELIM) && !verbLine.equals("-")) {
            if (verbLine.equals(Dungeon.TOP_LEVEL_DELIM)) {
                throw new Dungeon.IllegalDungeonFormatException("No '" +
                    Dungeon.SECOND_LEVEL_DELIM + "' after item.");
            }
            String[] verbParts = verbLine.split(":");
            messages.put(verbParts[0],verbParts[1]);
            
            verbLine = s.nextLine();
        }
    }

    boolean goesBy(String name) {
        // could have other aliases
        return this.primaryName.equals(name);
    }

    String getPrimaryName() { return primaryName; }

    public String getMessageForVerb(String verb) throws NoItemException {
        String retMessage= "";


        //now that keys could also contain other chars, like [], use contains to get correct message
        //Edit by David
        for(String key: messages.keySet()){
            if(key.contains(verb)){
                retMessage = messages.get(key);

                //if there's other effects, we need to execute them
                if(key.contains("[")){
                    secondaryCommands(key);
                }

            }


        }




        return retMessage;
    }


    /**
     * @author David
     */

    private void secondaryCommands(String key) throws NoItemException {
    String secondaryCommands = key.substring(key.indexOf('[') +1 ,key.indexOf(']'));
        String[] commands = secondaryCommands.split(",");


        for(int i = 0; i < commands.length; i++){

            String command = commands[i];

            if(command.contains("Wound")){
              GameState.instance().woundAdventurer(Integer.parseInt(command.substring(command.indexOf("(")+1,
                      command.indexOf(")"))));
            }
            if(command.contains("Score")){
                GameState.instance().addScore(Integer.parseInt(
                        command.substring(command.indexOf("(")+1,command.indexOf(")"))));
            }
            if(command.contains("Die")){
                GameState.instance().setAdventurersCurrentHealth(0);
                GameState.instance().setLoseCondition(true);
            }
            if(command.contains("Win")){
                GameState.instance().setWinCondition(true);
            }
            if(command.contains("Disappear")){
                GameState.instance().removeFromInventory(this);

                try {
                    GameState.instance().getDungeon().disappearItem(this.primaryName);
                } catch (NoItemException e) {
                    e.printStackTrace();
                }
            }
            //will remove the item from the inventory, the dungeon itself, and add the new item to the inventory.
            if(command.contains("Transform")){
                GameState.instance().removeFromInventory(this);

                GameState.instance().getDungeon().disappearItem(String.valueOf(this));

                Item newItem = GameState.instance().getDungeon().
                        getItem(command.substring(command.indexOf("(")+1, command.indexOf(")")));


                GameState.instance().addToInventory(newItem);
            }
            if(command.contains("Teleport")){
                GameState.instance().setAdventurersCurrentRoom(GameState.instance().getDungeon().getEntry());
                System.out.println(GameState.instance().getDungeon().getEntry().describe());
            }
        }


    }

    public String toString() {
        return primaryName;
    }

    public int getWeight(){return weight;}

    void setWeight(int dmg){
        this.weight = weight - dmg;
        if(this.weight ==0){
            if(this.goesBy("Troll")){
                try {
                    this.secondaryCommands("[Transform(Key)]");
                } catch (NoItemException e) {
                    e.printStackTrace();
                }
            }
            GameState.instance().getAdventurersCurrentRoom().remove(this);
        }
        else System.out.println("The " + this.getPrimaryName() + " is not happy you attacked it. It swings back" +
                "and hit you too. You lose some health");
    }
}