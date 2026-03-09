import React, { useState, useEffect, useRef } from 'react';

interface SortingVisualizerProps {
    algorithm: 'quick' | 'merge' | 'heap';
    dataSize: number;
    onComplete?: () => void;
    onReset?: () => void;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm, dataSize, onComplete, onReset }) => {
    const [array, setArray] = useState<number[]>([]);
    const [sorting, setSorting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [completedIndices, setCompletedIndices] = useState<number[]>([]);

    const arrayRef = useRef<number[]>([]);

    useEffect(() => {
        resetArray();
    }, [dataSize]);

    const resetArray = () => {
        const newArray = [];
        for (let i = 0; i < dataSize; i++) {
            newArray.push(Math.floor(Math.random() * 250) + 20);
        }
        setArray(newArray);
        arrayRef.current = [...newArray];
        setCompletedIndices([]);
        setActiveIndices([]);
        setIsCompleted(false);
        if (onReset) onReset();
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const updateVisual = async (indices: number[] = []) => {
        setArray([...arrayRef.current]);
        setActiveIndices(indices);
        await sleep(Math.max(5, 40 - Math.floor(dataSize / 5)));
    };

    const completionSweep = async () => {
        const sweepArr: number[] = [];
        for (let i = 0; i < arrayRef.current.length; i++) {
            sweepArr.push(i);
            setCompletedIndices([...sweepArr]);
            await sleep(10);
        }
        setActiveIndices([]);
    };

    const visualQuickSort = async (low: number, high: number) => {
        if (low < high) {
            let p = await visualPartition(low, high);
            await visualQuickSort(low, p);
            await visualQuickSort(p + 1, high);
        }
    };

    const visualPartition = async (low: number, high: number): Promise<number> => {
        const arr = arrayRef.current;
        const pivot = arr[Math.floor((low + high) / 2)];
        let i = low - 1;
        let j = high + 1;
        while (true) {
            do { i++; } while (arr[i] < pivot);
            do { j--; } while (arr[j] > pivot);
            if (i >= j) return j;

            [arr[i], arr[j]] = [arr[j], arr[i]];
            await updateVisual([i, j]);
        }
    };

    const visualMergeSort = async (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await visualMergeSort(start, mid);
        await visualMergeSort(mid + 1, end);
        await visualMerge(start, mid, end);
    };

    const visualMerge = async (start: number, mid: number, end: number) => {
        const arr = arrayRef.current;
        let left = start;
        let right = mid + 1;

        while (left <= mid && right <= end) {
            if (arr[left] <= arr[right]) {
                left++;
            } else {
                const value = arr[right];
                let index = right;
                while (index !== left) {
                    arr[index] = arr[index - 1];
                    index--;
                }
                arr[left] = value;
                await updateVisual([left, right]);
                left++;
                mid++;
                right++;
            }
        }
    };

    const visualHeapSort = async () => {
        const arr = arrayRef.current;
        const n = arr.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await visualHeapify(n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            await updateVisual([0, i]);
            await visualHeapify(i, 0);
        }
    };

    const visualHeapify = async (n: number, i: number) => {
        const arr = arrayRef.current;
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await updateVisual([i, largest]);
            await visualHeapify(n, largest);
        }
    };

    const runSort = async () => {
        if (sorting) return;
        setSorting(true);
        setCompletedIndices([]);

        if (algorithm === 'quick') await visualQuickSort(0, arrayRef.current.length - 1);
        else if (algorithm === 'merge') await visualMergeSort(0, arrayRef.current.length - 1);
        else if (algorithm === 'heap') await visualHeapSort();

        await completionSweep();
        setIsCompleted(true);
        if (onComplete) onComplete();
        setSorting(false);
    };

    return (
        <div className="sorting-visualizer glass-card" style={{ marginTop: '2.5rem', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h3 style={{ marginBottom: '0.2rem' }}>Trực quan hóa thuật toán: {algorithm.toUpperCase()}</h3>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Visualizing {dataSize} elements in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="primary" onClick={resetArray} disabled={sorting} style={{ background: 'var(--surface-accent)', color: 'white' }}>Reset</button>
             <button className="primary" onClick={runSort} disabled={sorting || isCompleted}>
              {sorting ? 'Đang chạy...' : isCompleted ? 'Đã hoàn tất' : 'Bắt đầu chạy'}
            </button>
        </div>
      </div>
      
      <div 
        style={{ 
          height: '450px', 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '2px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          padding: '20px 20px 10px 20px',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
            
                {array.map((val, idx) => {
                    let color = 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))';
                    if (activeIndices.includes(idx)) color = '#ff4b2b';
                    if (completedIndices.includes(idx)) color = '#10b981';

                    return (
                        <div
                            key={idx}
                            style={{
                                height: `${(val / 300) * 100}%`,
                                flex: 1,
                                background: color,
                                borderRadius: '4px 4px 1px 1px',
                                transition: sorting ? 'height 0.1s ease, background 0.2s ease' : 'height 0.4s cubic-bezier(0.23, 1, 0.32, 1), background 0.4s ease',
                                boxShadow: activeIndices.includes(idx) ? '0 0 15px #ff4b2b' : 'none'
                            }}
                        ></div>
                    );
                })}

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                    pointerEvents: 'none'
                }}></div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))' }}></div>
                    <span>Dữ liệu</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ff4b2b' }}></div>
                    <span>Đang so sánh/hoán đổi</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div>
                    <span>Hoàn tất</span>
                </div>
            </div>
        </div>
    );
};

export default SortingVisualizer;
