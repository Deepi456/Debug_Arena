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
        id: 'p_h1', title: 'Recursive Base Case', difficulty: 'Hard',
        description: 'Fix the recursive sum function to prevent it from failing with maximum recursion depth.',
        buggyCode: 'def recursive_sum(n):\n    if n == 0:\n        return 1\n    return n + recursive_sum(n - 1)',
        correctCode: 'def recursive_sum(n):\n    if n <= 0:\n        return 0\n    return n + recursive_sum(n - 1)',
        testInput: '5', expectedOutput: '15',
        explanation: 'The base case returned 1 instead of 0, and didn\'t handle negative boundaries properly, altering the sum.'
    },
    {
        id: 'p_h2', title: 'List Iteration Modification', difficulty: 'Hard',
        description: 'Iterating and removing items from the list causes it to skip elements.',
        buggyCode: 'def remove_evens(lst):\n    for num in lst:\n        if num % 2 == 0:\n            lst.remove(num)\n    return lst',
        correctCode: 'def remove_evens(lst):\n    return [num for num in lst if num % 2 != 0]',
        testInput: '[2, 4, 6, 8, 5]', expectedOutput: '[5]',
        explanation: 'Modifying a list while iterating over it shifts indices, causing elements to be skipped. A list comprehension safely creates a new list.'
    },
    {
        id: 'p_h3', title: 'Default Mutable Arguments', difficulty: 'Hard',
        description: 'Fix the function so it doesn\'t share the same list instance across multiple calls.',
        buggyCode: 'def append_to_list(val, lst=[]):\n    lst.append(val)\n    return lst',
        correctCode: 'def append_to_list(val, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(val)\n    return lst',
        testInput: '5', expectedOutput: '[5]',
        explanation: 'Default arguments are evaluated once in Python. A mutable default like `lst=[]` retains its state between function calls. Use `None` instead.'
    },
    {
        id: 'p_h4', title: 'Nested Loop Duplications', difficulty: 'Hard',
        description: 'Fix the nested loop so it sums the matrix elements correctly without double counting.',
        buggyCode: 'def matrix_sum(matrix):\n    total = 0\n    for row in matrix:\n        for col in matrix:\n            total += col[0]\n    return total',
        correctCode: 'def matrix_sum(matrix):\n    total = 0\n    for row in matrix:\n        for val in row:\n            total += val\n    return total',
        testInput: '[[1, 2], [3, 4]]', expectedOutput: '10',
        explanation: 'The inner loop incorrectly iterated over `matrix` again instead of `row`, summing incorrect columns repeatedly.'
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
        id: 'j_h1', title: 'Concurrent Modification', difficulty: 'Hard',
        description: 'Removing an element during a standard for-each loop throws a ConcurrentModificationException.',
        buggyCode: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));\n        for (String s : list) {\n            if (s.equals("B")) list.remove(s);\n        }\n        System.out.print(list.size());\n    }\n}',
        correctCode: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));\n        list.removeIf(s -> s.equals("B"));\n        System.out.print(list.size());\n    }\n}',
        testInput: '', expectedOutput: '2',
        explanation: 'You cannot remove elements directly from a collection while using a for-each loop. Use `.removeIf()` or an Iterator.'
    },
    {
        id: 'j_h2', title: 'Object-Oriented Scope Hiding', difficulty: 'Hard',
        description: 'Fix the setter method so it assigns the parameter to the class field instead of shadowing it.',
        buggyCode: 'public class Main {\n    int value = 0;\n    public void setValue(int value) {\n        value = value;\n    }\n    public static void main(String[] args) {\n        Main obj = new Main();\n        obj.setValue(10);\n        System.out.print(obj.value);\n    }\n}',
        correctCode: 'public class Main {\n    int value = 0;\n    public void setValue(int value) {\n        this.value = value;\n    }\n    public static void main(String[] args) {\n        Main obj = new Main();\n        obj.setValue(10);\n        System.out.print(obj.value);\n    }\n}',
        testInput: '', expectedOutput: '10',
        explanation: 'Because the parameter name is the same as the field name, `value = value` only reassigns the parameter to itself. You must use `this.value` to target the class field.'
    },
    {
        id: 'j_h3', title: 'Null Reference Logic', difficulty: 'Hard',
        description: 'Fix the safe check so it doesn\'t throw a NullPointerException.',
        buggyCode: 'public class Main {\n    public static void main(String[] args) {\n        String text = null;\n        if (text.equals("hello") && text != null) {\n            System.out.print("Hi");\n        } else {\n            System.out.print("Null");\n        }\n    }\n}',
        correctCode: 'public class Main {\n    public static void main(String[] args) {\n        String text = null;\n        if (text != null && text.equals("hello")) {\n            System.out.print("Hi");\n        } else {\n            System.out.print("Null");\n        }\n    }\n}',
        testInput: '', expectedOutput: 'Null',
        explanation: 'Because `&&` evaluates left-to-right, calling `text.equals()` on a null reference throws an error before it reaches the null check. Order matters.'
    },
    {
        id: 'j_h4', title: 'Stack Overflow Recursion', difficulty: 'Hard',
        description: 'Fix the recursive sum method so it terminates properly.',
        buggyCode: 'public class Main {\n    static int sum(int n) {\n        if (n == 0) return 0;\n        return n + sum(n);\n    }\n    public static void main(String[] args) {\n        System.out.print(sum(3));\n    }\n}',
        correctCode: 'public class Main {\n    static int sum(int n) {\n        if (n == 0) return 0;\n        return n + sum(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.print(sum(3));\n    }\n}',
        testInput: '', expectedOutput: '6',
        explanation: 'The recursive call `sum(n)` did not decrement `n`, causing an infinite recursion loop.'
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
        id: 'c_h1', title: 'Memory Leak (Pointers)', difficulty: 'Hard',
        description: 'Fix the memory leak caused by un-freed heap allocation.',
        buggyCode: '#include <iostream>\nusing namespace std;\nvoid allocate() {\n    int* ptr = new int(5);\n    cout << *ptr;\n}\nint main() {\n    allocate();\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nvoid allocate() {\n    int* ptr = new int(5);\n    cout << *ptr;\n    delete ptr;\n}\nint main() {\n    allocate();\n    return 0;\n}',
        testInput: '', expectedOutput: '5',
        explanation: 'Memory allocated using `new` persists until explicitly freed with `delete`. Failing to delete it causes a memory leak.'
    },
    {
        id: 'c_h2', title: 'Dangling Reference', difficulty: 'Hard',
        description: 'Returning a reference to a local variable leads to unpredictable behavior when the stack frame pops.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint& getNum() {\n    int n = 42;\n    return n;\n}\nint main() {\n    cout << getNum();\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint getNum() {\n    int n = 42;\n    return n;\n}\nint main() {\n    cout << getNum();\n    return 0;\n}',
        testInput: '', expectedOutput: '42',
        explanation: '`n` is a local variable whose memory is freed when `getNum()` returns. Returning a reference to it creates a dangling reference. Return by value instead.'
    },
    {
        id: 'c_h3', title: 'Nested Loop Complexity', difficulty: 'Hard',
        description: 'Fix the sorting logic so it compares items properly rather than rewriting them incorrectly.',
        buggyCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[] = {3, 1, 2};\n    for(int i=0; i<3; i++) {\n        for(int j=0; j<3; j++) {\n            if(arr[i] < arr[j]) {\n                arr[i] = arr[j];\n            }\n        }\n    }\n    for(int x: arr) cout << x;\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[] = {3, 1, 2};\n    for(int i=0; i<3; i++) {\n        for(int j=i+1; j<3; j++) {\n            if(arr[i] > arr[j]) {\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n    }\n    for(int x: arr) cout << x;\n    return 0;\n}',
        testInput: '', expectedOutput: '123',
        explanation: 'The original loop repeatedly destroyed values without using a temporary variable for swapping, corrupting the array.'
    },
    {
        id: 'c_h4', title: 'Endless Recursion Error', difficulty: 'Hard',
        description: 'Fix the recursive countdown so it terminates gracefully at 0.',
        buggyCode: '#include <iostream>\nusing namespace std;\nvoid countdown(int n) {\n    if (n == 0) return;\n    cout << n;\n    countdown(n);\n}\nint main() {\n    countdown(3);\n    return 0;\n}',
        correctCode: '#include <iostream>\nusing namespace std;\nvoid countdown(int n) {\n    if (n == 0) return;\n    cout << n;\n    countdown(n - 1);\n}\nint main() {\n    countdown(3);\n    return 0;\n}',
        testInput: '', expectedOutput: '321',
        explanation: 'The recursive call `countdown(n)` passed the same value continuously, resulting in an infinite recursion stack overflow.'
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
