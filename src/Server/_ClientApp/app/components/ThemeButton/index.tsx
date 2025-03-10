export const ThemeButton = () => {
  return (
    <button
      onClick={() => (window as any).toggleTheme()}
      className="dark:i-carbon-sun light:i-carbon-moon"
    />
  );
};
