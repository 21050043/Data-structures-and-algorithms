export type SortResult = {
    sortedArray: any[];
    timeTaken: number; // ms
};

// Quick Sort
export const quickSort = (array: any[], compareFn: (a: any, b: any) => number): any[] => {
    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const left = array.filter(x => compareFn(x, pivot) < 0);
    const middle = array.filter(x => compareFn(x, pivot) === 0);
    const right = array.filter(x => compareFn(x, pivot) > 0);

    return [...quickSort(left, compareFn), ...middle, ...quickSort(right, compareFn)];
};

// Non-recursive Quick Sort for large arrays (to avoid stack overflow)
export const quickSortIterative = (arr: any[], compareFn: (a: any, b: any) => number): any[] => {
    const stack = [[0, arr.length - 1]];
    const sorted = [...arr];

    while (stack.length > 0) {
        const [low, high] = stack.pop()!;
        if (low < high) {
            const p = partition(sorted, low, high, compareFn);
            stack.push([low, p]);
            stack.push([p + 1, high]);
        }
    }
    return sorted;
};

const partition = (arr: any[], low: number, high: number, compareFn: (a: any, b: any) => number): number => {
    const pivot = arr[Math.floor((low + high) / 2)];
    let i = low - 1;
    let j = high + 1;
    while (true) {
        do { i++; } while (compareFn(arr[i], pivot) < 0);
        do { j--; } while (compareFn(arr[j], pivot) > 0);
        if (i >= j) return j;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};

// Merge Sort
export const mergeSort = (array: any[], compareFn: (a: any, b: any) => number): any[] => {
    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid), compareFn);
    const right = mergeSort(array.slice(mid), compareFn);

    return merge(left, right, compareFn);
};

const merge = (left: any[], right: any[], compareFn: (a: any, b: any) => number): any[] => {
    let result: any[] = [];
    let l = 0, r = 0;

    while (l < left.length && r < right.length) {
        if (compareFn(left[l], right[r]) <= 0) {
            result.push(left[l]);
            l++;
        } else {
            result.push(right[r]);
            r++;
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
};

// Heap Sort
export const heapSort = (array: any[], compareFn: (a: any, b: any) => number): any[] => {
    const arr = [...array];
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, compareFn);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0, compareFn);
    }
    return arr;
};

const heapify = (arr: any[], n: number, i: number, compareFn: (a: any, b: any) => number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && compareFn(arr[left], arr[largest]) > 0) largest = left;
    if (right < n && compareFn(arr[right], arr[largest]) > 0) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest, compareFn);
    }
};
