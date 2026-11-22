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
| DB-02 | Storage uses AsyncStorage on the device. Keys are: `patti.profile` (game progress and avatar) and `patti.activeGame` (the saved match). | Confirmed | Implementation |
| DB-03 | Retired: PIN storage removed. No PIN is asked for or stored. See PRIV-01. | Retired | Brief change |
| DB-04 | Progress is local to the phone. Another phone cannot see it. | Confirmed | DB-01 |
| DB-05 | The in-progress game is saved after every change to the arrangement, reveal, or round. The timer position is also saved when the app goes to the background. | Confirmed | Resume brief |
| DB-06 | Storage errors never crash the app. Corrupt or unreadable data is treated as empty. | Assumed | Implementation |
| DB-07 | Retired: there is no logout. See PRIV-02. | Retired | Brief change |
| DB-08 | Match history keeps the last 100 matches per account. | Assumed | Implementation |
| DB-09 | Clearing app data erases the progress and any saved game. No cloud backup exists. | Confirmed | DB-01 |
| AVT-01 | A chosen avatar is saved to the device profile and is shown again after the app restarts. | Confirmed | Brief |
| AVT-02 | The new avatar is shown only after it is saved. If saving fails, the player sees "Could not save your avatar. Please try again." and the old avatar stays. | Confirmed | Implementation |
| AVT-03 | On load, a saved avatar that does not exist or is still locked for the saved star count is replaced by the default avatar. | Confirmed | Implementation |

## 3. No login and no personal details

