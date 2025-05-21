/** @type { import('@storybook/react').Preview } */
import '../src/index.css';
import '../src/App.css';
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;