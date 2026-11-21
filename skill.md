---
name: 13-patti-product-rules
description: Source of truth for the 13 Patti Android game. Holds the game rules register, storage and data conditions, UX and accessibility (AX) rules, and the standard for writing Gherkin user stories with acceptance criteria. Load before writing or reviewing any user story, acceptance criterion, or game rule.
---

# 13 Patti: product rules and story standard

This file is the single source for rules. When a story, test, or code change
conflicts with this file, fix the conflict here first, then the code.

Each rule has an ID, a status, and a source.

- **Confirmed**: agreed with the product owner or shown in the design mock-ups.
- **Assumed**: built as a working default. It must be confirmed before release.

Rule IDs never change once published. Retire a rule by setting its status to
**Retired**, never by deleting it.

---

## 1. Product scope

| ID | Rule | Status | Source |
|----|------|--------|--------|
| SCOPE-01 | The product is an Android mobile game built with React Native and Expo. | Confirmed | Brief |
| SCOPE-02 | Play is against 3 computer rivals. There is no online or multiplayer play. | Confirmed | Brief, README |
| SCOPE-03 | Gameplay works fully offline. The app makes no network calls during play. | Confirmed | README ("offline … nothing online") |
| SCOPE-04 | The app runs in portrait orientation only. | Assumed | Mock-ups are portrait |
| SCOPE-05 | Avatar artwork is a later step. Until then, emoji placeholders are used. | Confirmed | Brief (AI avatars planned) |

## 2. Data and storage conditions

| ID | Rule | Status | Source |
|----|------|--------|--------|
| DB-01 | There is **no database and no server**. All data is stored on the device. | Confirmed | Brief |
| DB-02 | Storage uses AsyncStorage on the device. Keys are: `patti.accounts`, `patti.session`, `patti.activeGame`. | Confirmed | Implementation |
| DB-03 | A PIN is never stored in plain text. It is stored as a SHA-256 hash. | Confirmed | Security baseline |
| DB-04 | Accounts are local to the phone. Another phone cannot see them. | Confirmed | DB-01 |
| DB-05 | The in-progress game is saved after every change to the arrangement, reveal, or round. The timer position is also saved when the app goes to the background. | Confirmed | Resume brief |
| DB-06 | Storage errors never crash the app. Corrupt or unreadable data is treated as empty. | Assumed | Implementation |
| DB-07 | Logging out clears the saved in-progress game for this device. | Assumed | Implementation; confirm |
| DB-08 | Match history keeps the last 100 matches per account. | Assumed | Implementation |
| DB-09 | Clearing app data erases all accounts and saved games. No cloud backup exists. | Confirmed | DB-01 |

## 3. Accounts and login

| ID | Rule | Status | Source |
|----|------|--------|--------|
| AUTH-01 | A player signs in with a name (2 to 20 characters) and a 4-digit PIN. | Confirmed | Mock-up, "Who's playing today?" |
| AUTH-02 | If the name is new, an account is created with that PIN and the chosen avatar. | Confirmed | Mock-up |
| AUTH-03 | If the name exists, the PIN must match. Otherwise the app shows "Wrong PIN for this name." | Assumed | Implementation |
| AUTH-04 | The session is remembered. The player is not asked to log in again until they log out. | Assumed | Implementation |
| AUTH-05 | The PIN field accepts digits only and stops at 4 digits. | Confirmed | Implementation |

## 4. Game rules

### 4.1 Setup and round

| ID | Rule | Status | Source |
|----|------|--------|--------|
| GAME-01 | Each round uses a standard 52-card deck, shuffled. | Confirmed | Brief |
| GAME-02 | Four players sit at the table: "You" and three rivals (Shakti, Shwaan, Mahabali). | Confirmed | Mock-ups |
| GAME-03 | Each player is dealt 13 cards. | Confirmed | Brief |
| GAME-04 | Each player arranges their 13 cards into four 3-card hands and one spare card. | Confirmed | Mock-ups |
| GAME-05 | The number of rounds is 3, 5, 7, or 10. The default is 5. | Confirmed | Mock-up (house rules) |

### 4.2 Arranging

