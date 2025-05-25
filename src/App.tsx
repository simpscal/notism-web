import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <div className='flex flex-col items-center justify-center min-h-svh'>
        <Button>Click me</Button>
        <Input placeholder='Type something...' className='mt-4' />
      </div>
    </ThemeProvider>
  );
}

export default App;
