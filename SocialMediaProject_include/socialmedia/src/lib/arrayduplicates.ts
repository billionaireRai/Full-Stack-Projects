/**
 * Function to find duplicate elements in an array
**/

export function findDuplicates(arr:Array<string>) {
    if (!Array.isArray(arr)) throw new Error("Input must be an array") ;

    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const item of arr) {
        if (seen.has(item)) {
            duplicates.add(item); // Found a duplicate
        } else {
            seen.add(item);
        }
    }

    return Array.from(duplicates);
}
