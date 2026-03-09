import React, { useState } from 'react';
import { generateData, EProduct } from '../utils/dataGenerator';
import { quickSortIterative, mergeSort, heapSort } from '../utils/sorting';
import SortingVisualizer from './SortingVisualizer';

const Dashboard: React.FC = () => {
    const [size, setSize] = useState<number>(5000);
    const [scenario, setScenario] = useState<'random' | 'sorted' | 'reverse'>('random');
    const [results, setResults] = useState<any[]>([]);
    const [isSorting, setIsSorting] = useState(false);
    const [benchmarkStatus, setBenchmarkStatus] = useState<string>('');
    const [visualAlgo, setVisualAlgo] = useState<'quick' | 'merge' | 'heap'>('quick');
    const [previewData, setPreviewData] = useState<EProduct[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    const addLog = (action: string, params: string, result: string) => {
        const newLog = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            action,
            params,
            result
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const initializeData = () => {
        const data = generateData(size, scenario);
        setPreviewData(data.slice(0, 6));
        setResults([]); 
        setIsInitialized(true);
        addLog('Khởi tạo dữ liệu', `Size: ${size}, Scenario: ${scenario}`, 'Thành công (Preview 6 dòng)');
    };

    // Reset when parameters change
    const onParamChange = (newSize?: number, newScenario?: 'random' | 'sorted' | 'reverse') => {
        if (newSize) setSize(newSize);
        if (newScenario) setScenario(newScenario);
        setIsInitialized(false);
        setPreviewData([]);
        setResults([]);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runBenchmark = async () => {
        setIsSorting(true);
        const data = generateData(size, scenario);
        const trials = size === 5000 ? 50 : 5; // Run more trials for smaller data
        const benchmarks = [];

        const algorithms = [
            { name: 'Quick Sort', fn: quickSortIterative, color: 'var(--accent-primary)' },
            { name: 'Merge Sort', fn: mergeSort, color: 'var(--accent-secondary)' },
            { name: 'Heap Sort', fn: heapSort, color: 'var(--accent-tertiary)' }
        ];

        for (const algo of algorithms) {
            setBenchmarkStatus(`Đang đo ${algo.name} (${trials} vòng lặp)...`);
            let totalTime = 0;

            for (let i = 0; i < trials; i++) {
                const dataCopy = [...data];
                const t0 = performance.now();
                algo.fn(dataCopy, (a, b) => a.id - b.id);
                const t1 = performance.now();
                totalTime += (t1 - t0);
                // Tiny break every 5 trials to keep UI responsive
                if (i % 5 === 0) await sleep(1);
            }

            const avgTime = totalTime / trials;
            benchmarks.push({ 
                name: algo.name, 
                time: avgTime.toFixed(4), 
                actualSec: (avgTime / 1000).toFixed(6),
                color: algo.color 
            });

            setBenchmarkStatus(`Đang nghỉ để ổn định CPU...`);
            await sleep(300); // Rest before next algorithm
        }

        setResults(benchmarks);
        setBenchmarkStatus('');
        setIsSorting(false);

        const winner = benchmarks.reduce((prev, curr) => Number(prev.time) < Number(curr.time) ? prev : curr);
        addLog('Chạy Benchmark', `Size: ${size}, Scenario: ${scenario}`, `Hoàn tất (Nhanh nhất: ${winner.name})`);
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard Phân Tích</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>So sánh hiệu năng thuật toán trên đa kịch bản dữ liệu.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={size}
                        onChange={(e) => onParamChange(Number(e.target.value))}
                        style={{ padding: '10px', borderRadius: '8px', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)' }}
                    >
                        <option value={5000}>5,000 dòng</option>
                        <option value={100000}>100,000 dòng</option>
                    </select>
                    <select
                        value={scenario}
                        onChange={(e) => onParamChange(undefined, e.target.value as any)}
                        style={{ padding: '10px', borderRadius: '8px', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)' }}
                    >
                        <option value="random">Ngẫu nhiên</option>
                        <option value="sorted">Đã sắp xếp</option>
                        <option value="reverse">Ngược</option>
                    </select>
                    <button className="primary" onClick={initializeData}>
                        Khởi tạo dữ liệu
                    </button>
                </div>
            </header>

            {!isInitialized ? (
                <div className="glass-card animate-fade-in" style={{ padding: '60px', textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
                    <h3>Sẵn sàng phân tích</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Vui lòng chọn thông số và nhấn "Khởi tạo dữ liệu" để bắt đầu.</p>
                </div>
            ) : (
                <>
                    <div className="glass-card animate-fade-in" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Dữ liệu mẫu (6 dòng đầu tiên)</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '12px' }}>ID</th>
                                        <th style={{ padding: '12px' }}>Tên sản phẩm</th>
                                        <th style={{ padding: '12px' }}>Danh mục</th>
                                        <th style={{ padding: '12px' }}>Giá</th>
                                        <th style={{ padding: '12px' }}>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '12px' }}>{item.id}</td>
                                            <td style={{ padding: '12px' }}>{item.name}</td>
                                            <td style={{ padding: '12px' }}>{item.category}</td>
                                            <td style={{ padding: '12px' }}>${item.price}</td>
                                            <td style={{ padding: '12px' }}>{item.rating} ★</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                         <h3 style={{ margin: 0 }}>Chọn thuật toán Visual:</h3>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['quick', 'merge', 'heap'].map(algo => (
                                <button 
                                    key={algo}
                                    style={{ 
                                        padding: '6px 16px', 
                                        borderRadius: '8px', 
                                        background: visualAlgo === algo ? 'var(--accent-primary)' : 'var(--surface-accent)',
                                        color: 'white',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => setVisualAlgo(algo as any)}
                                >
                                    {algo.toUpperCase()}
                                </button>
                            ))}
                         </div>
                    </div>
                    
                    <SortingVisualizer 
                        algorithm={visualAlgo} 
                        dataSize={100} 
                        onComplete={runBenchmark} 
                        onReset={() => setResults([])}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
                        {results.map((res, i) => {
                            const times = results.map(r => Number(r.time)).sort((a, b) => a - b);
                            const isWinner = times[0] === Number(res.time);
                            const isSecond = times[1] === Number(res.time);
                            
                            return (
                                <div key={i} className={`glass-card animate-fade-in ${isWinner ? 'winner-card' : isSecond ? 'silver-card' : ''}`} style={{ animationDelay: `${i * 0.1}s`, textAlign: 'center' }}>
                                    {isWinner && <div className="crown-icon">👑</div>}
                                    {isSecond && <div className="medal-badge">2nd Place</div>}
                                    <h3 style={{ color: res.color, marginBottom: '1rem' }}>{res.name}</h3>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{res.time} <span style={{ fontSize: '1rem', fontWeight: '400' }}>ms</span></div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Thời gian thực thi trung bình</p>
                                    <div style={{ padding: '10px 0', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem', color: 'var(--accent-tertiary)' }}>
                                        Thuật toán {res.name} đã thực hiện xong trong khoảng {res.actualSec} giây thực tế.
                                    </div>
                                </div>
                            );
                        })}
                        {results.length === 0 && (
                            <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                                {isSorting ? (
                                    <div className="animate-pulse">
                                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                                        <h3 className="gradient-text">{benchmarkStatus}</h3>
                                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Đang phân tích sâu để đảm bảo kết quả chính xác nhất.</p>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>Nhấn "Bắt đầu chạy" ở phần Visualizer phía trên để xem quá trình và nhận kết quả phân tích.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {results.length > 0 && (
                        <div className="glass-card animate-fade-in" style={{ marginTop: '2.5rem', animationDelay: '0.4s' }}>
                            <h3>Phân tích đánh giá hiệu năng</h3>
                            <div style={{ marginTop: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                                <p>• <strong>Quick Sort:</strong> {Number(results[0].time) < Number(results[1].time) ? "Tốc độ vượt trội nhờ tối ưu hóa bộ nhớ đệm (Cache Locality)." : "Có thể chậm hơn nếu chọn phần tử chốt (pivot) không tốt."}</p>
                                <p>• <strong>Merge Sort:</strong> Đảm bảo độ phức tạp O(n log n) trong mọi trường hợp, cực kỳ ổn định cho Thương mại điện tử.</p>
                                <p>• <strong>Heap Sort:</strong> Không tốn thêm bộ nhớ phụ, phù hợp cho các hệ thống nhúng hoặc tài nguyên hạn chế.</p>
                            </div>
                        </div>
                    )}

                    <div className="glass-card animate-fade-in" style={{ marginTop: '3rem', animationDelay: '0.6s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Lịch sử hoạt động (Audit Log)</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '10px' }}>
                                Tự động xóa khi tải lại trang
                            </span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="log-table">
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Hoạt động</th>
                                        <th>Cấu hình</th>
                                        <th>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>Chưa có hoạt động nào được ghi lại.</td>
                                        </tr>
                                    ) : (
                                        logs.map(log => (
                                            <tr key={log.id}>
                                                <td style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{log.time}</td>
                                                <td style={{ fontWeight: '500' }}>{log.action}</td>
                                                <td style={{ fontSize: '0.8rem' }}>{log.params}</td>
                                                <td style={{ color: 'var(--accent-tertiary)' }}>{log.result}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
