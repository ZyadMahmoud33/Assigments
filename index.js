
// part One

// 1. 
function convertAndAdd() {
  let str = "123";
  let num = Number(str);
  return num + 7;
}
console.log(convertAndAdd()); // 130

// 2. 
function checkFalsy(value) {
  if (!value) {
    return "Invalid";
  }
  return value;
}
console.log(checkFalsy(0)); // "Invalid"

// 3. 
function printOddNumbers() {
  let result = [];
  for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
      continue;
    }
    result.push(i);
  }
  console.log(result.join(", "));
}
printOddNumbers(); // 1, 3, 5, 7, 9

// 4. 
function getEvenNumbers(arr) {
  return arr.filter(num => num % 2 === 0);
}
console.log(getEvenNumbers([1, 2, 3, 4, 5])); // [2, 4]

// 5. 
function mergeArrays(arr1, arr2) {
  return [...arr1, ...arr2];
}
console.log(mergeArrays([1, 2, 3], [4, 5, 6])); // [1, 2, 3, 4, 5, 6]

// 6. 
function getDayOfWeek(num) {
  switch (num) {
    case 1: return "Sunday";
    case 2: return "Monday";
    case 3: return "Tuesday";
    case 4: return "Wednesday";
    case 5: return "Thursday";
    case 6: return "Friday";
    case 7: return "Saturday";
    default: return "Invalid number";
  }
}
console.log(getDayOfWeek(2)); // "Monday"

// 7. 
function getStringLengths(arr) {
  return arr.map(str => str.length);
}
console.log(getStringLengths(["a", "ab", "abc"])); // [1, 2, 3]

// 8. 
function checkDivisible(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "Divisible by both";
  }
  return "Not divisible by both";
}
console.log(checkDivisible(15)); // "Divisible by both"

// 9. 
const square = (num) => num * num;
console.log(square(5)); // 25

// 10. 
function formatPerson(person) {
  const { name, age } = person;
  return `${name} is ${age} years old`;
}
console.log(formatPerson({ name: 'John', age: 25 })); // "John is 25 years old"

// 11. 
function sumAll(...numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// 12. 
function delayedSuccess() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Success");
    }, 3000);
  });
}
delayedSuccess().then(console.log); // "Success" after 3 sec

// 13. 
function findLargest(arr) {
  return Math.max(...arr);
}
console.log(findLargest([1, 3, 7, 2, 4])); // 7

// 14. 
function getObjectKeys(obj) {
  return Object.keys(obj);
}
console.log(getObjectKeys({ name: "John", age: 30 })); // ["name", "age"]

// 15. 
function splitIntoWords(str) {
  return str.split(" ");
}
console.log(splitIntoWords("The quick brown fox")); // ["The", "quick", "brown", "fox"]


// Part Two
// 1.
//forEach: للف الكامل من البداية للنهاية، ملهاش رجعة.
//for...of: ليك الحرية توقف في أي وقت.

// 2. 
//Hoisting: المتغيرات والدوال اللي ب var و function بتترفع فوق السكوب فتقدر تستخدمها قبل تعريفها
//TDZ: الفترة من بداية القوسين {} لحد ما توصل لسطر تعريف ال let أو const لو استخدمت المتغير قبلها يطلع خطأ

// 3. 
// ==: بتقارن القيم بس لو الاتنين مش من نفس النوع بتحولهم لنفس النوع ورا بعض
// ===: بتقارن القيمة والنوع داير تحقق من القيمة والنوع داير تحقق من القيمة والنوع

// 4. 
// try-catch زي شبكة أمان تمسك البرنامج لو وقع خصوصاً في الحاجات اللي بتنزل من النت

// 5. 
// Type Conversion: إنت القائد إنت اللي بتقول للغة تحول
// Type Coercion: اللغة بتقرر بنفسها من وراك وأوقات بتجيب نتيجة غريبة



// part Three

var createCounter = function(init) {
    let current = init;
    
    return {
        increment: () => ++current,
        decrement: () => --current,
        reset: () => {
            current = init;
            return current;
        }
    };
};

const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.reset());     // 5
console.log(counter.decrement()); // 4