| ID | Rule | Status | Source |
|----|------|--------|--------|
| PRIV-01 | The app does not ask for a real name, PIN, email, phone number, or any other personal detail. The only name asked for is the character name (CHAR-01). | Confirmed | Brief |
| PRIV-02 | The app has no login and no sign-up. The game starts from the home screen. | Confirmed | Brief |
| PRIV-03 | Retired: the player was shown as "You". The character name is shown instead (CHAR-03). | Retired | Brief change |
| PRIV-04 | The avatar is a game preference and holds no personal detail. The player can change it from the home screen. | Assumed | Implementation |
| PRIV-05 | The app does not collect device identifiers, location, contacts, or analytics. | Confirmed | SCOPE-03 |
| CHAR-01 | On first launch, the player types an optional nickname and picks a character before playing. A blank nickname uses "Player" (review deck, slide 9 and 15). The nickname is saved on this phone only. The name is 1 to 12 characters. Letters (any script), digits, spaces, dots, apostrophes and hyphens are allowed. | Confirmed | Brief |
| CHAR-02 | "Save & Continue" stays disabled until the name is valid. An error message explains what is wrong. | Confirmed | Implementation |
| CHAR-03 | The character name is shown at the table, on the scoreboard, and on the home screen. | Confirmed | Brief |
| CHAR-04 | The player can edit the character name and avatar later from the home screen. Cancel keeps the old values. | Confirmed | Implementation |
| CHAR-05 | The character name is a game name. It is not a login and must not be a real name, email, or phone number. | Confirmed | Brief |
| CHAR-06 | Only unlocked characters can be picked. Locked characters show a lock and "???". | Confirmed | STAR-04 |
| LAYOUT-01 | Screens respect the phone's status bar and navigation bar. No button sits under the system bars. | Confirmed | Brief (screenshot 22 Nov) |
| LAYOUT-02 | Avatars do not show a second name where the screen already shows one. | Confirmed | Brief (screenshot 22 Nov) |
| LAYOUT-03 | Layouts adapt to the window width. The character grid picks 3 to 6 columns so avatars and their names are never cut off, and the avatar box grows to fit its name. | Confirmed | Screenshot 22 Nov (names cut off) |
| LAYOUT-04 | Single-button screens use a full-width button with the same look as Save (16 dp padding, full width). No button collapses to a strip. | Confirmed | Screenshot 22 Nov (Next hand button) |
| CHAR-07 | Characters and rivals use generic English names and free artwork (standard emoji). No name or character from an existing film, comic, cartoon, or brand is used. Rivals: Maya, Ravi, Kabir. Characters: Fox, Panda, Lion, Dragon, Tiger, King, Unicorn, and locked ones (Duck, Elephant, Owl, Bird, Flame, Storm). | Confirmed | Brief 22 Nov |
| CHAR-08 | Saved character ids from the earlier names (for example "billu") map to the new ids, so no player loses their character. | Confirmed | Implementation |
| SET-01 | The gear button on the home screen opens Settings: Sound, Edit character, Privacy Notice, Terms of Use. | Confirmed | Mock-ups (gear icon) |
| SND-01 | A speaker button on the table and the Sound switch in Settings turn sound on or off. The choice is saved on the device. Defaults to on. | Confirmed | Mock-ups (speaker icon) |
| SND-02 | No sound files are bundled yet. The switch stores the setting only. | Confirmed | Implementation |
| RESET-01 | Settings has a "Reset progress" button. Tapping it asks for confirmation with "Cancel" and "Reset". Cancel changes nothing. | Confirmed | Brief 22 Nov |
| RESET-02 | Reset closes any game in progress and deletes the saved game. | Confirmed | Brief 22 Nov |
| RESET-03 | Reset clears played, won, win rate, total points, stars, match history, avatar, and character name. The player then sees character setup again, as on first launch. | Confirmed | Brief 22 Nov; "restart from scratch" |
| RESET-04 | Reset keeps the Privacy Notice and Terms confirmation and the over-18 confirmation. They are never asked again because of a reset. They are not game progress. | Confirmed | Brief 22 Nov |
| AX-14 | Screen readers announce each hand result ("Hand 2 of 4. Ravi wins this hand." or the tied names), the round end ("Round 2 done."), the match result, and card swaps ("Cards swapped."). | Confirmed | Implementation |
| AX-15 | Text is at least 14 sp (labels were 12-13 sp). | Confirmed | UX-04 |
| AX-16 | Error and warning text on the dark background uses a lighter red that passes 4.5:1 contrast. Card suit colours are unchanged. | Confirmed | AX-05 |
| AX-17 | Icon buttons (close, sound, gear) are at least 48 × 48 dp. | Confirmed | AX-06 |
| AX-18 | The close button on the table is labelled "Leave match". A Help (?) button on the table opens the rules. | Confirmed | Review deck, slides 4, 5, 14 |
| AX-19 | When a hand changes type while arranging, screen readers announce it: "Hand 1 is now a Pair." | Confirmed | Review deck, slides 5, 14 |
| AX-20 | The input border is #8A9A93 (6.3:1, WCAG 1.4.11). | Confirmed | Review deck, slides 4, 13 |
| AX-21 | Screen readers hear the spoken card name (for example "Queen of spades") and the hand strength ("Strength 3 of 5"). | Confirmed | Review deck, slide 14 |
| TIMER-01 | "No timer" is the default. A timer of 45, 60, 90 or 120 seconds can be chosen in House rules. | Confirmed | Review deck, slides 4 and 9 |
| TIMER-02 | With a timer, the player can pause and resume it by tapping the timer. Paused, the cards cannot be moved. | Confirmed | Review deck, slides 4 and 9 |
| ARR-11 | Undo reverts the last swap or Suggest while arranging. | Confirmed | Review deck, slides 10 and 15 |
| ARR-12 | A status line says what is selected: "Selected: Queen of spades. Tap another card to swap." | Confirmed | Review deck, slides 10 and 14 |
| ARR-13 | Each hand shows a five-segment strength meter under its hand type. | Confirmed | Review deck, slides 10 and 15 |
| RES-01 | Round and match results are sorted by standing, with positions, a "Leader" badge, and a plain summary ("You're 2nd, 2 points behind the leader."). | Confirmed | Review deck, slides 12 and 15 |
| LOW-01 | Built 22 Nov (review deck, slide 15, Low). See DISP-01, DISP-02, FEED-01, FEED-02, RECAP-01 and HOME-01. | Confirmed | Review deck, slide 15 |
| DISP-01 | Settings > Four-colour cards: spades black, hearts red, diamonds blue, clubs green. Off by default. | Confirmed | Review deck, slides 13 and 14 |
| DISP-02 | Settings > Larger cards: all cards 20% larger on the table. Off by default. | Confirmed | Review deck, slides 13 and 14 |
| FEED-01 | Settings > Vibration on swaps and wins: a light tap on each swap, and a success buzz when the player wins a hand. On by default. | Confirmed | Review deck, slide 14 |
| FEED-02 | Settings > Auto-advance hands: after a hand is revealed, the next one is revealed after 2.5 seconds. Off by default. The Next hand button still works. | Confirmed | Review deck, slides 11 and 14 |
| RECAP-01 | The round result shows a personal recap ("You won 2 of 4 hands this round.") and one tip. | Confirmed | Review deck, slides 12 and 15 |
| HOME-01 | The home screen shows the last-used house rules in one line ("5 rounds · No timer · Sweep +3 · Medium"). | Confirmed | Review deck, slide 15 |
| SET-02 | Settings lists Sound, Four-colour cards, Larger cards, Vibration and Auto-advance, each as a labelled switch. | Confirmed | Review deck, slide 14 |
| AUTH-01 | Retired: name and PIN sign-in removed. See PRIV-01. | Retired | Brief change |
| AUTH-02 | Retired: account creation removed. See PRIV-02. | Retired | Brief change |
| AUTH-03 | Retired: PIN check removed. See PRIV-01. | Retired | Brief change |
| AUTH-04 | Retired: session and logout removed. See PRIV-02. | Retired | Brief change |
| AUTH-05 | Retired: PIN field removed. See PRIV-01. | Retired | Brief change |

