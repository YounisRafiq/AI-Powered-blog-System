import { useState , useEffect } from "react";
import { ThemeContext } from "./Context";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        document.body.className = theme;
    } , [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};