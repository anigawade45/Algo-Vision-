export const getAnalogyForProblem = (problemId) => {
  const MOCK_ANALOGIES = {
    'two-sum': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Budget Shopping Trip',
        story: `Imagine you are at a supermarket with a very strict shopping list. You have a gift card worth exactly ₹900, and you want to buy exactly two items that will use up the entire balance. No more, no less.\n\nInstead of blindly picking up an item and walking through the entire store trying to find another item that perfectly matches the remaining balance (which would take forever), you decide to use your memory.\n\nAs you walk down the aisle, you pick up a ₹200 item. You mentally calculate: "I need a ₹700 item to finish my shopping." You keep the ₹200 item in mind. Later, you spot a ₹700 item. Because you remembered the first item, you instantly know you've found your perfect pair without having to search the store twice!\n\nThis is exactly how this problem is solved efficiently. By checking each item once and keeping track of what you've already seen, you instantly recognize when the matching partner appears.`
      }
    },
    'valid-parentheses': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Russian Nesting Dolls',
        story: `Think of a set of beautiful Russian Matryoshka dolls. When you are assembling them, every time you open a bottom half of a doll (an opening bracket), you must eventually cap it with its exact matching top half (a closing bracket).\n\nIf you open a large red doll, then open a medium blue doll inside it, and finally a small green doll inside that... you cannot just put the large red lid on right away. You must close the small green doll first, then the medium blue doll, and finally the large red one.\n\nThe last doll you opened must be the first one you close. If you try to put a square lid on a round box, or close the outer box before the inner box is sealed, the whole set breaks.\n\nThis strict Last-In, First-Out sequence ensures every nested container is closed in exact reverse order of how it was opened.`
      }
    },
    'reverse-linked-list': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Flipping the Scavenger Hunt',
        story: `Imagine you are on a scavenger hunt. You are given a clue that leads you to Location A. At Location A, you find a note that says "Go to Location B." At Location B, a note says "Go to Location C," and so on until the finish line.\n\nNow, imagine the organizers want to completely reverse the scavenger hunt for the next group. They ask you to walk the path, and at every location, change the note to point backwards to where you just came from.\n\nTo do this, when you are at Location B, you need to remember where you came from (Location A) so you can point B's note back to A. But before you change B's note, you must quickly write down where B was originally pointing (Location C) so you don't lose the rest of the trail!\n\nThis careful juggling of three tracking pointers—where you were, where you are, and where you are going next—allows the entire sequence to be flipped in place.`
      }
    },
    'binary-tree-inorder': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Reading a Family Tree',
        story: `Imagine you are looking at a vast, ancient family tree drawn on a wall. You want to read all the names in alphabetical order, and the tree was designed in a very specific way: for any given person, all relatives on their left branch come before them alphabetically, and all relatives on their right branch come after them.\n\nTo read the names correctly, you can't just read the person at the top first. You must trace the line all the way down to the furthest left branch, read that name, then read the parent's name, and then check the right branch.\n\nYou repeat this exact same "Left, Self, Right" process for every single family member on the wall. This naturally recurring exploration ensures names are read in perfectly sorted order.`
      }
    },
    'kth-largest-element': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The VIP Leaderboard',
        story: `Imagine you are running an arcade tournament, and you only have prizes for the Top 3 players (k=3).\n\nAs hundreds of players finish their games and shout out their scores, you could write every single score down on a giant whiteboard and then sort the entire board at the very end. But that takes too much time and space.\n\nInstead, you just keep a small chalkboard with exactly 3 slots. When a new score is announced, you look at the lowest score on your chalkboard. If the new score is higher than your lowest score, you erase the lowest one and write the new one in. If it's not, you ignore it.\n\nAt the end of the tournament, the person at the very bottom of your 3-slot chalkboard is exactly the 3rd best player! This efficient filtering tracks the top K items without needing to process everything at once.`
      }
    },
    'sliding-window-maximum': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Camera Viewfinder',
        story: `Imagine you are a photographer looking through a small rectangular camera viewfinder. You are panning your camera across a beautiful skyline of buildings of various heights from left to right.\n\nYour viewfinder can only fit exactly 3 buildings at a time (your "window size"). Your goal is to record the height of the tallest building visible in your viewfinder at every single moment as you pan across the city.\n\nInstead of re-scanning all 3 buildings every time you move the camera an inch, you just keep track of the reigning champion. When a taller building enters the frame, it becomes the new champion. When the old champion slides out of the left side of the frame, you look for the next tallest building still in view.\n\nThis continuous shifting of a fixed-size frame over a landscape of data allows continuous tracking of maximums.`
      }
    },
    'number-of-islands': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Exploring Uncharted Archipelago',
        story: `Imagine you are an explorer flying over an uncharted ocean dotted with islands. You have a blank map, and your job is to count exactly how many distinct islands exist.\n\nYou decide to parachute down onto the first piece of land you see. To ensure you don't count this island twice, you pull out a red marker and paint the ground you are standing on. Then, you walk north, south, east, and west, painting all connected landmasses red until you hit water in every direction.\n\nOnce the entire island is painted, you fly back up into the sky. You scan the ocean again. If you see unpainted land, you know it must be a brand new island! You parachute down and repeat the process.\n\nThis methodical exploration and marking of connected land ensures every continuous landmass is fully explored and counted exactly once.`
      }
    },
    'merge-intervals': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Consolidating Meeting Bookings',
        story: `Imagine you are an office manager looking at a messy schedule of room bookings for the day. Someone booked the room from 9 AM to 11 AM, someone else booked it from 10 AM to 12 PM, and a third person from 1 PM to 2 PM.\n\nInstead of having a fragmented schedule, you want to merge overlapping bookings to know exactly when the room is occupied.\n\nYou first sort the bookings by their start times. You look at the first booking (9 to 11 AM). The next booking starts at 10 AM, which is before the first one ends. So, you merge them into a single block from 9 AM to 12 PM. The third booking starts at 1 PM, which is after 12 PM, so it remains a separate block.\n\nThis simple process of ordering by start times and expanding overlapping blocks consolidates schedule intervals seamlessly.`
      }
    },
    'longest-substring-no-repeat': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Unforgiving Bouncer',
        story: `Imagine a nightclub with a very strict bouncer. The rule is: no two people with the same name can be inside the club at the same time.\n\nA line of people is waiting to get in. The bouncer lets people in one by one. As long as a person's name is not already inside, they enter, and the bouncer writes down the new record for the most people inside.\n\nBut suddenly, another "John" arrives at the door. The bouncer cannot let him in while the first "John" is still inside. So, the bouncer starts kicking people out from the front of the line (the left side) until the first "John" leaves. Only then can the new "John" enter.\n\nThis expanding and contracting line of people finds the longest sequence without duplicates.`
      }
    },
    'shortest-path-graph': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Expanding Ripple',
        story: `Imagine dropping a stone into a calm pond. A circular ripple expands outward from the center. The first wave hits objects that are exactly 1 foot away, then the next wave hits objects 2 feet away, and so on.\n\nIf you want to find the shortest path from the center to a specific lily pad, you just wait until the first ripple touches it. Because the ripple expands evenly in all directions step-by-step, the first time it reaches the lily pad is guaranteed to be the shortest possible route.\n\nThis expanding wave concept explores all locations 1 step away, then 2 steps away, guaranteeing the shortest route is reached first.`
      }
    },
    'climbing-stairs': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Staircase Sequence',
        story: `Imagine you are standing at the bottom of a staircase. To get to step 3, you can either step up from step 2 (taking a 1-step hop), or you can step up from step 1 (taking a 2-step hop). There are no other ways to physically land on step 3.\n\nThis means the total number of ways to reach step 3 is simply the number of ways to reach step 1 PLUS the number of ways to reach step 2.\n\nAs you keep climbing, this pattern continues. The ways to reach step 4 is the sum of ways to reach step 2 and step 3. You only ever need to remember the last two steps you calculated!\n\nThis simple addition of previous states builds up solutions incrementally without redundant work.`
      }
    },
    'house-robber': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Cautious Thief',
        story: `Imagine you are a thief walking down a street of houses. Each house has a different amount of cash. However, every house has a security alarm linked to its immediate neighbors. If you rob two adjacent houses, the alarms will ring.\n\nAs you stand in front of House #3, you have a choice. You can either rob House #3 (which means you must have skipped House #2, and thus you add House #3's cash to whatever you stole up to House #1). Or, you can skip House #3 entirely, meaning you keep whatever maximum cash you accumulated up to House #2.\n\nYou simply compare the two scenarios: (House #1's Loot + House #3) versus (House #2's Loot), and choose the bigger number.\n\nBy continually making this choice at every house, you maximize your total loot step by step without triggering any alarms.`
      }
    },
    'subsets': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Packing for a Trip',
        story: `Imagine you are packing for a weekend trip, and you lay out three items on your bed: a Hat, a Camera, and an Umbrella.\n\nFor every single item, you make a binary choice: either pack it in your bag, or leave it on the bed. First, you look at the Hat (Yes or No). Then, for each of those choices, you look at the Camera (Yes or No). Finally, for each of those, you look at the Umbrella (Yes or No).\n\nBy exploring every "Yes" and every "No" path sequentially, you eventually map out every possible combination of packed bags, from a completely empty bag to a bag with all three items.\n\nThis decision tree explores a path deeply, records the combination, and steps back to try alternate paths.`
      }
    },
    'course-schedule': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The College Degree Path',
        story: `Imagine you are enrolling in college classes. You want to take "Advanced Robotics," but it requires "Intro to Programming." But "Intro to Programming" requires "Basic Math."\n\nYou cannot just start with Advanced Robotics. You must find a course that has absolutely zero prerequisites (like Basic Math) and take it first. Once you pass Basic Math, it's "unlocked," and you cross it off the prerequisite list for Intro to Programming. Now, Intro to Programming has zero prerequisites, so you can take it next!\n\nIf you ever end up in a situation where every remaining class requires another remaining class (a prerequisite loop), you can never graduate.\n\nThis process of finding tasks with zero dependencies and systematically unlocking the next tasks determines a valid completion sequence.`
      }
    },
    'connected-components': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Merging Friend Groups',
        story: `Imagine a large room full of strangers. You start handing out identical colored wristbands. Initially, everyone gets a unique color because everyone is a separate group.\n\nThen, someone announces: "Alice and Bob are friends!" You tell Alice and Bob to pick one of their wristband colors and both wear the same color. Later, "Bob and Charlie are friends!" Charlie switches his wristband to match Alice and Bob's color. They are now one big connected group.\n\nWhenever two people are declared friends, their entire friend networks merge into a single color. At the end of the night, you just count how many different wristband colors are left in the room to know exactly how many distinct friend groups exist.\n\nThis efficient set merging groups connected entities together.`
      }
    },
    'kth-smallest-bst': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Reading the Organized Library',
        story: `Imagine a magical library where books are arranged in a very strict hierarchy. For any given book, all books with earlier alphabetical titles are placed on the left shelf, and all books with later titles are on the right shelf.\n\nIf you are asked to find the 3rd alphabetically first book, you don't need to gather all the books and sort them. You just start at the entrance and always walk to the furthest left shelf you can find. You read that book (it's the 1st!). Then you move up to its parent book, read it (that's the 2nd!). Then you check its right shelf.\n\nBecause the library is perfectly organized, simply reading the shelves in a "Left, Parent, Right" order guarantees you are reading the books in perfectly sorted order.`
      }
    },
    'top-k-frequent': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Voting Bins',
        story: `Imagine a massive election with millions of votes for various candidates. You want to find the top 2 most popular candidates.\n\nInstead of sorting a giant list of names, you use a clever system. You first tally up the votes. Alice got 5 votes, Bob got 2, and Charlie got 5.\n\nThen, you set up a row of buckets labeled 1, 2, 3, 4, 5... representing the number of votes. You drop Alice and Charlie's names into Bucket #5, and Bob's name into Bucket #2.\n\nTo find the winners, you just walk from the end of the row (the highest vote bucket) backward. You look in Bucket #5 and immediately find Alice and Charlie! You've found your top 2 candidates without having to do a complex, time-consuming sort.`
      }
    },
    'product-except-self': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Two-Way Conveyor Belt',
        story: `Imagine a factory assembly line with 4 stations. You want every station to know the combined product of all OTHER stations, but you are not allowed to just multiply everything together and divide by each station's value.\n\nInstead, you use two conveyor belts. The first belt runs left-to-right. As it passes station 2, it drops off the product of everything to the left (just station 1). As it passes station 3, it drops off the product of stations 1 and 2.\n\nThe second belt runs right-to-left. As it passes station 2, it drops off the product of everything to its right (stations 3 and 4).\n\nNow, station 2 just multiplies the box from the left belt with the box from the right belt. Without ever using division, station 2 has perfectly calculated the product of everything except itself!`
      }
    },
    'single-number': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Magical Cancellation Pairs',
        story: `Imagine a room where people are wearing name tags. Every single person has an identical twin in the room with the exact same name tag, except for one lone person.\n\nYou have a magical ledger. When you write a name in the ledger, it appears. But if you write the exact same name again, the ink magically erases both entries completely!\n\nYou walk around the room and write down everyone's name on your ledger. Because every twin appears twice, their names continually write and erase themselves.\n\nAt the very end of the night, the only name left in your ledger is the person who didn't have a twin to cancel them out! This self-canceling mechanism isolates the unique item.`
      }
    },
    'word-search': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Maze of Letters',
        story: `Imagine you are trapped in a giant grid-like maze where every room has a single letter painted on the floor. You are looking for a path that spells "APPLE."\n\nYou stand on a room with an 'A'. Great! You mark the door with a chalk "X" so you don't walk in circles. You look around and see a 'P' to the north. You step into it. You see another 'P' to the east. You step into it. Then you look around... but there is no 'L' anywhere!\n\nYou hit a dead end. But you don't panic. You simply step backward into the first 'P' room, erase your chalk "X", and try a different door (maybe south this time).\n\nThis strategy of exploring a path deeply, marking where you've been, and retreating when you hit a dead end to try another route finds valid paths efficiently.`
      }
    }
  };

  // Fallback story for unlisted problems
  const fallback = {
    intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
    scenario: {
      title: 'The Algorithmic Journey',
      story: `Every complex algorithm is ultimately just a formal set of instructions mimicking how humans solve problems naturally.\n\nWhether it is organizing a bookshelf, finding a name in a phonebook, or finding the fastest route home, data structures are digital reflections of our physical world.\n\nBy breaking down this problem into its core logical steps, you will find that the solution is simply doing what your brain would do if you had to process the situation by hand.`
    }
  };

  return MOCK_ANALOGIES[problemId] || fallback;
};
