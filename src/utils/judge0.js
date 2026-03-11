// Function to execute code using Judge0 API
// In a production environment, this would call a real Judge0 instance.
// For this demo, we use an intelligent mock that compares the submitted code
// against each question's correct solution.

/**
 * @param {string} sourceCode - The code submitted by the student
 * @param {number} languageId - The Judge0 language ID (71=Python, 62=Java, 54=C++)
 * @param {string} stdin - The test input
 * @param {object} question - The question object containing correctCode, expectedOutput, buggyCode
 */
export const executeCode = async (sourceCode, languageId, stdin, question = null) => {
    try {
        return mockJudgeExecution(sourceCode, languageId, stdin, question);
    } catch (error) {
        console.error("Execution error", error);
        throw new Error(error.message || 'Judge0 execution failed');
    }
};

/**
 * Normalize code for comparison: strips all whitespace differences,
 * trailing spaces, blank lines, etc. so minor formatting changes
 * don't prevent a correct answer from being accepted.
 */
const normalizeCode = (code) => {
    if (!code) return '';
    return code
        .replace(/\r\n/g, '\n')       // Normalize line endings
        .split('\n')
        .map(line => line.trimEnd())    // Remove trailing spaces per line
        .join('\n')
        .trim();                        // Remove leading/trailing blank lines
};

const mockJudgeExecution = async (sourceCode, languageId, stdin, question) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const isPython = languageId === 71;
    const isJava = languageId === 62;
    const isCpp = languageId === 54;

    let stdout = '';
    let compileOutput = null;
    let stderr = null;
    let status = { id: 3, description: 'Accepted' };

    // If we have the question object, do an intelligent comparison
    if (question && question.correctCode && question.expectedOutput) {
        const submittedNorm = normalizeCode(sourceCode);
        const correctNorm = normalizeCode(question.correctCode);
        const buggyNorm = normalizeCode(question.buggyCode);

        // Check for common syntax errors first
        if (!isPython && sourceCode && !sourceCode.includes(';')) {
            compileOutput = "error: expected ';'";
            status = { id: 6, description: 'Compilation Error' };
            return { stdout: null, stderr, compile_output: compileOutput, time: "0.012", memory: 2048, status };
        }

        // Python: check for basic SyntaxError patterns from buggy code
        if (isPython) {
            // Check if the buggy code has a missing colon and user hasn't fixed it
            if (question.buggyCode.includes('if num > 0\n') && sourceCode.includes('if num > 0\n')) {
                stderr = "SyntaxError: expected ':'";
                status = { id: 11, description: 'Runtime Error' };
                return { stdout: null, stderr, compile_output: null, time: "0.012", memory: 2048, status };
            }
            // Check for NameError patterns (misspelled variables)
            if (question.buggyCode.includes('totl_price') && sourceCode.includes('totl_price')) {
                stderr = "NameError: name 'totl_price' is not defined";
                status = { id: 11, description: 'Runtime Error' };
                return { stdout: null, stderr, compile_output: null, time: "0.012", memory: 2048, status };
            }
        }

        // If the submitted code matches the correct code, return expectedOutput
        if (submittedNorm === correctNorm) {
            stdout = question.expectedOutput;
        }
        // If the submitted code is still the buggy code (unchanged), simulate the buggy behavior
        else if (submittedNorm === buggyNorm) {
            stdout = getBuggyOutput(question, languageId);
        }
        // Otherwise, try to intelligently determine if the key fix was applied
        else {
            stdout = analyzePartialFix(sourceCode, question, languageId);
        }
    } else {
        // Fallback: no question context available
        stdout = 'Wrong output simulated.';
    }

    return {
        stdout: status.id === 3 ? stdout : null,
        stderr,
        compile_output: compileOutput,
        time: "0.012",
        memory: 2048,
        status
    };
};

/**
 * Returns a simulated "buggy" output for unchanged buggy code
 */
const getBuggyOutput = (question, languageId) => {
    const id = question.id;

    // Python buggy outputs
    const pythonBuggy = {
        'p_e1': null,  // SyntaxError - handled above
        'p_e2': null,  // NameError - handled above
        'p_m1': '[1, 2, 3, 4]',
        'p_m2': null,  // IndexError
        'p_m3': 'True',  // -2 is even, so or returns True (buggy)
        'p_m4': '0',     // result starts at 0, 0 * anything = 0
        'p_h1': '16',    // base case returns 1 instead of 0
        'p_h2': '[2, 6, 8, 5]',  // skips elements when removing during iteration
        'p_h3': '[5]',   // first call works, subsequent calls accumulate
        'p_h4': '2',     // inner loop iterates matrix instead of row
    };

    // Java buggy outputs
    const javaBuggy = {
        'j_e1': null,  // Compilation error
        'j_e2': null,  // Compilation error
        'j_m1': null,  // ArrayIndexOutOfBoundsException
        'j_m2': 'Not Equal',  // == compares references
        'j_m3': '1234',       // stops at 4
        'j_m4': 'Odd',        // checks == 1 which is wrong for even
        'j_h1': null,  // ConcurrentModificationException
        'j_h2': '0',   // value = value shadows
        'j_h3': null,  // NullPointerException
        'j_h4': null,  // StackOverflow
    };

    // C++ buggy outputs
    const cppBuggy = {
        'c_e1': null,  // Compilation error
        'c_e2': null,  // Compilation error
        'c_m1': '32773',  // garbage value
        'c_m2': '10 20 30 0 ',  // out of bounds reads garbage
        'c_m3': null,   // missing return - undefined behavior
        'c_m4': 'Ten',  // assignment always truthy
        'c_h1': '5',    // works but leaks (output same)
        'c_h2': '42',   // undefined behavior but may work
        'c_h3': '333',  // sorting destroys values
        'c_h4': null,   // infinite recursion
    };

    let buggyOutput;
    if (languageId === 71) buggyOutput = pythonBuggy[id];
    else if (languageId === 62) buggyOutput = javaBuggy[id];
    else if (languageId === 54) buggyOutput = cppBuggy[id];

    if (buggyOutput === null || buggyOutput === undefined) {
        // Simulate a runtime error
        return 'Runtime error in execution';
    }
    return buggyOutput;
};