## 3A. First launch: legal confirmation and age check

Source: `13_Patti_Privacy_Notice.pdf` and `13_Patti_Terms_of_Use.pdf` (Version 1.0, 22 November 2026). The text is in `src/legal/content.ts`.

| ID | Rule | Status | Source |
|----|------|--------|--------|
| LEGAL-01 | On first launch, the first screen shows the Privacy Notice and Terms of Use. The player can open each one in full. | Confirmed | Brief |
| LEGAL-02 | The player confirms once by ticking "I have read and agree to the Privacy Notice and Terms of Use." and tapping "Accept & Continue". The button stays disabled until the box is ticked. | Confirmed | Brief |
| LEGAL-03 | The confirmation is stored on the device (`patti.consent`). It is not asked again on later launches. | Confirmed | Brief |
| LEGAL-04 | The confirmation is asked again only when `LEGAL_VERSION` changes. | Assumed | Implementation |
| LEGAL-05 | The Privacy Notice and Terms of Use can be read again from the home screen at any time. | Confirmed | Documents (Settings menu reference) |
| AGE-01 | After the legal confirmation, the second screen asks "Are you 18 or over?" with two buttons: "I am Over 18" and "No, I am under 18". | Confirmed | Brief |
| AGE-02 | Choosing "I am Over 18" is stored on the device and the player moves on to character setup. The question is not asked again. | Confirmed | Brief |
| AGE-03 | Choosing "No, I am under 18" shows "Minors are not allowed to play the game." and a countdown. The app closes after 3 seconds. | Confirmed | Brief |
| AGE-04 | An under-18 answer is remembered on the device (Q-12, decided 22 Nov). The app opens at the minors message on every later launch and closes after 3 seconds. | Confirmed | Q-12 decision |
| ORDER-01 | First-launch order: Privacy Notice and Terms, then the age check, then character setup, then home. Each step is shown only if it has not been completed. | Assumed | Brief (order implied); confirm |

## 4. Game rules

### 4.1 Setup and round

| ID | Rule | Status | Source |
|----|------|--------|--------|
| GAME-01 | Each round uses a standard 52-card deck, shuffled. | Confirmed | Brief |
| GAME-02 | Four players sit at the table: the player's character and three rivals (Maya, Ravi, Kabir). | Confirmed | Mock-ups; names changed 22 Nov (CHAR-07) |
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
| ARR-10 | After Suggest, the hands are shown from strongest (Hand 1) to weakest (Hand 4). Inside each hand the cards go from highest to lowest. The spare stays last. | Confirmed | Brief 22 Nov |
| ORDER-02 | Each side puts its groups in order, highest first and lowest last. The player is ordered when cards are locked (Show cards or timeout). Computer hands are ordered when dealt. Hands are compared position by position. | Confirmed | Player rules text, 22 Nov |
| ARR-06 | "Show cards" locks the arrangement and starts the reveal. | Confirmed | Mock-up |
| ARR-07 | Each hand shows its category label (for example "Pair" or "High Card") while arranging. | Confirmed | Mock-up |
| ARR-08 | The spare card is shown with the note "Breaks ties". | Confirmed | Mock-up |
| ARR-09 | Computer players arrange their cards automatically when the round is dealt. | Confirmed | Implementation |

