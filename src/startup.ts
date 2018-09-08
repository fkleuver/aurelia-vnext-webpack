import { BasicConfiguration, bindingCommand, IBindingCommand, CallBindingInstruction, RefBindingInstruction } from '@aurelia/jit';
import { Aurelia, IExpressionParser, INode, AttributeDefinition, ElementDefinition, TargetedInstruction, BindingType, renderStrategy, IRenderStrategy, ICustomAttributeSource, IRenderable, TargetedInstructionType, IRenderStrategyInstruction, IExpression, Ref, customAttribute, ICustomAttribute, IScope, BindingFlags, IRenderingEngine, AttachLifecycle, DetachLifecycle, IBinding, IRenderContext } from '@aurelia/runtime';
import { App } from './app';
import { DebugConfiguration } from '@aurelia/debug';
import { register as registerPluginSrv } from '@aurelia/plugin-svg';
import { register as registerParser } from '@aurelia/jit';
import { Pythagoras } from './pythagoras';
import { Immutable, IIndexable, IContainer, Registration } from '@aurelia/kernel';

console.log({ Pythagoras, App });

export class ViewModelRefBindingInstruction implements IRenderStrategyInstruction {
  public type: TargetedInstructionType.renderStrategy = TargetedInstructionType.renderStrategy;
  public name: 'ref' = 'ref';
  public target: 'view-model' = 'view-model';
  constructor(
    public srcOrExpr: string,
    public attribute: AttributeDefinition,
    public element: ElementDefinition,
    public node: INode
  ) {}
}

@bindingCommand('ref')
export class ViewModelRefBindingCommand implements IBindingCommand {
  constructor(private parser: IExpressionParser) {}
  public compile(target: string, value: string, node: INode, attribute: AttributeDefinition, element: ElementDefinition): IRenderStrategyInstruction & IIndexable {
    return new ViewModelRefBindingInstruction(value, attribute, element, node);
  }
  public handles(attribute: AttributeDefinition): boolean {
    return !!attribute && attribute.name === 'view-model';
  }
}

export class ViewModelRef implements Partial<IBinding> {
  constructor(public sourceExpr: IExpression) {}

  public $scope: IScope;
  public $bind(flags: BindingFlags, scope: IScope): void {
    this.sourceExpr.assign(flags, scope, null, scope.bindingContext);
  }
  public $unbind(flags: BindingFlags): void {}
}

@renderStrategy('ref')
export class ViewModelRefRenderStrategy implements IRenderStrategy {
  constructor(private parser: IExpressionParser, private c: IContainer) {}
  public render(renderable: IRenderable, target: any, instruction: ViewModelRefBindingInstruction): void {
    (<any>instruction.attribute.bindables)['viewModel'] = new ViewModelRef(this.parser.parse(instruction.srcOrExpr, BindingType.IsRef));
  }
}

@customAttribute('view-model')
export class ViewModelCustomAttribute  {
  // public bound(flags: BindingFlags, scope: IScope): void {
  //   (<any>this).$behavior.bindables.viewModel.$bind(flags, scope);
  // }
}

window['au'] = new Aurelia()
  .register(
    BasicConfiguration,
    DebugConfiguration,
    <any>ViewModelCustomAttribute,
    <any>Pythagoras,
    {
      register(container: IContainer) {
        registerPluginSrv(container);
        registerParser(container);
        container.register(Registration.instance('binding-command:ref', new ViewModelRefBindingCommand(container.get(IExpressionParser))));
        container.register(Registration.instance('render-strategy:ref', new ViewModelRefRenderStrategy(container.get(IExpressionParser), container)));
      }
    }
  )
  .app({ host: document.querySelector('app'), component: new App() })
  .start();

