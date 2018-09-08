import { BasicConfiguration } from '@aurelia/jit';
import { Aurelia } from '@aurelia/runtime';
import { App } from './app';
import { DebugConfiguration } from '@aurelia/debug';
import { register } from '@aurelia/plugin-svg';
import { Pythagoras } from './pythagoras';

console.log({ Pythagoras, App });

window['au'] = new Aurelia()
  .register(
    BasicConfiguration,
    DebugConfiguration,
    {
      register(container: any) {
        register(container);
        // (Pythagoras as any).regiser(container);
        // container.register(Pythagoras);
      }
    }
  )
  .app({ host: document.querySelector('app'), component: new App() })
  .start();

