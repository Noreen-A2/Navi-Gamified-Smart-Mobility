export const colors = {
    surface: "#f8f9fa",
    surfaceDim: "#d9dadb",
    surfaceBright: "#f8f9fa",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f3f4f5",
    surfaceContainer: "#edeeef",
    surfaceContainerHigh: "#e7e8e9",
    surfaceContainerHighest: "#e1e3e4",
    onSurface: "#191c1d",
    onSurfaceVariant: "#3a494b",
    inverseSurface: "#2e3132",
    inverseOnSurface: "#f0f1f2",
    outline: "#6a7a7b",
    outlineVariant: "#b9cacb",
    surfaceTint: "#00696f",
    primary: "#00696f",
    onPrimary: "#ffffff",
    primaryContainer: "#00f2ff",
    onPrimaryContainer: "#006a71",
    inversePrimary: "#00dbe7",
    secondary: "#705d00",
    onSecondary: "#ffffff",
    secondaryContainer: "#fcd400",
    onSecondaryContainer: "#6e5c00",
    tertiary: "#51606c",
    onTertiary: "#ffffff",
    tertiaryContainer: "#cdddeb",
    onTertiaryContainer: "#52626d",
    error: "#ba1a1a",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#93000a"
};

export const spacing = {
    unit: 8,
    gutter: 16,
    marginMobile: 20,
    marginDesktop: 40,
    containerPadding: 24,
    stackSm: 8,
    stackMd: 16,
    stackLg: 32
};

export const radii = {
    sm: 4,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999
};

export const typography = {
    displayXL: {
        fontFamily: "SpaceGrotesk_700Bold",
        fontSize: 48,
        lineHeight: 56,
        letterSpacing: -0.6
    },
    headlineLg: {
        fontFamily: "SpaceGrotesk_600SemiBold",
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.3
    },
    headlineMd: {
        fontFamily: "SpaceGrotesk_600SemiBold",
        fontSize: 24,
        lineHeight: 32
    },
    bodyLg: {
        fontFamily: "Manrope_400Regular",
        fontSize: 18,
        lineHeight: 28
    },
    bodyMd: {
        fontFamily: "Manrope_400Regular",
        fontSize: 16,
        lineHeight: 24
    },
    bodySm: {
        fontFamily: "Manrope_400Regular",
        fontSize: 14,
        lineHeight: 20
    },
    labelCaps: {
        fontFamily: "SpaceGrotesk_700Bold",
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 1.6
    },
    dataPoint: {
        fontFamily: "SpaceGrotesk_500Medium",
        fontSize: 14,
        lineHeight: 18
    }
};

export const gradients = {
    holo: ["#00f2ff", "#00696f"],
    xp: ["#fcd400", "#e9c400"],
    pearl: ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
};

export const shadows = {
    // Native shadow props (iOS + Android)
    glow: {
        shadowColor: "#00f2ff",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 16,
        elevation: 8
    },
    // Web-safe CSS shadow — spread this on web only
    glowWeb: {
        boxShadow: "0px 8px 16px rgba(0, 242, 255, 0.24)"
    }
};
