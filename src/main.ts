import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/400-italic.css';
import './ui/theme.css';
import { mount } from 'svelte';
import App from './ui/App.svelte';

mount(App, { target: document.getElementById('app')! });