| ID | Rule | Status | Source |
|----|------|--------|--------|
| ARR-01 | The player arranges by tapping one card, then tapping a second card to swap them. | Confirmed | Mock-up |
| ARR-02 | Tapping the selected card again cancels the selection. | Assumed | Implementation |
| ARR-03 | The arrange timer is 45, 60, 90, or 120 seconds. The default is 90. | Confirmed | Mock-up |
| ARR-04 | When the timer reaches zero, the player's current arrangement is locked as it is. It is not rearranged automatically. | Assumed | Implementation; confirm |
| ARR-05 | "Suggest" rearranges the player's cards into the strongest hands the app can find. It does not lock them. | Confirmed | Mock-up |
| ARR-06 | "Show cards" locks the arrangement and starts the reveal. | Confirmed | Mock-up |
| ARR-07 | Each hand shows its category label (for example "Pair" or "High Card") while arranging. | Confirmed | Mock-up |
| ARR-08 | The spare card is shown with the note "Breaks ties". | Confirmed | Mock-up |
| ARR-09 | Computer players arrange their cards automatically when the round is dealt. | Confirmed | Implementation |

### 4.3 Hand ranking

Strongest first. Each category is listed with its tie-break rule.

| ID | Category | Meaning | Tie-break | Status |
|----|----------|---------|-----------|--------|
| RANK-01 | Trail | Three cards of the same rank | Rank | Assumed |
| RANK-02 | Pure sequence | Three cards in order, all the same suit | Top card | Assumed |
| RANK-03 | Sequence | Three cards in order, mixed suits | Top card | Assumed |
| RANK-04 | Color | Three cards of the same suit, not in order | Highest card, then next | Assumed |
| RANK-05 | Pair | Two cards of the same rank | Pair rank, then the odd card | Assumed |
| RANK-06 | High card | Anything else | Highest card, then next | Assumed |

| ID | Rule | Status |
|----|------|--------|
| RANK-07 | Ace is high. Q-K-A is the highest sequence. | Assumed |
| RANK-08 | A-2-3 is the lowest sequence. K-A-2 is not a sequence. | Assumed |
| RANK-09 | Hands are compared by category first, then by tie-break. | Assumed |

### 4.4 Reveal and scoring

| ID | Rule | Status | Source |
|----|------|--------|--------|
| SCORE-01 | Hands are revealed one at a time, from Hand 1 to Hand 4. | Confirmed | Mock-up |
| SCORE-02 | In each hand position, the strongest hand wins 1 point. | Confirmed | Mock-up (round summary) |
| SCORE-03 | If two hands are equal in rank and tie-break, the spare card breaks the tie. The higher spare wins. | Confirmed | Mock-up |
| SCORE-04 | If two hands are still equal after the spare, both players win the point. | Assumed | Implementation |
| SCORE-05 | A player who wins all four hands in a round scores a **sweep**. They get the sweep bonus from house rules. | Confirmed | Mock-up |
| SCORE-06 | The sweep bonus is Off, +3, or +5. The default is +3. | Confirmed | Mock-up |
| SCORE-07 | The round summary shows each player's points for the round and their total. | Confirmed | Mock-up |
| SCORE-08 | The player with the most total points after the last round wins the match. If points are equal, the match is a tie. | Assumed | Implementation |

### 4.5 Computer players

| ID | Rule | Status | Source |
|----|------|--------|--------|
| CPU-01 | Computer difficulty is Easy, Medium, or Hard. The default is Medium. | Confirmed | Mock-up |
| CPU-02 | Easy arranges cards at random. | Assumed | Implementation |
| CPU-03 | Medium picks the strongest of 300 random arrangements. | Assumed | Implementation |
| CPU-04 | Hard picks the strongest of 3,000 random arrangements, then improves it by swapping cards. | Assumed | Implementation |

### 4.6 Stars and avatars

| ID | Rule | Status | Source |
|----|------|--------|--------|
| STAR-01 | Winning a match earns stars: Easy 1, Medium 2, Hard 3. Losing or tying earns none. | Confirmed | Mock-up |
| STAR-02 | Stars are added to the account total. | Confirmed | Mock-up |
| STAR-03 | Avatars unlock at these star totals: 0 (seven avatars), then 3, 6, 9, 12, 15, 18 for the locked ones. | Assumed | Mock-up shows "Next avatar at 3 stars"; the rest is a working default |
| STAR-04 | A locked avatar shows a lock and "???" and cannot be chosen. | Confirmed | Mock-up |

### 4.7 Record and history

| ID | Rule | Status | Source |
|----|------|--------|--------|
| REC-01 | The home screen shows played, won, win rate (rounded to whole %), total points, and stars. | Confirmed | Mock-up |
| REC-02 | A match counts as played when it reaches its final result. A match that is closed mid-way does not count. | Assumed | Implementation |
| REC-03 | Total points add up across all finished matches. | Confirmed | Mock-up |

## 5. Resume and unsaved games

