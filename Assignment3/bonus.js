/**
 * LeetCode 169. Majority Element
 * https://leetcode.com/problems/majority-element/
 *
 * Boyer-Moore Voting Algorithm - O(n) time, O(1) space
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let count = 0;
  let candidate = null;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += num === candidate ? 1 : -1;
  }

  return candidate;
};

// quick manual tests
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
