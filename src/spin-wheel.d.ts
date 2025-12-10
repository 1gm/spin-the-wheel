declare module 'spin-wheel' {
    export interface WheelItem {
        label: string;
        backgroundColor?: string;
        image?: HTMLImageElement;
        weight?: number;
        value?: unknown;
        labelColor?: string;
        imageOpacity?: number;
        imageRadius?: number;
        imageRotation?: number;
        imageScale?: number;
    }

    export interface WheelProps {
        items?: WheelItem[];
        borderColor?: string;
        borderWidth?: number;
        debug?: boolean;
        image?: HTMLImageElement | null;
        isInteractive?: boolean;
        itemBackgroundColors?: string[];
        itemLabelAlign?: 'left' | 'center' | 'right';
        itemLabelBaselineOffset?: number;
        itemLabelColors?: string[];
        itemLabelFont?: string;
        itemLabelFontSizeMax?: number;
        itemLabelRadius?: number;
        itemLabelRadiusMax?: number;
        itemLabelRotation?: number;
        itemLabelStrokeColor?: string;
        itemLabelStrokeWidth?: number;
        lineColor?: string;
        lineWidth?: number;
        offset?: { x: number; y: number };
        onCurrentIndexChange?: (event: {
            type: 'currentIndexChange';
            currentIndex: number;
        }) => void;
        onRest?: (event: {
            type: 'rest';
            currentIndex: number;
            rotation: number;
        }) => void;
        onSpin?: (event: {
            type: 'spin';
            duration?: number;
            method: 'interact' | 'spin' | 'spinto' | 'spintoitem';
            rotationResistance?: number;
            rotationSpeed?: number;
            targetItemIndex?: number;
            targetRotation?: number;
        }) => void;
        overlayImage?: HTMLImageElement | null;
        pixelRatio?: number;
        pointerAngle?: number;
        radius?: number;
        rotation?: number;
        rotationResistance?: number;
        rotationSpeedMax?: number;
    }

    export class Wheel {
        constructor(container: Element, props?: WheelProps);
        init(props?: WheelProps): void;
        resize(): void;
        remove(): void;
        spin(rotationSpeed?: number): void;
        spinTo(
            rotation?: number,
            duration?: number,
            easingFunction?: ((n: number) => number) | null,
        ): void;
        spinToItem(
            itemIndex?: number,
            duration?: number,
            spinToCenter?: boolean,
            numberOfRevolutions?: number,
            direction?: 1 | -1,
            easingFunction?: ((n: number) => number) | null,
        ): void;
        stop(): void;
        getCurrentIndex(): number;
        items: WheelItem[];
        rotationSpeed: number;
        [key: string]: unknown;
    }
}

