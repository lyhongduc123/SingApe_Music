import { useColorScheme } from "nativewind";
import ImageColors from "react-native-image-colors";
import colors from "tailwindcss/colors";
import Color from "color";

export const getGradient = (id: string) => {
  const {colorScheme} = useColorScheme();
  

  const gradients: [string, string, ...string[]][] = [
    // Warm amber
    [colors.amber[700], colors.amber[800], colors.amber[900], colors.amber[950], rgbToHex(18, 18, 18)],
    // Deep blue
    [colors.blue[700], colors.blue[800], colors.blue[900], colors.blue[950], rgbToHex(18, 18, 18)],
    // Cool gray
    [colors.gray[600], colors.gray[700], colors.gray[800], colors.gray[900], rgbToHex(18, 18, 18)],
    // Gold yellow
    [colors.yellow[700], colors.yellow[800], colors.yellow[900], colors.yellow[950], rgbToHex(18, 18, 18)],
    // New: vibrant violet
    [colors.violet[700], colors.violet[800], colors.violet[900], colors.violet[950], rgbToHex(18, 18, 18)],
    // New: teal/mint
    [colors.teal[700], colors.teal[800], colors.teal[900], colors.teal[950], rgbToHex(18, 18, 18)],

    [colors.zinc[700], colors.zinc[800], colors.zinc[900], colors.zinc[950], rgbToHex(18, 18, 18)],      // Smooth gray
    [colors.indigo[600], colors.indigo[700], colors.indigo[800], colors.indigo[950], rgbToHex(18, 18, 18)], // Deep indigo
    [colors.rose[600], colors.rose[700], colors.rose[800], colors.rose[950], rgbToHex(18, 18, 18)],       // Warm rose
    [colors.sky[600], colors.sky[700], colors.sky[800], colors.sky[950], rgbToHex(18, 18, 18)],          // Calm blue
    [colors.emerald[600], colors.emerald[700], colors.emerald[800], colors.emerald[950], rgbToHex(18, 18, 18)], // Soothing green
    [colors.fuchsia[600], colors.fuchsia[700], colors.fuchsia[800], colors.fuchsia[950], rgbToHex(18, 18, 18)], // Subtle purple-pink
  ];
  
  const gradientsWhite: [string, string, string, string, string][] = [
    [colors.amber[300], colors.amber[200], colors.amber[100], colors.amber[50], colors.white],
    [colors.blue[300], colors.blue[200], colors.blue[100], colors.blue[50], colors.white],
    [colors.gray[300], colors.gray[200], colors.gray[100], colors.gray[50], colors.white],
    [colors.yellow[300], colors.yellow[200], colors.yellow[100], colors.yellow[50], colors.white],
    [colors.violet[300], colors.violet[200], colors.violet[100], colors.violet[50], colors.white],
    [colors.teal[300], colors.teal[200], colors.teal[100], colors.teal[50], colors.white],

    [colors.zinc[200], colors.zinc[100], colors.zinc[50], "#fafafa", colors.white],              // Gentle gray
    [colors.indigo[300], colors.indigo[200], colors.indigo[100], "#f0f0ff", colors.white],       // Light indigo
    [colors.rose[300], colors.rose[200], colors.rose[100], "#fff5f5", colors.white],             // Warm rose
    [colors.sky[300], colors.sky[200], colors.sky[100], "#f0fbff", colors.white],                // Airy blue
    [colors.emerald[300], colors.emerald[200], colors.emerald[100], "#f1fff7", colors.white],    // Fresh green
    [colors.fuchsia[300], colors.fuchsia[200], colors.fuchsia[100], "#fdf5ff", colors.white],
  ];

  
  const index = hashStringToIndex(id, gradients.length);
  return colorScheme === "dark" ? gradients[index] : gradientsWhite[index];
}

export const getGradientColor = (color: "gray" | "blue" | "amber" | "yellow") => {
  const {colorScheme} = useColorScheme();
  const gradients: [string, string, ...string[]][] = [
    [colors.amber[700], colors.amber[800], colors.amber[800], rgbToHex(18, 18, 18)],
    [colors.blue[700], colors.blue[800], colors.blue[800], rgbToHex(18, 18, 18)],
    [colors.gray[700], colors.gray[800], colors.gray[800], rgbToHex(18, 18, 18)],
    [colors.yellow[700], colors.yellow[800], colors.yellow[800], rgbToHex(18, 18, 18)],
  ];
  const gradientsWhite: [string, string, ...string[]][] = [
    [colors.amber[500], colors.amber[400], colors.amber[200], colors.white],
    [colors.blue[500], colors.blue[400], colors.blue[200], colors.white],
    [colors.gray[500], colors.gray[400], colors.gray[300], colors.white],
    [colors.yellow[500], colors.yellow[400], colors.yellow[200], colors.white],
  ];

  const index = color === "gray" ? 2 : color === "blue" ? 1 : color === "amber" ? 0 : 3;
  return colorScheme === "dark" ? gradients[index] : gradientsWhite[index];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function hashStringToIndex(str: string, prefixArrayLength: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // unsigned right shift to keep it positive
  }
  return hash % prefixArrayLength;
}

export async function getImageColor(imageUri: string) {
  const result = await ImageColors.getColors(imageUri, {
    fallback: '#000000',
    cache: true,
    key: imageUri,
  });

  if (result.platform === 'android') {
    return [result.dominant, result.average, result.darkVibrant, result.lightVibrant]; // Or use vibrant, darkVibrant, etc.
  } 
  return ["#000", "#111"];
}

/**
 * Auto-fixes background color by lightening if too dark for light mode
 * @param color Input color from image
 * @param lightMode Whether your app is in light mode
 */
export function getSafeBackgroundColor(color: string, lightMode = true): string {
  const c = Color(color);
  const brightness = c.luminosity(); // 0 = dark, 1 = bright

  // If in light mode and too dark, lighten it
  if (lightMode && brightness < 0.4) {
    return c.mix(Color("white"), 0.6).hex(); // adjust amount to your taste
  }
  
  return color;
}