| ID | Rule | Status | Source |
|----|------|--------|--------|
| RESUME-01 | Closing the table (✕), pressing Android Back, or leaving the app saves the game exactly as it is. | Confirmed | Brief |
| RESUME-02 | On the next launch, if an unsaved game exists for this player, the app asks: "Do you want to continue playing it from where you left off?" | Confirmed | Brief |
| RESUME-03 | The prompt has two choices: **Continue** (resume the saved game) and **Start new** (discard it). | Confirmed | Brief |
| RESUME-04 | Pressing **Play Now** while an unsaved game exists shows the same prompt before a new match starts. | Assumed | Implementation |
| RESUME-05 | The prompt cannot be dismissed by tapping outside it. | Assumed | Implementation |
| RESUME-06 | A resumed game restores the same hands, arrangement, round, hand number, points, and timer. | Confirmed | Brief |

## 6. UX rules

| ID | Rule | Status |
|----|------|--------|
| UX-01 | Each screen has one main action, shown as the largest button at the bottom. | Assumed |
| UX-02 | Destructive choices ("Start new", "Log out") use a clear label and a second step where data is lost. | Assumed |
| UX-03 | Every tap gives visible feedback within 100 ms. | Assumed |
| UX-04 | Text is at least 14 sp for body copy. Headings are at least 18 sp. | Assumed |
| UX-05 | Main layouts fit a 360 dp wide phone without horizontal scrolling. | Assumed |
| UX-06 | Long content (rules, history) scrolls inside its own panel. | Assumed |
| UX-07 | Instructions appear where they are needed. The first arrange screen shows "Tap a card, then tap another card to swap them." | Confirmed |
| UX-08 | Numbers and labels use plain words. Use "Round 2 / 5", not codes. | Assumed |

## 7. Accessibility (AX) rules

The app must work for people using screen readers (TalkBack), large text, high
contrast, reduced motion, and switch or keyboard access.

| ID | Rule | Status |
|----|------|--------|
| AX-01 | Every button, card, and avatar has an accessible label. A card reads as "Queen of spades". A face-down card reads as "Face-down card". | Confirmed |
| AX-02 | Every control has the right role: button, switch, or heading. | Confirmed |
| AX-03 | A selected card is announced as "selected". The swap instruction is available as the accessibility hint. | Confirmed |
| AX-04 | Colour is never the only signal. Selection uses a border and a lift. The sweep and winner use text such as "+1". Suit colour is paired with the suit symbol. | Confirmed |
| AX-05 | Text contrast is at least 4.5 to 1 for body text and 3 to 1 for large text (WCAG 2.2 AA). | Confirmed |
| AX-06 | Touch targets are at least 48 × 48 dp. | Confirmed |
| AX-07 | Text grows with the system font size. No text is cut off at 200% scale. | Confirmed |
| AX-08 | Focus order follows the visual order: top bar, scoreboard, hands, actions. | Confirmed |
| AX-09 | Every screen can be used without a touch screen (switch access or TalkBack gestures). | Confirmed |
| AX-10 | Timer changes are announced at 30, 10, and 5 seconds left. The timer is never the only way to finish arranging. | Assumed |
| AX-11 | Motion is kept small. Animations are skipped when "remove animations" is on. | Assumed |
| AX-12 | Results (round, match) are announced when they appear. | Confirmed |
| AX-13 | Decorative images are hidden from screen readers. | Confirmed |

## 8. Writing user stories (Gherkin)

Every user story is written in Gherkin. Use the format below. Write in simple
English, short sentences, and present tense.

### 8.1 Story format

```
Feature: <short name of the capability>
  As a <role>
  I want <action>
  So that <benefit>

  Background:
    Given <shared starting point>

  @<RULE-ID> @<tag>
  Scenario: <one clear behaviour>
    Given <starting state>
    When <one action>
    Then <one visible result>
    And <optional extra result>
```

### 8.2 Writing rules

1. **One behaviour per scenario.** A scenario tests one thing.
2. **Use real values.** Write "Given I have 90 seconds left", not "Given I have some time left".
3. **Use plain words.** "Tap", "see", "choose". Avoid "should", "properly", "fast", "nice", "easily".
4. **Each scenario names the rule ID** it proves, for example `@SCORE-03`.
5. **Give each story 3 to 7 scenarios.** Cover the happy path, one error or edge case, and the accessibility check when the story has a screen.
6. **Use one Given-When-Then per line.** Do not chain steps with "and" in one step.
7. **Use the exact labels from the app.** Button text, screen titles, and messages must match the app.
8. **Describe what the player sees or does.** Do not describe code, database calls, or internal state.
9. **Keep each scenario to 6 lines or fewer.**
10. **Put the story's rules in the story header.** List which rule IDs the story depends on.

