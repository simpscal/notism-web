import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeProvider } from '@/core/contexts';
import { IconProvider } from '@/components/icon/icon-context';

function App() {
  return (
    <ThemeProvider>
      <IconProvider>
        <div className='flex flex-col items-center justify-center min-h-svh'>
          <Button>Click me</Button>
          <Input placeholder='Type something...' className='mt-4' />
        </div>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
