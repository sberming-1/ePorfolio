/**
 * Created by David.
 *
 * This class will take the name of the NPC which is being attacked, change its weight (which we are cleverly using
 * as its health), and also causes damage to the adventurer by the NPC's (if they are capable of doing damage)
 *
 */
public class AttackCommand extends Command {
    private String itemName;
    private Item target = null;

    public AttackCommand(String itemName) {
        this.itemName = itemName;
    }


    /**
     *
     * This execute should call the changeWeight method of the NPC class in order to do damage to the NPC,
     * as well as do damage to the adventurer by calling the wound method in the GameState.
     *
     * @return
     */

    @Override
    String execute() throws Item.NoItemException {
        if (itemName == null || itemName.trim().length() == 0) {
            return "Attack what?\n";
        }
        if(GameState.instance().getItemFromInventoryNamed("Sword") != null) {
            try {
                Room currentRoom =
                        GameState.instance().getAdventurersCurrentRoom();

                target = GameState.instance().getItemInVicinityNamed(itemName);

                if (target.getWeight() == 1) {
                    return "It's not nice to attack others. \n";
                }

                if (target.getWeight() >= 100) {
                    target.setWeight(GameState.instance().getItemFromInventoryNamed("Sword").getWeight());

                    return target.getMessageForVerb("attack") + "\n";
                }

            } catch (Item.NoItemException e) {
                System.out.print("Your target: " + target.getPrimaryName() + ", is not in this room.");
            }

        }

        return "You can't attack things without a weapon.\n";
    }

}
