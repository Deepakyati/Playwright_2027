import { reversestring } from './StringReverse.spec.ts'; // Import the reversestring function

function isPalindrome(str: string): boolean {
    const normalizedStr = str.toLowerCase().replace(/[^a-z0-9]/g, ''); // Normalize the string
    const reversedtring = reversestring(normalizedStr); // Reverse the normalized string
    return normalizedStr === reversedtring; // Check if the normalized string is equal to its reverse
}

console.log(isPalindrome('A man, a plan, a canal: Panama')); // Output: true
console.log(isPalindrome('race a car')); // Output: false   
