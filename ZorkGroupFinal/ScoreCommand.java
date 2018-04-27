
/**
 * A class that keeps the users current score throughout the game.
 * 
 * @author Dylon Garrett, Sean Bermingham, Cris Guzman
 * @version ZorkV1
 */
public class ScoreCommand extends Command
{

   /**
    * A constructor that takes int value of the users point total.
    * @param - points
    *
    */
   public ScoreCommand(){
    
    }
   
   /**
    * A method that is extended from the abstract Command class and returns a string with a 
    * score and a message.
    * @return - String
    */
   public String execute(){
       int i = GameState.instance().getCurrentScore();
       String rank;
       if(i > 90){rank = "You are the greatest wizard of all time";}
       else if(90>=i && i>75){rank = "You could be a professor";}
       else if(75>=i && i> 50){rank = "You are at the top of your class";}
       else if(50>=i && i>25){rank = "Keep doing well";}
       else{rank = "You are just getting started";}
       return Integer.toString(i) + " " +rank +"\n";
   }
}
