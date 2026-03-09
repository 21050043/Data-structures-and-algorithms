export interface EProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    rating: number;
}

const CATEGORIES = ["Smartphones", "Laptops", "Accessories", "Tablets", "Audio"];
const NAMES = ["iPhone 15", "Galaxy S23", "MacBook Air", "iPad Pro", "Sony WH-1000XM5", "Logitech Mouse", "Dell XPS", "Asus ROG"];

export const generateData = (size: number, type: 'random' | 'sorted' | 'reverse'): EProduct[] => {
    const data: EProduct[] = [];
    for (let i = 0; i < size; i++) {
        data.push({
            id: i + 1,
            name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} Gen ${i}`,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            price: parseFloat((Math.random() * 2000 + 10).toFixed(2)),
            stock: Math.floor(Math.random() * 500),
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        });
    }

    if (type === 'sorted') {
        return data.sort((a, b) => a.id - b.id);
    } else if (type === 'reverse') {
        return data.sort((a, b) => b.id - a.id);
    } else {
        // Shuffle for random
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }
    }
    return data;
};
