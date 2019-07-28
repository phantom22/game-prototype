*Before you choose any level to play, here's some information that you should know before your first game experience.*

# **How to play the game?** *(index.html)*

Use `WASD` to move around and collect coins.
Even though it seems that there are lots of coins on the map, there are **two types** of coins that are indistinguishable to the eye:
* [**true**]() need to be collected so the player can escape through the door and win the game, they have a `higher` chance of dealing with the player's madness.
* [**false**]() aren't exactly as important as the first type but they help the player not going insane with a `slight` chance of reducing the player's madness.

 > The player starts with a fixed range of sight and with a certain number of moves its range decreases, note that there are   a *minimum sight range* and a *maximum sight range* for balance purposes.
  Another existing in-game mechanic is the [player's madness](), its effect starts when the player's sight range is at its minimum.
   The madness can be dealt-with by collecting `coins` and therefore gaining a bigger vision range, but the only thing that a player should rely on is `luck`.
  The position of the coins, the door, and the player are all `randomized`.
  Finally remember, each coin can both `help or do nothing`.

# **How to create a map?** *(map-editor.html)*

First of all, you need to know the `size` of the map that you want to create after you 've decided the grid resolution you have two ways of entering the values into the text field; if it's a square shaped map you can simply enter one *number*, if it's rectangle shaped then you have to enter *two numbers* separated by a `space`. 

After you've entered the correct values and clicked the `edit button` you can now proceed in editing you first own map. The only controls that you should keep in mind are *Q*, *W*, and *E* (**note that it's possible to hold m1 and draw without clicking each tile**). 
*  By pressing **Q** you will draw air blocks, a tile where the player can step on.
*  by pressing **W** you will draw wall blocks.
*  by pressing **E** you define the air blocks that won't have any randomized object on them *(like coins, doors, and the player first position)*, this feature is useful for `closed areas` of tiles **where the player can't get to**. 

When you've finished your creation you can click the export button and you'll see a string of the parsed object of your map in the console.
Now copy the string (**withou brackets**) and paste it into the variable `LEVELS`, situated in the `scripts/level.js` file.

When clicking the `export button` the table will look exactly as it will look in the game, added this feature to help with *screenshots*. After you've finished the map now you can take an easy screenshot, with any browser add-on, of the map and drop it into the screenshots folder (**don't forget to re-name the screenshot with the correct level index!**), if you are not done with editing you can click on any tile and the table will return back as it was before.

# **How to edit a map?** *(map-editor.html)*
If you already placed the map into the `scripts/level.js` file, then you can write `level index` into the text field, **index** obviously stand for the index of the level placed in the `LEVELS` variable. After you've entered the correct index you can now click the `edit button` and continue your creation.

If the map was saved in a text file, just for future completion then you need to enter three values:
*  `grid's first number`.
*  `grid's second number` *(repeat it even if the map is square shaped)*.
*  `map.meta`, a string of numbers that contains all the tile's ids that the map is made of *(must be in brackets)*.

After you've entered all the correct values you can continue your creation by clicking the `edit button`.

### THANK YOU FOR READING!
