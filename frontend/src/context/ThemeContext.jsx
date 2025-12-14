import { createContext, useState, useMemo, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#2563eb",
                  light: "#3b82f6",
                  dark: "#1d4ed8",
                },
                secondary: {
                  main: "#7c3aed",
                  light: "#8b5cf6",
                  dark: "#6d28d9",
                },
                background: {
                  default: "#f8fafc",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#0f172a",
                  secondary: "#475569",
                },
              }
            : {
                primary: {
                  main: "#3b82f6",
                  light: "#60a5fa",
                  dark: "#2563eb",
                },
                secondary: {
                  main: "#8b5cf6",
                  light: "#a78bfa",
                  dark: "#7c3aed",
                },
                background: {
                  default: "#0f172a",
                  paper: "#1e293b",
                },
                text: {
                  primary: "#f1f5f9",
                  secondary: "#cbd5e1",
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: {
            fontWeight: 600,
            textTransform: "none",
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: "10px 24px",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
