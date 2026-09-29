export const getAnalogyForProblem = (problemId) => {
  const MOCK_ANALOGIES = {
    'two-sum': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Budget Shopping Trip',
        story: `Imagine you are at a supermarket with a very strict shopping list. You have a gift card worth exactly ₹900, and you want to buy exactly two items that will use up the entire balance. No more, no less.\n\nInstead of blindly picking up an item and walking through the entire store trying to find another item that perfectly matches the remaining balance (which would take forever), you decide to use your memory.\n\nAs you walk down the aisle, you pick up a ₹200 item. You mentally calculate: "I need a ₹700 item to finish my shopping." You keep the ₹200 item in mind. Later, you spot a ₹700 item. Because you remembered the first item, you instantly know you've found your perfect pair without having to search the store twice!\n\nThis is exactly how the Two Sum algorithm works using a Hash Map. It walks through the array once, remembers the elements it has seen, and instantly checks if the "missing complement" has already been found.`
      }
    },
    'valid-parentheses': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Russian Nesting Dolls',
        story: `Think of a set of beautiful Russian Matryoshka dolls. When you are assembling them, every time you open a bottom half of a doll (an opening bracket), you must eventually cap it with its exact matching top half (a closing bracket).\n\nIf you open a large red doll, then open a medium blue doll inside it, and finally a small green doll inside that... you cannot just put the large red lid on right away. You must close the small green doll first, then the medium blue doll, and finally the large red one.\n\nThe last doll you opened must be the first one you close. If you try to put a square lid on a round box, or close the outer box before the inner box is sealed, the whole set breaks.\n\nThis Last-In, First-Out (LIFO) behavior is perfectly mirrored by the Stack data structure used to solve the Valid Parentheses problem.`
      }
    },
    'reverse-linked-list': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Flipping the Scavenger Hunt',
        story: `Imagine you are on a scavenger hunt. You are given a clue that leads you to Location A. At Location A, you find a note that says "Go to Location B." At Location B, a note says "Go to Location C," and so on until the finish line.\n\nNow, imagine the organizers want to completely reverse the scavenger hunt for the next group. They ask you to walk the path, and at every location, change the note to point backwards to where you just came from.\n\nTo do this, when you are at Location B, you need to remember where you came from (Location A) so you can point B's note back to A. But before you change B's note, you must quickly write down where B was originally pointing (Location C) so you don't lose the rest of the trail!\n\nThis careful juggling of three pointers—previous, current, and next—is exactly how a Linked List is reversed in place.`
      }
    },
    'binary-tree-inorder': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Reading a Family Tree',
        story: `Imagine you are looking at a vast, ancient family tree drawn on a wall. You want to read all the names in alphabetical order, and the tree was designed in a very specific way: for any given person, all relatives on their left branch come before them alphabetically, and all relatives on their right branch come after them.\n\nTo read the names correctly, you can't just read the person at the top first. You must trace the line all the way down to the furthest left branch, read that name, then read the parent's name, and then check the right branch.\n\nYou repeat this exact same "Left, Self, Right" process for every single family member on the wall. This naturally recurring exploration is what we call an Inorder Traversal using Depth First Search (DFS).`
      }
    },
    'kth-largest-element': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The VIP Leaderboard',
        story: `Imagine you are running an arcade tournament, and you only have prizes for the Top 3 players (k=3). \n\nAs hundreds of players finish their games and shout out their scores, you could write every single score down on a giant whiteboard and then sort the entire board at the very end. But that takes too much time and space.\n\nInstead, you just keep a small chalkboard with exactly 3 slots. When a new score is announced, you look at the lowest score on your chalkboard. If the new score is higher than your lowest score, you erase the lowest one and write the new one in. If it's not, you ignore it.\n\nAt the end of the tournament, the person at the very bottom of your 3-slot chalkboard is exactly the 3rd best player! This is exactly how a Min-Heap of size K efficiently finds the Kth largest element without sorting the whole array.`
      }
    },
    'sliding-window-maximum': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'The Camera Viewfinder',
        story: `Imagine you are a photographer looking through a small rectangular camera viewfinder. You are panning your camera across a beautiful skyline of buildings of various heights from left to right.\n\nYour viewfinder can only fit exactly 3 buildings at a time (your "window size"). Your goal is to record the height of the tallest building visible in your viewfinder at every single moment as you pan across the city.\n\nInstead of re-scanning all 3 buildings every time you move the camera an inch, you just keep track of the reigning champion. When a taller building enters the frame, it becomes the new champion. When the old champion slides out of the left side of the frame, you look for the next tallest building still in view.\n\nThis continuous shifting of a fixed-size frame over a landscape of data is the essence of the Sliding Window technique.`
      }
    },
    'number-of-islands': {
      intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
      scenario: {
        title: 'Exploring Uncharted Archipelago',
        story: `Imagine you are an explorer flying over an uncharted ocean dotted with islands. You have a blank map, and your job is to count exactly how many distinct islands exist.\n\nYou decide to parachute down onto the first piece of land you see. To ensure you don't count this island twice, you pull out a red marker and paint the ground you are standing on. Then, you walk north, south, east, and west, painting all connected landmasses red until you hit water in every direction.\n\nOnce the entire island is painted, you fly back up into the sky. You scan the ocean again. If you see unpainted land, you know it must be a brand new island! You parachute down and repeat the process.\n\nThis methodical exploration and marking of connected land is exactly how Breadth-First Search (BFS) or Depth-First Search (DFS) counts connected components in a grid.`
      }
    }
  };

  // Fallback story for unlisted problems
  const fallback = {
    intro: { subtitle: 'A familiar situation that mirrors this algorithm.' },
    scenario: {
      title: 'The Algorithmic Journey',
      story: `Every complex algorithm is ultimately just a formal set of instructions mimicking how humans solve problems naturally. \n\nWhether it is organizing a bookshelf (sorting), finding a name in a phonebook (binary search), or finding the fastest route home (shortest path on a graph), data structures are just digital reflections of our physical world.\n\nBy breaking down this problem into its core logical steps, you will find that the code is simply doing what your brain would do if you had to process the data by hand.`
    }
  };

  return MOCK_ANALOGIES[problemId] || fallback;
};
