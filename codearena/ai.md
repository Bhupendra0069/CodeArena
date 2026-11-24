# AI Opponent Feasibility

## Short Answer

An AI opponent is feasible, but CodeArena does **not** support AI battles yet. Today, a battle requires two registered users. The current Easy/Medium/Hard selector chooses the **problem difficulty**, not the opponent's strength. Weak/Normal/Hard AI strength would be a separate setting.

## What the Current Project Does

- `CreateBattle.jsx` creates a room for two human players; it has Easy, Medium, and Hard problem difficulty options, but no AI option.
- `Match.js` requires each player to reference a real `User`, and limits a match to two players.
- `battleSocket.js` starts a battle only when there are two players and both authenticated users signal Ready.
- `matchService.js` finalizes the match by looking up both player records as users and changing both ELO ratings.
- `Problem.js` contains problem statements and test cases, but no reference solution or AI solver metadata.
- `judgeService.js`/Judge0 can compile and execute submitted code. Judge0 is not an AI and cannot invent a solution by itself.

Therefore, if no second human is available, the current Create/Join flow cannot start a battle against a bot. A second real user account is required today.

## Recommended First Version

Start with a server-controlled bot using private, trusted reference solutions for supported problems. Keep the bot as a distinct match participant rather than creating an ordinary user account for it. The server can run its solution through the same Judge0 evaluation path and publish its result through the existing battle events.

This first version would be deterministic and relatively simple to test. It would be a programmed opponent, not a general reasoning model. A later version could ask an external language model to generate a solution, but that adds provider keys, cost, response-time variability, and additional failure handling. Any generated code must still be evaluated through Judge0; do not execute it directly in the Express server or expose provider credentials in the browser.

## Suggested Opponent Settings

Keep these separate from the selected problem difficulty:

| AI strength | Suggested behavior |
|---|---|
| Weak | Longer response delay; reliably solves some Easy problems but may fail or time out on harder problems. |
| Normal | Moderate response delay; usually solves Easy problems and has a lower success rate or longer time on Medium/Hard. |
| Hard | Short response delay and a high success rate, including on harder problems. |

These are product starting points, not behavior currently implemented. Tune them using playtests. If the bot always uses a correct reference solution, strength can initially be represented by response time; meaningful differences in success rate require multiple solution strategies or a model whose output is actually evaluated.

## Work Required to Implement It

1. Add an AI opponent option and separate Weak/Normal/Hard selector to the battle creation UI. Preserve the existing Easy/Medium/Hard problem selector.
2. Add server-validated match fields for opponent type and AI strength. Never trust a client-supplied bot identity or result.
3. Update the match participant schema and battle startup flow so one authenticated human can ready up and the server can ready/start the bot without a second socket connection.
4. Add a server-side bot service that selects a solution for the chosen problem, observes the configured response behavior, and evaluates it through Judge0.
5. Update result handling and the Results page to display a bot participant correctly.
6. Keep AI matches out of human ELO and competitive leaderboard calculations by default. The existing finalizer assumes both participants are registered users and updates both ratings; an AI must not silently affect a real user's competitive rating.
7. Add tests for bot start/readiness, all three strengths, accepted and failed bot submissions, timeouts, results, and unchanged human ratings.

## Data and Fairness Considerations

- The current problem records do not have reference solutions. Add private server-only solutions or a server-side solution registry for each problem and supported language; never send those solutions to the client.
- Use the same hidden test cases, time limits, and memory limits for the human and bot.
- Do not award or subtract competitive ELO for AI matches unless a separate, explicitly designed bot-rating system is added.
- Handle Judge0 timeouts/errors as a bot failure or a clearly reported no-contest, not as an automatic human loss.
- Make it clear in the interface that the opponent is a bot and identify its selected strength.

## Files Likely to Change

- Frontend: `client/src/pages/CreateBattle.jsx`, `client/src/pages/BattleRoom.jsx`, and `client/src/pages/Results.jsx`.
- Backend: `server/src/models/Match.js`, `server/src/controllers/battleController.js`, `server/src/sockets/battleSocket.js`, and `server/src/services/matchService.js`.
- Code evaluation: `server/src/controllers/submissionController.js` and/or a new server-side bot service, reusing `server/src/services/judgeService.js`.
- Problem data: `server/src/models/Problem.js` and the seed data if private reference solutions are stored with problems.

## Conclusion

Yes, CodeArena can be extended to let a single user battle a weak, normal, or hard bot. It is not a configuration change alone: the match model, readiness/start rules, bot evaluation, result display, and rating logic all need deliberate changes. The safest MVP is a server-controlled, Judge0-evaluated reference-solution bot with AI matches excluded from human ELO.
