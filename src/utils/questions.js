// src/utils/questions.js

export const pythonQuestions = [
    // Easy (2)
    {
        id: 'p_e1', title: 'Missing Colon', difficulty: 'Easy',
        description: 'Fix the syntax error in the conditional statement.',
        buggyCode: 'def check_positive(num):\n    if num > 0\n        return True\n    return False',
        correctCode: 'def check_positive(num):\n    if num > 0:\n        return True\n    return False',
        testInput: '5', expectedOutput: 'True',
        explanation: 'Python requires a colon (:) at the end of conditional statements like if, elif, and else.'
    },
    {
        id: 'p_e2', title: 'Variable Typo', difficulty: 'Easy',
        description: 'Fix the variable naming error that causes a NameError.',
        buggyCode: 'def calculate_total(price, tax):\n    total_price = price + tax\n    return totl_price',
        correctCode: 'def calculate_total(price, tax):\n    total_price = price + tax\n    return total_price',
        testInput: '10, 2', expectedOutput: '12',
        explanation: 'The variable returned was misspelled as "totl_price" instead of the defined "total_price".'
    },
    // Medium (4)
    {
        id: 'p_m1', title: 'Incorrect Loop Condition', difficulty: 'Medium',
        description: 'The loop should print numbers from 1 to 5, but it behaves incorrectly.',
        buggyCode: 'def print_numbers():\n    i = 1\n    res = []\n    while i < 5:\n        res.append(i)\n        i += 1\n    return res',
        correctCode: 'def print_numbers():\n    i = 1\n    res = []\n    while i <= 5:\n        res.append(i)\n        i += 1\n    return res',
        testInput: '', expectedOutput: '[1, 2, 3, 4, 5]',
        explanation: 'The condition `i < 5` stops at 4. It must be `i <= 5` or `i < 6` to include 5.'
    },
    {
        id: 'p_m2', title: 'List Indexing Mistake', difficulty: 'Medium',
        description: 'Fix the function so it safely returns the last element of the list.',
        buggyCode: 'def get_last(lst):\n    return lst[len(lst)]',
        correctCode: 'def get_last(lst):\n    return lst[-1]',
        testInput: '[10, 20, 30]', expectedOutput: '30',
        explanation: 'Indices are 0-based, so `len(lst)` is out of bounds. The last element is at `len(lst) - 1` or simply `-1`.'
    },
    {
        id: 'p_m3', title: 'Incorrect Conditional', difficulty: 'Medium',
        description: 'Fix the logic to correctly identify if a number is even and positive.',
        buggyCode: 'def even_and_positive(n):\n    if n % 2 == 0 or n > 0:\n        return True\n    return False',
        correctCode: 'def even_and_positive(n):\n    if n % 2 == 0 and n > 0:\n        return True\n    return False',
        testInput: '-2', expectedOutput: 'False',
        explanation: 'The `or` operator makes it return True if it is even OR positive. It should be `and` for both conditions to be met.'
    },
    {
        id: 'p_m4', title: 'Factorial Logic Error', difficulty: 'Medium',
        description: 'Fix the factorial algorithm logic so it computes correctly.',
        buggyCode: 'def factorial(n):\n    result = 0\n    for i in range(1, n + 1):\n        result *= i\n    return result',
        correctCode: 'def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result',
        testInput: '4', expectedOutput: '24',
        explanation: 'The initial value of result was 0. Multiplying anything by 0 results in 0. It must be initialized to 1.'
    },
    // Hard (4)
    {
        id: 'p_h1', title: 'Recursive DP Target Sum', difficulty: 'Hard',
        description: 'Fix the recursive function to correctly compute combinations to reach a target sum without infinite recursion or incorrect memoization.',
        buggyCode: 'def count_ways(target, memo={}):\n    if target == 0:\n        return 1\n    if target < 0:\n        return 0\n    if target in memo:\n        return memo[target]\n    \n    memo[target] = count_ways(target - 1) + count_ways(target - 2)\n    return memo[target]',
        correctCode: 'def count_ways(target, memo=None):\n    if memo is None:\n        memo = {}\n    if target == 0:\n        return 1\n    if target < 0:\n        return 0\n    if target in memo:\n        return memo[target]\n    \n    memo[target] = count_ways(target - 1, memo) + count_ways(target - 2, memo)\n    return memo[target]',
        testInput: '4', expectedOutput: '5',
        explanation: 'Default mutable arguments like memo={} share state across all calls, causing incorrect results on subsequent executions. Also, the recursive calls omitted the memo argument entirely, rebuilding it uselessly.'
    },
    {
        id: 'p_h2', title: 'Nested Loop Anagram Grouping', difficulty: 'Hard',
        description: 'Fix the nested loop grouping logic to correctly map anagrams from a list of strings.',
        buggyCode: 'def group_anagrams(words):\n    res = []\n    for w in words:\n        added = False\n        for group in res:\n            if sorted(group[0]) == sorted(w):\n                group.append(w)\n        if not added:\n            res.append([w])\n    return res',
        correctCode: 'def group_anagrams(words):\n    res = []\n    for w in words:\n        added = False\n        for group in res:\n            if sorted(group[0]) == sorted(w):\n                group.append(w)\n                added = True\n                break\n        if not added:\n            res.append([w])\n    return res',
        testInput: '["eat", "tea", "bat"]', expectedOutput: '[[\'eat\', \'tea\'], [\'bat\']]',
        explanation: 'The loop forgot to set `added = True` and break when a match was found, causing the word to be added as a duplicate new group anyway.'
    },
    {
        id: 'p_h3', title: 'Edge Case Palindrome', difficulty: 'Hard',
        description: 'Fix the two-pointer loop condition to correctly identify valid palindromes, correctly skipping non-alphanumeric characters.',
        buggyCode: 'def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if not s[left].isalnum():\n            left += 1\n        if not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True',
        correctCode: 'def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if not s[left].isalnum():\n            left += 1\n            continue\n        if not s[right].isalnum():\n            right -= 1\n            continue\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True',
        testInput: '"A man, a plan, a canal: Panama"', expectedOutput: 'True',
        explanation: 'Missing `continue` after pointer adjustments means it immediately attempts to compare characters before re-checking if the adjusted pointers still point to non-alphanumeric characters or have crossed.'
    },
    {
        id: 'p_h4', title: 'Binary Search Edge Condition', difficulty: 'Hard',
        description: 'Fix the binary search implementation to correctly find the first occurrence of a target avoiding infinite loops.',
        buggyCode: 'def find_first(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            right = mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return left if arr[left] == target else -1',
        correctCode: 'def find_first(arr, target):\n    if not arr:\n        return -1\n    left, right = 0, len(arr) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            right = mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return left if left < len(arr) and arr[left] == target else -1',
        testInput: '[1, 2, 2, 2, 3], 2', expectedOutput: '1',
        explanation: '`while left <= right:` combined with `right = mid` will cause an infinite loop when left == right. It should be `while left < right` with bounds checking on return.'
    }
];

