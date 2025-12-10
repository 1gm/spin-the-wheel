import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import './SpinTheWheel.css';

interface SpinTheWheelItem {
    name: string;
    color?: string;
}

interface SpinTheWheelProps {
    items: SpinTheWheelItem[];
    alwaysChooseItemWithName?: string;
}

export default function SpinTheWheel({ items, alwaysChooseItemWithName }: SpinTheWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const hasCelebratedRef = useRef(false);

    const anglePerItem = 360 / items.length;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'];

    const playCelebrationSound = () => {
        const audioContext = new (
            window.AudioContext ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.6);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: number = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    const celebrate = (itemName: string) => {
        if (hasCelebratedRef.current) return;
        hasCelebratedRef.current = true;

        setSelectedItem(itemName);
        triggerConfetti();
        playCelebrationSound();

        setTimeout(() => {
            hasCelebratedRef.current = false;
        }, 3000);
    };

    const spin = () => {
        if (isSpinning || items.length === 0) return;

        setIsSpinning(true);
        setSelectedItem(null);
        hasCelebratedRef.current = false;

        // Calculate target item index
        let targetIndex = 0;
        if (alwaysChooseItemWithName) {
            targetIndex = items.findIndex((item) => item.name === alwaysChooseItemWithName);
            if (targetIndex === -1) {
                targetIndex = 0;
            }
        } else {
            targetIndex = Math.floor(Math.random() * items.length);
        }

        // Calculate the center angle of the target segment in the wheel's coordinate system
        // Segment 0: 0 to anglePerItem, center at anglePerItem/2
        // Segment 1: anglePerItem to 2*anglePerItem, center at anglePerItem + anglePerItem/2
        // etc.
        const targetSegmentCenter = targetIndex * anglePerItem + anglePerItem / 2;

        // The pointer is fixed at 0 degrees (top)
        // When wheel rotates clockwise by R degrees, a point at angle A moves to (A + R) mod 360
        // We want: (targetSegmentCenter + finalRotation) mod 360 = 0
        // So: finalRotation mod 360 = (360 - targetSegmentCenter) mod 360
        const targetFinalRotationMod360 = (360 - targetSegmentCenter) % 360;

        // Get current rotation normalized to 0-360
        const currentRotationMod360 = ((rotation % 360) + 360) % 360;

        // Calculate additional rotation needed from current position
        let additionalRotation = targetFinalRotationMod360 - currentRotationMod360;
        if (additionalRotation <= 0) {
            additionalRotation += 360;
        }

        // Add multiple full rotations for visual effect (5-8 full rotations)
        const fullRotations = 5 + Math.random() * 3;

        // Calculate final absolute rotation
        // Start from current rotation, add full rotations, then add the additional rotation needed
        const finalRotation = rotation + fullRotations * 360 + additionalRotation;

        // Verify: finalRotation mod 360 should equal targetFinalRotationMod360
        const verification = ((finalRotation % 360) + 360) % 360;
        if (Math.abs(verification - targetFinalRotationMod360) > 0.1) {
            console.warn('Rotation calculation mismatch:', {
                verification,
                targetFinalRotationMod360,
                finalRotation,
            });
        }

        setRotation(finalRotation);

        // Match the CSS transition duration (3 seconds)
        const spinDuration = 3000;

        setTimeout(() => {
            setIsSpinning(false);
            celebrate(items[targetIndex].name);
        }, spinDuration);
    };

    // Create conic gradient for wheel background
    const conicGradient = items
        .map((item, index) => {
            const color = item.color || colors[index % colors.length];
            const startAngle = index * anglePerItem;
            const endAngle = (index + 1) * anglePerItem;
            return `${color} ${startAngle}deg ${endAngle}deg`;
        })
        .join(', ');

    return (
        <div className="spin-the-wheel-container">
            <div className="wheel-wrapper">
                <div className="pointer"></div>
                <div
                    ref={wheelRef}
                    className={`wheel ${isSpinning ? 'spinning' : ''}`}
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                        background: `conic-gradient(${conicGradient})`,
                    }}
                >
                    {items.map((item, index) => {
                        const labelAngle = index * anglePerItem + anglePerItem / 2;
                        // Convert angle to radians and adjust for CSS coordinates (0deg = top)
                        const angleRad = ((labelAngle - 90) * Math.PI) / 180;
                        const labelRadius = 35; // Percentage from center
                        const labelX = 50 + labelRadius * Math.cos(angleRad);
                        const labelY = 50 + labelRadius * Math.sin(angleRad);

                        return (
                            <div
                                key={index}
                                className="segment-label"
                                style={{
                                    position: 'absolute',
                                    left: `${labelX}%`,
                                    top: `${labelY}%`,
                                    transform: `translate(-50%, -50%) rotate(${labelAngle}deg)`,
                                    transformOrigin: 'center',
                                }}
                            >
                                {item.name}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="spin-button" onClick={spin} disabled={isSpinning || items.length === 0}>
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            {selectedItem && (
                <div className="celebration-message">
                    <div className="celebration-text">🎉 {selectedItem} 🎉</div>
                </div>
            )}
        </div>
    );
}
