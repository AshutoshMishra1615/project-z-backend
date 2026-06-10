package engine

import (
	"strings"
)

// WrapWithDriver takes the user's code, the language, and the problem ID,
// and wraps it in a problem-specific hidden driver script (LeetCode style).
// If no driver is found for the given combination, it returns the user code unchanged.
func WrapWithDriver(userCode string, language string, problemID int64) string {
	drivers := getDrivers()
	
	langDrivers, ok := drivers[problemID]
	if !ok {
		return userCode
	}

	driverTemplate, ok := langDrivers[language]
	if !ok {
		return userCode
	}

	return strings.ReplaceAll(driverTemplate, "{{USER_CODE}}", userCode)
}

func getDrivers() map[int64]map[string]string {
	return map[int64]map[string]string{
		// Problem 1: Two Sum
		1: {
			"python": `import sys
import json
from typing import *

# --- USER CODE ---
{{USER_CODE}}
# --- END USER CODE ---

if __name__ == '__main__':
    input_data = sys.stdin.read().strip().split('\n')
    if len(input_data) < 2: sys.exit(0)
    try:
        nums = json.loads(input_data[0])
        target = int(input_data[1])
        res = Solution().twoSum(nums, target)
        print(json.dumps(res).replace(" ", ""))
    except Exception as e:
        print(str(e))
`,
			"cpp": `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// --- USER CODE ---
{{USER_CODE}}
// --- END USER CODE ---

int main() {
    string arrayStr;
    int target;
    if (!(cin >> arrayStr >> target)) return 0;
    
    if (arrayStr.length() >= 2) {
        arrayStr = arrayStr.substr(1, arrayStr.length() - 2);
    }
    vector<int> nums;
    if (!arrayStr.empty()) {
        stringstream ss(arrayStr);
        string item;
        while (getline(ss, item, ',')) {
            nums.push_back(stoi(item));
        }
    }
    
    Solution obj;
    vector<int> res = obj.twoSum(nums, target);
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i];
        if (i < res.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}
`,
		},
		// Problem 2: FizzBuzz
		2: {
			"python": `import sys
import json
from typing import *

# --- USER CODE ---
{{USER_CODE}}
# --- END USER CODE ---

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if not input_data: sys.exit(0)
    try:
        n = int(input_data[0])
        res = Solution().fizzBuzz(n)
        print("\n".join(res))
    except Exception as e:
        print(str(e))
`,
			"cpp": `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// --- USER CODE ---
{{USER_CODE}}
// --- END USER CODE ---

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    Solution obj;
    vector<string> res = obj.fizzBuzz(n);
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i];
        if (i < res.size() - 1) cout << "\n";
    }
    return 0;
}
`,
		},
	}
}
