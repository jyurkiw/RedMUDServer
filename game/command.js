/**
 * Module used to manage and process a player's command queue.
 * <br/>
 * The command queue is used to manage time-dependent commands issued
 * by the player, as their execution is bound to the ticks of the
 * mud gameloop.
 * 
 * Time sensitive commands include:
 * <ol>
 *      <li>Movment</li>
 *      <li>Combat</li>
 * </ol> 
 * 
 * @namespace command
 */
function Command() {

}

module.exports = Command();