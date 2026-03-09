import React from 'react';

interface HeroProps {
    onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
    return (
        <div className="hero-section" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 className="gradient-text animate-fade-in" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                Algorithm Performance
            </h1>
            <p className="animate-fade-in" style={{
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                maxWidth: '600px',
                marginBottom: '2.5rem',
                animationDelay: '0.2s'
            }}>
                Hệ thống đánh giá và phân tích hiệu năng các thuật toán sắp xếp kinh điển (Quick, Merge, Heap Sort) trên dữ liệu E-commerce quy mô lớn.
            </p>
            <button
                className="primary animate-fade-in"
                style={{ fontSize: '1.1rem', padding: '16px 40px', animationDelay: '0.4s' }}
                onClick={onStart}
            >
                Bắt đầu phân tích
            </button>

            {/* Background Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1
            }}></div>
        </div>
    );
};

export default Hero;