/**
 * Analyzes partially fixed code to see if the key fix was applied.
 * This checks for the essential change in each question.
 */
const analyzePartialFix = (sourceCode, question, languageId) => {
    const id = question.id;
    const code = sourceCode || '';

    // Python questions
    if (id === 'p_e1') {
        // Fix: add colon after "if num > 0"
        return code.includes('if num > 0:') ? question.expectedOutput : 'SyntaxError';
    }
    if (id === 'p_e2') {
        return code.includes('total_price') && code.includes('return total_price') ? question.expectedOutput : 'NameError';
    }
    if (id === 'p_m1') {
        return code.includes('<= 5') || code.includes('< 6') ? question.expectedOutput : '[1, 2, 3, 4]';
    }
    if (id === 'p_m2') {
        return (code.includes('[-1]') || code.includes('[len(lst) - 1]')) ? question.expectedOutput : 'IndexError';
    }
    if (id === 'p_m3') {
        return code.includes('and') && code.includes('n > 0') ? question.expectedOutput : 'True';
    }
    if (id === 'p_m4') {
        return code.includes('result = 1') ? question.expectedOutput : '0';
    }
    if (id === 'p_h1') {
        return (code.includes('return 0') && (code.includes('<= 0') || code.includes('== 0'))) ? question.expectedOutput : '16';
    }
    if (id === 'p_h2') {
        return code.includes('for num in lst') && !code.includes('lst.remove') ? question.expectedOutput : '[2, 6, 8, 5]';
    }
    if (id === 'p_h3') {
        return code.includes('None') ? question.expectedOutput : '[5, 5]';
    }
    if (id === 'p_h4') {
        return code.includes('for val in row') || code.includes('for v in row') ? question.expectedOutput : '2';
    }

    // Java questions
    if (id === 'j_e1') {
        return code.includes('println("Hello World");') || code.includes("println(\"Hello World\");") ? question.expectedOutput : 'Compilation Error';
    }
    if (id === 'j_e2') {
        return code.includes('println') ? question.expectedOutput : 'Compilation Error';
    }
    if (id === 'j_m1') {
        return code.includes('i < arr.length') && !code.includes('i <= arr.length') ? question.expectedOutput : 'ArrayIndexOutOfBoundsException';
    }
    if (id === 'j_m2') {
        return code.includes('.equals(') ? question.expectedOutput : 'Not Equal';
    }
    if (id === 'j_m3') {
        return code.includes('i <= 5') || code.includes('i < 6') ? question.expectedOutput : '1234';
    }
    if (id === 'j_m4') {
        return code.includes('% 2 == 0') ? question.expectedOutput : 'Odd';
    }
    if (id === 'j_h1') {
        return code.includes('removeIf') || code.includes('Iterator') ? question.expectedOutput : 'ConcurrentModificationException';
    }
    if (id === 'j_h2') {
        return code.includes('this.value') ? question.expectedOutput : '0';
    }
    if (id === 'j_h3') {
        return code.includes('text != null') && code.indexOf('text != null') < code.indexOf('text.equals') ? question.expectedOutput : 'NullPointerException';
    }
    if (id === 'j_h4') {
        return code.includes('sum(n - 1)') || code.includes('sum(n-1)') ? question.expectedOutput : 'StackOverflowError';
    }

    // C++ questions
    if (id === 'c_e1') {
        return code.includes('<< endl;') ? question.expectedOutput : 'Compilation Error';
    }
    if (id === 'c_e2') {
        return code.includes('cout <<') && !code.includes('cout >>') ? question.expectedOutput : 'Compilation Error';
    }
    if (id === 'c_m1') {
        return code.includes('sum = 0') ? question.expectedOutput : '32773';
    }
    if (id === 'c_m2') {
        return code.includes('i < 3') && !code.includes('i <= 3') ? question.expectedOutput : '10 20 30 garbage';
    }
    if (id === 'c_m3') {
        return code.includes('return res') ? question.expectedOutput : 'Undefined';
    }
    if (id === 'c_m4') {
        return code.includes('val == 10') ? question.expectedOutput : 'Ten';
    }
    if (id === 'c_h1') {
        return code.includes('delete ptr') ? question.expectedOutput : '5';
    }
    if (id === 'c_h2') {
        return !code.includes('int&') ? question.expectedOutput : '42';
    }
    if (id === 'c_h3') {
        return code.includes('temp') || code.includes('swap') ? question.expectedOutput : '333';
    }
    if (id === 'c_h4') {
        return code.includes('n - 1') || code.includes('n-1') ? question.expectedOutput : 'StackOverflow';
    }

    // Fallback
    return 'Wrong output simulated.';
};
