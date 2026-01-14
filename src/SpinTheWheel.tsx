import { useEffect, useRef, useState } from 'react';
import { Wheel } from 'spin-wheel';
import confetti from 'canvas-confetti';

export interface SpinTheWheelItem {
    name: string;
    color: string;
    image?: HTMLImageElement | string;
    isWinningItem: boolean;
}

interface SpinTheWheelProps {
    items: SpinTheWheelItem[];
    duration?: number;
    numberOfRevolutions?: number;
    direction?: 1 | -1;
}

export default function SpinTheWheel({ items, duration = 4000, numberOfRevolutions = 20, direction = 1 }: SpinTheWheelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<Wheel | null>(null);
    const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const [imagesReady, setImagesReady] = useState(false);
    const hasCelebratedRef = useRef(false);
    const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
    const confettiIntervalRef = useRef<number | null>(null);

    // Preload images
    useEffect(() => {
        setImagesReady(false);
        imagesRef.current.clear();

        const imagePromises: Promise<void>[] = [];

        items.forEach((item) => {
            if (item.image && typeof item.image === 'string') {
                const img = new Image();
                const promise = new Promise<void>((resolve) => {
                    img.onload = () => {
                        imagesRef.current.set(item.name, img);
                        resolve();
                    };
                    img.onerror = () => {
                        // Continue even if image fails to load
                        resolve();
                    };
                });
                img.src = item.image;
                imagePromises.push(promise);
            } else if (item.image instanceof HTMLImageElement) {
                imagesRef.current.set(item.name, item.image);
            }
        });

        if (imagePromises.length > 0) {
            Promise.all(imagePromises).then(() => {
                setImagesReady(true);
            });
        } else {
            setImagesReady(true);
        }
    }, [items]);

    // Initialize wheel
    useEffect(() => {
        if (!containerRef.current || !imagesReady) return;

        // Convert items to spin-wheel format
        const wheelItems = items.map((item) => {
            const wheelItem: {
                label: string;
                backgroundColor?: string;
                image?: HTMLImageElement;
            } = {
                label: item.name,
            };

            if (item.color) {
                wheelItem.backgroundColor = item.color;
            }

            if (item.image) {
                if (item.image instanceof HTMLImageElement) {
                    wheelItem.image = item.image;
                } else if (typeof item.image === 'string') {
                    const loadedImage = imagesRef.current.get(item.name);
                    if (loadedImage) {
                        wheelItem.image = loadedImage;
                    }
                }
            }

            return wheelItem;
        });

        // Create wheel instance
        const wheel = new Wheel(containerRef.current, {
            items: wheelItems,
            isInteractive: false, // Disable manual spinning since we control it
            itemLabelColors: ['#fff'],
            onRest: celebrate,
        });

        wheelRef.current = wheel;

        // Cleanup
        return () => {
            if (wheelRef.current) {
                wheelRef.current.remove();
                wheelRef.current = null;
            }
        };
    }, [items, imagesReady]);

    const playCelebrationSound = () => {
        const audioContext = new (window.AudioContext ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitAudioContext)();
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
        const duration = 10000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: number = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                // Stop confetti but don't dismiss modal - user must click to close
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

        confettiIntervalRef.current = interval;
    };

    const celebrate = () => {
        if (hasCelebratedRef.current) return;
        hasCelebratedRef.current = true;

        setIsCelebrating(true);
        triggerConfetti();
        playCelebrationSound();

        // Don't auto-dismiss - user must click to close
    };

    const handleCloseCelebration = () => {
        // Clear confetti interval if it's still running
        if (confettiIntervalRef.current !== null) {
            clearInterval(confettiIntervalRef.current);
            confettiIntervalRef.current = null;
        }
        setIsCelebrating(false);
        hasCelebratedRef.current = false;
    };

    // Function to handle spin button click
    const handleSpin = () => {
        if (!wheelRef.current) return;

        // Find the index of the winning item
        const winningItemIndex = items.findIndex((item) => item.isWinningItem);

        if (winningItemIndex === -1) {
            console.warn('No winning item found in items list.');
            return;
        }

        // Spin to the winning item
        wheelRef.current.spinToItem(
            winningItemIndex,
            duration,
            true, // spinToCenter
            numberOfRevolutions,
            direction,
            (t) => {
                // Ease out circular sourced from https://easings.net/#easeOutCirc
                // Note that more functions are available at https://github.com/AndrewRayCode/easing-utils/blob/master/src/easing.js
                return Math.sqrt(1 - Math.pow(t - 1, 2));
            }
        );
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                    }}
                >
                    <div
                        ref={containerRef}
                        style={{
                            width: 'min(90vh, 90vw)',
                            aspectRatio: '1',
                        }}
                    />
                    <button
                        onClick={handleSpin}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: '#667eea',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#5568d3';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#667eea';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        Spin the Wheel!
                    </button>
                </div>
            </div>
            {isCelebrating && (
                <div
                    onClick={handleCloseCelebration}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        cursor: 'pointer',
                    }}
                >
                    <div
                        style={{
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '1rem',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        🎉 {items.find((item) => item.isWinningItem)?.name || 'Winner!'} 🎉
                    </div>
                </div>
            )}
        </>
    );
}
