// ReviewCard.stories.jsx
import Header from '../components/Common/Header';
export default {
    title: 'Components/Header',
    component: Header,
    tags: ['autodocs'],
    argTypes: {
        
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const Primary = {
    args: {
        showSearchBar: true
    },
};

export const Secondary = {
    args: {
        showSearchBar: false
    },
};