### 4.3 Hand ranking

Strongest first. Each category is listed with its tie-break rule.

| ID | Category | Meaning | Tie-break | Status |
|----|----------|---------|-----------|--------|
| RANK-01 | Trail | Three cards of the same rank | Rank | Confirmed | Player rules text, 22 Nov |
| RANK-02 | Pure sequence | Three cards in order, all the same suit | Top card | Confirmed | Player rules text, 22 Nov |
| RANK-03 | Sequence | Three cards in order, mixed suits | Top card | Confirmed | Player rules text, 22 Nov |
| RANK-04 | Color | Three cards of the same suit, not in order | Highest card, then next | Confirmed | Player rules text, 22 Nov |
| RANK-05 | Pair | Two cards of the same rank | Pair rank, then the odd card | Confirmed | Player rules text, 22 Nov |
| RANK-06 | High card | Anything else | Highest card, then next | Confirmed | Player rules text, 22 Nov |

| ID | Rule | Status |
|----|------|--------|
| RANK-07 | Ace is high. Q-K-A is the highest sequence. | Confirmed | Player rules text, 22 Nov |
| RANK-08 | A-2-3 is the lowest sequence. K-A-2 is not a sequence. | Confirmed | Player rules text, 22 Nov |
| RANK-09 | Hands are compared by category first, then by tie-break. | Confirmed | Player rules text, 22 Nov |

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
| AX-10 | Timer changes are announced at 30, 10, and 5 seconds left ("30 seconds left to arrange."). The timer is never the only way to finish arranging. | Confirmed |
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
    Given I am on the home screen
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
    When I open the app
    Then I see the message "Do you want to continue playing it from where you left off?"
    When I tap "Continue"
    Then I see round 2 of 5 at Hand 3 of 4
    And my points show 4

  @RESUME-03
  Scenario: Start a new game and discard the saved one
    Given I closed the app during Hand 3
    When I open the app
    And I tap "Start new"
    Then I see the House rules sheet
    And the saved game is removed

  @AX-12
  Scenario: The result of a hand is announced to screen readers
    Given TalkBack is on
    When Hand 3 is revealed and "Ravi" wins it
    Then TalkBack announces "Hand 3 of 4. Ravi wins this hand."
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
| Q-01 | Resolved 22 Nov: the player supplied the rules text. Hand ranking, sequences, pairs, tie-breaks and the highest-group-first rule match it (ORDER-02). Q-02 and Q-03 agree with it. | RANK-*, ORDER-02 |
| Q-02 | Decided 22 Nov: a Trail ranks above a Pure sequence (the standard order). Kept as built. | RANK-01, RANK-02 |
| Q-03 | Decided 22 Nov: A-2-3 is the lowest sequence and K-A-2 is not a sequence. Kept as built. | RANK-07, RANK-08 |
| Q-04 | Decided 22 Nov: when two hands are fully equal, both players get the point. Kept as built. | SCORE-04 |
| Q-05 | Decided 22 Nov: when the arrange timer runs out, the cards stay as they are. Kept as built. | ARR-04 |
| Q-06 | Resolved 22 Nov: the player can reset progress from Settings (RESET-01 to RESET-04). | DB-09 |
| Q-07 | Decided 22 Nov: avatars unlock at 3, 6, 9, 12, 15 and 18 stars, as the mock-up suggests. Kept as built. | STAR-03 |
| Q-08 | Resolved 22 Nov: Android package name is com.vgtech.thirteenpatti. | SCOPE-01 |
| Q-09 | OPEN, needs your decision. The Privacy Notice says the app shows Google AdMob ads, asks for ad consent, has a Settings menu, and does not ask for a name. The app has none of the ads or consent, has no Settings menu yet, and asks for a character name. Which should change: the documents or the app? | PRIV-01, CHAR-01, LEGAL-05 |
| Q-10 | Resolved 22 Nov: no location check. Players confirm their age and accept the Terms instead. The Terms text about Australia and India is unchanged. | Terms s.2 |
| Q-11 | Decided 22 Nov: the first-launch order is Privacy Notice and Terms, then age check, then character setup. Kept as built. | ORDER-01 |
| Q-12 | Decided 22 Nov: yes. An under-18 answer is remembered on the device, and the app stays closed on later launches. Built. | AGE-04 |

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