export const javaQuestions = [
    // Easy (2)
    {
        id: 'j_e1', title: 'Missing Semicolon', difficulty: 'Easy',
        description: 'Fix the syntax error stopping the code from compiling.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World")\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
        testInput: '', expectedOutput: 'Hello World',
        explanation: 'Java statements must be terminated with a semicolon (;).'
    },
    {
        id: 'j_e2', title: 'Print Typo', difficulty: 'Easy',
        description: 'Fix the typo in the standard output method.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.printl("Debug Arena");\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Debug Arena");\n    }\n}',
        testInput: '', expectedOutput: 'Debug Arena',
        explanation: 'The correct method name is `println` or `print`, not `printl`.'
    },
    // Medium (4)
    {
        id: 'j_m1', title: 'Array Index Out of Bounds', difficulty: 'Medium',
        description: 'Fix the loop so it does not throw an ArrayIndexOutOfBoundsException.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        for (int i = 0; i <= arr.length; i++) {\n            System.out.print(arr[i]);\n        }\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        for (int i = 0; i < arr.length; i++) {\n            System.out.print(arr[i]);\n        }\n    }\n}',
        testInput: '', expectedOutput: '123',
        explanation: 'Array indices are 0-based. The condition `i <= arr.length` accesses an index equal to the length, which is out of bounds. It must be `< arr.length`.'
    },
    {
        id: 'j_m2', title: 'String Equality', difficulty: 'Medium',
        description: 'Fix the condition so it correctly compares the content of the strings.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        String a = new String("Java");\n        String b = new String("Java");\n        if (a == b) System.out.print("Equal");\n        else System.out.print("Not Equal");\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        String a = new String("Java");\n        String b = new String("Java");\n        if (a.equals(b)) System.out.print("Equal");\n        else System.out.print("Not Equal");\n    }\n}',
        testInput: '', expectedOutput: 'Equal',
        explanation: 'The `==` operator compares memory references. The `.equals()` method compares the actual textual content of the strings.'
    },
    {
        id: 'j_m3', title: 'Off-By-One Logic', difficulty: 'Medium',
        description: 'Fix the loop bounds so it prints numbers 1 to 5 exactly.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i < 5; i++) {\n            System.out.print(i);\n        }\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.print(i);\n        }\n    }\n}',
        testInput: '', expectedOutput: '12345',
        explanation: '`i < 5` stops at 4. Changing it to `i <= 5` ensures 5 is included in the output.'
    },
    {
        id: 'j_m4', title: 'Incorrect Conditional Execution', difficulty: 'Medium',
        description: 'Fix the logic so that "Even" is only printed for even numbers.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        int num = 4;\n        if (num % 2 == 1)\n            System.out.print("Even");\n        else\n            System.out.print("Odd");\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        int num = 4;\n        if (num % 2 == 0)\n            System.out.print("Even");\n        else\n            System.out.print("Odd");\n    }\n}',
        testInput: '', expectedOutput: 'Even',
        explanation: '`num % 2 == 1` checks for odd numbers. It should be `== 0` to identify even numbers.'
    },
    // Hard (4)
    {
        id: 'j_h1', title: 'Class Object Reference Error', difficulty: 'Hard',
        description: 'Fix the class constructor logic where shallow copying causes shared mutations in an object wrapper.',
        buggyCode: 'class Wrapper {\n    int[] data;\n    Wrapper(int[] arr) {\n        this.data = arr;\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        Wrapper w1 = new Wrapper(arr);\n        Wrapper w2 = new Wrapper(arr);\n        w1.data[0] = 99;\n        System.out.print(w2.data[0]);\n    }\n}',
        correctCode: 'class Wrapper {\n    int[] data;\n    Wrapper(int[] arr) {\n        this.data = arr.clone();\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        Wrapper w1 = new Wrapper(arr);\n        Wrapper w2 = new Wrapper(arr);\n        w1.data[0] = 99;\n        System.out.print(w2.data[0]);\n    }\n}',
        testInput: '', expectedOutput: '1',
        explanation: 'Assigning the array directly makes both Wrapper instances share the same memory reference. Mutating one mutates the other. `.clone()` creates a necessary deep copy.'
    },
    {
        id: 'j_h2', title: 'Data Structure Usage', difficulty: 'Hard',
        description: 'Fix the HashMap usage in the loop that incorrectly overwrites entries when counting character frequencies.',
        buggyCode: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        String s = "hello";\n        Map<Character, Integer> map = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            if (map.containsKey(c)) {\n                map.put(c, map.get(c));\n            } else {\n                map.put(c, 1);\n            }\n        }\n        System.out.print(map.get(\'l\'));\n    }\n}',
        correctCode: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        String s = "hello";\n        Map<Character, Integer> map = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            if (map.containsKey(c)) {\n                map.put(c, map.get(c) + 1);\n            } else {\n                map.put(c, 1);\n            }\n        }\n        System.out.print(map.get(\'l\'));\n    }\n}',
        testInput: '', expectedOutput: '2',
        explanation: 'The code replaced the character count with its current count `map.get(c)` instead of incrementing it `map.get(c) + 1`.'
    },
    {
        id: 'j_h3', title: 'Missing Recursive Base Condition', difficulty: 'Hard',
        description: 'Fix the Depth First Search function to avoid a StackOverflowError by adding a tracking mechanism.',
        buggyCode: 'import java.util.*;\npublic class Main {\n    static void dfs(int node, Map<Integer, List<Integer>> graph) {\n        System.out.print(node + " ");\n        if (!graph.containsKey(node)) return;\n        for (int neighbor : graph.get(node)) {\n            dfs(neighbor, graph);\n        }\n    }\n    public static void main(String[] args) {\n        Map<Integer, List<Integer>> g = new HashMap<>();\n        g.put(1, Arrays.asList(2));\n        g.put(2, Arrays.asList(1));\n        dfs(1, g);\n    }\n}',
        correctCode: 'import java.util.*;\npublic class Main {\n    static void dfs(int node, Map<Integer, List<Integer>> graph, Set<Integer> visited) {\n        if (visited.contains(node)) return;\n        visited.add(node);\n        System.out.print(node + " ");\n        if (!graph.containsKey(node)) return;\n        for (int neighbor : graph.get(node)) {\n            dfs(neighbor, graph, visited);\n        }\n    }\n    public static void main(String[] args) {\n        Map<Integer, List<Integer>> g = new HashMap<>();\n        g.put(1, Arrays.asList(2));\n        g.put(2, Arrays.asList(1));\n        dfs(1, g, new HashSet<>());\n    }\n}',
        testInput: '', expectedOutput: '1 2 ',
        explanation: 'Graphs with cycles require tracking visited nodes. The missing base condition `if (visited.contains(...))` causes an infinite loop bouncing between nodes 1 and 2.'
    },
    {
        id: 'j_h4', title: 'Incorrect Return Logic in Loop', difficulty: 'Hard',
        description: 'Fix the method to find the maximum element so it evaluates properly and does not return prematurely.',
        buggyCode: 'public class Main {\n    static int findMax(int[] arr) {\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] > max) {\n                max = arr[i];\n                return max;\n            }\n        }\n        return max;\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 5, 2, 9};\n        System.out.print(findMax(arr));\n    }\n}',
        correctCode: 'public class Main {\n    static int findMax(int[] arr) {\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] > max) {\n                max = arr[i];\n            }\n        }\n        return max;\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 5, 2, 9};\n        System.out.print(findMax(arr));\n    }\n}',
        testInput: '', expectedOutput: '9',
        explanation: 'Placing `return max;` inside the `if` block forces the method to immediately end on the first element found greater than the minimum, returning 1 instead of continuing to check the rest.'
    }
];

export const cppQuestions = [
    // Easy (2)
    {
        id: 'c_e1', title: 'Missing Semicolon (C++)', difficulty: 'Easy',
        description: 'Fix the compilation error.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello" << endl\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello" << endl;\n    return 0;\n}',
        testInput: '', expectedOutput: 'Hello\n',
        explanation: 'A semicolon is required at the end of every statement in C++.'
    },
    {
        id: 'c_e2', title: 'Cout Typo', difficulty: 'Easy',
        description: 'Fix the stream mismatch.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    cout >> "Arena" >> endl;\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Arena" << endl;\n    return 0;\n}',
        testInput: '', expectedOutput: 'Arena\n',
        explanation: 'The insertion operator `<<` is used with `cout`, while the extraction operator `>>` is for `cin`.'
    },
    // Medium (4)
    {
        id: 'c_m1', title: 'Uninitialized Variable', difficulty: 'Medium',
        description: 'Fix the uninitialized accumulator giving garbage sum outputs.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int sum;\n    for(int i = 1; i <= 3; i++) sum += i;\n    cout << sum;\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int sum = 0;\n    for(int i = 1; i <= 3; i++) sum += i;\n    cout << sum;\n    return 0;\n}',
        testInput: '', expectedOutput: '6',
        explanation: 'In C++, local variables are not initialized automatically. `sum` contained garbage memory, so applying `+=` corrupted the output.'
    },
    {
        id: 'c_m2', title: 'Array Bounds Error', difficulty: 'Medium',
        description: 'Fix the loop so it does not read outside the array boundaries.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[3] = {10, 20, 30};\n    for(int i = 0; i <= 3; i++) cout << arr[i] << " ";\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[3] = {10, 20, 30};\n    for(int i = 0; i < 3; i++) cout << arr[i] << " ";\n    return 0;\n}',
        testInput: '', expectedOutput: '10 20 30 ',
        explanation: 'An array of size 3 only has indices 0, 1, and 2. Attempting to access index 3 goes out of bounds.'
    },
    {
        id: 'c_m3', title: 'Missing Return', difficulty: 'Medium',
        description: 'Fix the function so it safely returns the multiplied value.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint multiply(int a, int b) {\n    int res = a * b;\n}\nint main() {\n    cout << multiply(2, 4);\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint multiply(int a, int b) {\n    int res = a * b;\n    return res;\n}\nint main() {\n    cout << multiply(2, 4);\n    return 0;\n}',
        testInput: '', expectedOutput: '8',
        explanation: 'Functions declaring a non-void return type in C++ must return a valid value of that type.'
    },
    {
        id: 'c_m4', title: 'Logical Assignment Mistake', difficulty: 'Medium',
        description: 'Fix the logic branch so it checks equality rather than assigning a value.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int val = 5;\n    if (val = 10) cout << "Ten";\n    else cout << "Five";\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int val = 5;\n    if (val == 10) cout << "Ten";\n    else cout << "Five";\n    return 0;\n}',
        testInput: '', expectedOutput: 'Five',
        explanation: '`val = 10` is an assignment that returns 10, which evaluates to true. You must use `val == 10` for an equality check.'
    },
    // Hard (4)
    {
        id: 'c_h1', title: 'Memory Leak & Pointer Math', difficulty: 'Hard',
        description: 'Fix the dynamic array allocation logic to correctly clean up memory and prevent dangling pointers.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint* createArray(int size) {\n    int arr[size];\n    for(int i = 0; i < size; i++) arr[i] = i;\n    return arr;\n}\nint main() {\n    int* ptr = createArray(3);\n    cout << ptr[1];\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint* createArray(int size) {\n    int* arr = new int[size];\n    for(int i = 0; i < size; i++) arr[i] = i;\n    return arr;\n}\nint main() {\n    int* ptr = createArray(3);\n    cout << ptr[1];\n    delete[] ptr;\n    return 0;\n}',
        testInput: '', expectedOutput: '1',
        explanation: 'Returning a pointer to a local stack array `int arr[size];` results in undefined behavior (dangling pointer) when the stack frame pops. Allocate dynamically using `new[]`.'
    },
    {
        id: 'c_h2', title: 'Complex Pointer Casting Warning', difficulty: 'Hard',
        description: 'Fix the memory block modification logic where pointer arithmetic steps out of bounds.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[2] = {10, 20};\n    int* ptr = arr;\n    *(ptr + 1) = 30;\n    ptr++;\n    ptr++;\n    *ptr = 40;\n    cout << arr[0] << arr[1];\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[2] = {10, 20};\n    int* ptr = arr;\n    *(ptr + 1) = 30;\n    cout << arr[0] << arr[1];\n    return 0;\n}',
        testInput: '', expectedOutput: '1030',
        explanation: 'Iterating the pointer twice (`ptr++`) moves it past the boundaries of the 2-element array. Dereferencing and writing to `*ptr = 40;` corrupts adjacent memory yielding a core dump.'
    },
    {
        id: 'c_h3', title: 'Nested Loop Iterator Invalidated', difficulty: 'Hard',
        description: 'Fix the vector element removal inside a loop which invalidates iterators leading to a crash.',
        buggyCode: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> v = {1, 2, 2, 3};\n    for(auto it = v.begin(); it != v.end(); ++it) {\n        if(*it == 2) v.erase(it);\n    }\n    for(int n : v) cout << n;\n    return 0;\n}',
        correctCode: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> v = {1, 2, 2, 3};\n    for(auto it = v.begin(); it != v.end(); ) {\n        if(*it == 2) it = v.erase(it);\n        else ++it;\n    }\n    for(int n : v) cout << n;\n    return 0;\n}',
        testInput: '', expectedOutput: '13',
        explanation: 'Calling `v.erase(it)` invalidates the iterator `it`. The loop definition unconditionally increments it (`++it`), skipping the next element or crashing. Erase returns the next valid iterator.'
    },
    {
        id: 'c_h4', title: 'Data Structure Map Traversal', difficulty: 'Hard',
        description: 'Fix the mapping edge condition where accessing keys by index accidentally creates default elements.',
        buggyCode: '#include <iostream>\n#include <map>\nusing namespace std;\nint main() {\n    map<int, string> m;\n    m[1] = "A";\n    if(m[2] == "B") cout << "Found ";\n    cout << m.size();\n    return 0;\n}',
        correctCode: '#include <iostream>\n#include <map>\nusing namespace std;\nint main() {\n    map<int, string> m;\n    m[1] = "A";\n    if(m.find(2) != m.end() && m[2] == "B") cout << "Found ";\n    cout << m.size();\n    return 0;\n}',
        testInput: '', expectedOutput: '1',
        explanation: 'Using `m[2]` physically inserts the key `2` with a default value into the map if it doesn\'t exist, causing the total size to jump to 2 incorrectly. Use `m.find()` to check existence.'
    }
];

// Seeded random number generator for generating the same sequence for a specific student's exam session
function seedRandom(seed) {
    let h = 0xdeadbeef;
    for (let i = 0; i < seed.length; i++)
        h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

export const getQuestionsForExam = (language, eventCode, studentId) => {
    let baseBank = [];
    if (language === 'Python') baseBank = pythonQuestions;
    else if (language === 'Java') baseBank = javaQuestions;
    else if (language === 'C++') baseBank = cppQuestions;
    else baseBank = pythonQuestions;

    // We statically define exactly 2, 4, and 4 in each language list.
    const easy = baseBank.filter(q => q.difficulty === 'Easy').slice(0, 2);
    const medium = baseBank.filter(q => q.difficulty === 'Medium').slice(0, 4);
    const hard = baseBank.filter(q => q.difficulty === 'Hard').slice(0, 4);

    const combined = [...easy, ...medium, ...hard];

    // Shuffle using seeded random tied to the specific student's exam
    const rng = seedRandom((eventCode || 'default') + '_' + (studentId || 'default'));
    
    const shuffled = [...combined];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = rng() % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};