### 8.3 Acceptance criteria checklist

A story is ready when:

- [ ] Every scenario has a rule ID tag.
- [ ] Every scenario starts with a Given that sets real values.
- [ ] Every Then is something the player can see, hear, or read.
- [ ] No word from the banned list in 8.2 appears.
- [ ] Each interactive element has an accessibility label (AX-01).
- [ ] Each story that adds a screen has one accessibility scenario.
- [ ] All assumed rules it uses are listed, so they can be confirmed.

### 8.4 Example

```gherkin
# Rules used: RESUME-01, RESUME-02, RESUME-03, DB-05, AX-12

Feature: Resume an unsaved game
  As a player
  I want to continue a game I closed
  So that I do not lose my hands or my points

  Background:
    Given I am logged in as "Mav"
    And I am in round 2 of 5 at Hand 3 of 4
    And I have 4 points in total

  @RESUME-01 @DB-05
  Scenario: Closing the table keeps the game
    When I tap the ✕ button
    Then I see the home screen
    And the saved game holds round 2, Hand 3, and 4 points

  @RESUME-02 @RESUME-03
  Scenario: Continue the unsaved game after relaunch
    Given I closed the app during Hand 3
    When I open the app and log in as "Mav"
    Then I see the message "Do you want to continue playing it from where you left off?"
    When I tap "Continue"
    Then I see round 2 of 5 at Hand 3 of 4
    And my points show 4

  @RESUME-03
  Scenario: Start a new game and discard the saved one
    Given I closed the app during Hand 3
    When I open the app and log in as "Mav"
    And I tap "Start new"
    Then I see the House rules sheet
    And the saved game is removed

  @AX-12
  Scenario: The result of a hand is announced to screen readers
    Given TalkBack is on
    When Hand 3 is revealed and "Shwaan" wins it
    Then TalkBack announces "Hand 3 of 4. Shwaan wins this hand."
```

## 9. Definition of Done for a game feature

- All scenarios pass in the automated test suite (`npm test`).
- `npm run typecheck` passes.
- The screen works at 200% font size and with TalkBack on.
- Every rule the feature uses is marked **Confirmed**, or the open question is listed in section 10.
- The README is updated when the player-visible behaviour changes.

## 10. Open questions (must be answered before release)

| # | Question | Affects |
|---|----------|---------|
| Q-01 | Confirm the official rules from the BGG thread or wikiHow page. Both were blocked during the build. | GAME-*, RANK-*, SCORE-* |
| Q-02 | Does a Trail rank above a Pure sequence? (Current: yes.) | RANK-01, RANK-02 |
| Q-03 | Is a Sequence (A-2-3) the lowest? Is K-A-2 a sequence? (Current: A-2-3 lowest, K-A-2 not a sequence.) | RANK-07, RANK-08 |
| Q-04 | When two hands are fully equal, does the point go to both players or to none? (Current: both.) | SCORE-04 |
| Q-05 | When the arrange timer runs out, should the app rearrange the cards or keep them as they are? (Current: keep.) | ARR-04 |
| Q-06 | Does logging out delete the saved game? (Current: yes.) | DB-07 |
| Q-07 | Should avatars unlock at 3, 6, 9… stars, as the mock-up suggests? | STAR-03 |
| Q-08 | What is the Android package name for release? | SCOPE-01 |

## 11. Glossary

- **Round**: one deal of 13 cards to each player, ending with the reveal of all four hands.
- **Match**: a series of rounds, set by house rules.
- **Hand**: one 3-card group. Each player has four hands per round.
- **Spare**: the 13th card, not part of any hand. It only breaks ties.
- **Reveal**: turning over one hand position for all players at a time.
- **Sweep**: winning all four hands in a round.
- **Trail**: three cards of the same rank.
- **Pure sequence**: three cards in order, all the same suit.
- **Sequence**: three cards in order, mixed suits.
- **House rules**: the match options the player sets before the match starts.
- **Unsaved game**: a match that was left before it finished, kept on the device for resume.

## 12. Sources

- Rules reference: https://www.wikihow.com/Play-the-Card-Game-13 (could not be fetched automatically; check it manually)
- Rules reference: https://boardgamegeek.com/thread/911702/our-thirteen-rules (returned HTTP 403 during the build)
- Design mock-ups: `C:\Users\svish\Projects\13 patti\screens` (7 screens)
