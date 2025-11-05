import { rgbToHex } from "@/helpers/color";

export const fontSize = {
    xs: 12,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 30,
};

export const iconSize = {
    xs: 20,
    sm: 24,
    base: 28,
    lg: 32,
    xl: 36,
};

export const textColor = {
    light: "#f0f0f0",
    dark: "#181818",
    activeLight: "#fafafa",
    activeDark: "#272625",
};

export const iconColor = {
    light: "#f0f0f0",   // text-primary-500
    dark: "#181818",    // text-primary-500
    activeLight: "#4F46E5", // indigo-600
    activeDark: "#818CF8", // indigo-400
};

export const backgroundColor = {
    light: rgbToHex(255, 255, 255),
    dark: rgbToHex(18, 18, 18),
    minDark: rgbToHex(39, 38, 37),
    minLight: rgbToHex(255, 255, 255),
    white: "#ffffff",
    black: "#000000",
};

export const screenPadding = {
    horizontal: 16,
    vertical: 16,
};
export const colors = {
    blue:"#000fff",
	primary: '#fc3c44',
	background: '#000',
	text: '#fff',
	textMuted: '#9ca3af',
	icon: '#fff',
	maximumTrackTintColor: 'rgba(255,255,255,0.4)',
	minimumTrackTintColor: 'rgba(255,255,255,1)',
}