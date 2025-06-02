import type BpmnModeler from 'bpmn-js/lib/Modeler';
import type CommandStack from 'diagram-js/lib/command/CommandStack';

export function setupKeyboardShortcuts(modeler: BpmnModeler) {
  const commandStack = modeler.get<CommandStack>('commandStack');

  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          if (commandStack.canUndo()) commandStack.undo();
          break;
        case 'y':
          if (commandStack.canRedo()) commandStack.redo();
          break;
      }
    }
  });
}
