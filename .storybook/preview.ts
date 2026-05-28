import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/app/assets/styles/index.css';

const style = document.createElement('style');
style.textContent = 'html, body { overflow: auto !important; height: auto !important; }';
document.head.appendChild(style);

const preview: Preview = {
    decorators: [
        withThemeByClassName({
            themes: { light: '', dark: 'dark' },
            defaultTheme: 'light',
        }),
    ],
};

export default preview;
