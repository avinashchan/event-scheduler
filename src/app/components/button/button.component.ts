import { Component, input } from '@angular/core';

@Component({
  selector: 'button[app-button]',
  template: `<ng-content></ng-content>`,
  host: {
    class:
      'flex items-center justify-center py-2 px-4 text-black bg-gray-200 hover:outline hover:bg-gray-400 hover:outline-gray-400 focus:outline-gray-400',
    '[class.rounded-sm]': '!rounded()',
    '[class.rounded-full]': 'rounded()',
    '[class.!bg-red-800]': 'buttonType() === "primary"',
    '[class.!text-white]': 'buttonType() === "primary"',
    '[class.!bg-gray-600]': 'disabled()',
  },
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  buttonType = input<'default' | 'primary'>('default');
  rounded = input<boolean>(false);
  disabled = input<boolean>(false);
}
