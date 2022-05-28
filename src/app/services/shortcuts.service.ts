import { Injectable } from '@angular/core';
import {Observable,fromEvent } from 'rxjs';
import {Subject } from 'rxjs';
import {Keyboard_Shortcut} from 'src/app/models/RestModels';


interface StopPropagationFunction{
	(): void;
}

export interface KeyboardShortcutEvent
{
	event:KeyboardEvent;
	shortcut:Partial<Keyboard_Shortcut>;
	stopPropagation: StopPropagationFunction;
}


@Injectable({
	providedIn: 'root'
})

export class ShortcutsService {

	static readonly ESCAPE = 'Escape';
	static readonly ARROW_UP = 'ArrowUp';
	static readonly ARROW_DOWN ='ArrowDown';
	static readonly ARROW_LEFT = 'ArrowLeft';
	static readonly ARROW_RIGHT = 'ArrowRight';
	static readonly ENTER = 'Enter';
	static readonly SPACE = 'Space';

	public keyUpObserver: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window.document.body, 'keyup');
	public keyDownObserver:Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window.document.body, 'keydown');
	public shortcuts:Subject<KeyboardShortcutEvent> = new Subject<KeyboardShortcutEvent>();

	public kb_shortcuts:Record<string,Partial<Keyboard_Shortcut>> = {
		'Escape' : { name: ShortcutsService.ESCAPE, key_combination: 'Escape' },
		'ArrowUp' : { name: ShortcutsService.ARROW_UP, key_combination: 'ArrowUp' },
		'ArrowDown' : { name: ShortcutsService.ARROW_DOWN, key_combination: 'ArrowDown' },
		'ArrowLeft' : { name: ShortcutsService.ARROW_LEFT , key_combination: 'ArrowLeft' },
		'ArrowRight' : { name: ShortcutsService.ARROW_RIGHT, key_combination: 'ArrowRight' },
		'CTRL+A' : { name: 'NewClient', key_combination: 'CTRL+A' },
		'F6' : { name: "ADD_EXPENSE", key_combination:"F6" },
		'F8' : { name: "PAGAR", key_combination:"F8" },
		'F9' : { name: "CORTE_CAJA", key_combination:"F9" },
		"Enter" : { name: "Enter", key_combination:"Enter" },
		"Enter+Shift" : { name: "Enter+Shift", key_combination:"Enter+Shift" },
		"F7" : { name: "ASIGN_PRICE", key_combination:"F7" },
		"Space" : { name: "Space", key_combination:" " },
		"Backspace" : { name: "Backspace", key_combination:"Backspace" },
		"F4" : { name: "ADD_FUNDS", key_combination:"F4" },
		"F2" : { name: "F2", key_combination:"F2" },
		//"F11" : { name: "F11", key_combination:"F11" }
	};
	constructor()
	{

		this.keyDownObserver.subscribe((evt:KeyboardEvent)=>this.keyDownHandler(evt));
		this.keyUpObserver.subscribe((evt:KeyboardEvent)=>this.keyUpHandler(evt));
	}

	keyDownHandler(evt:KeyboardEvent)
	{
		//console.table({ code: evt.code, key: evt.key, evt });

		if( evt.key == null )
		{
			return;
		}

		let keyArrows:string[] = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Backspace','Enter'];

		if( keyArrows.includes(evt.code)  )
		{
			let code = evt.code
			if( evt.shiftKey )
			{
				code+='+Shift';
			}

			if( !(code in this.kb_shortcuts) )
				return;

			let ks:KeyboardShortcutEvent = {
				shortcut: this.kb_shortcuts[ code ],
				event: evt,
				stopPropagation: ()=>{
					//console.log('Stoping prop on keys arrows');
					evt.preventDefault();
					evt.stopPropagation();
				}
			};

			this.shortcuts.next( ks );
			return;
		}

		let fnKeyRegex = /^F\d+$/;

		//Si teclas de comando no procesamos nada
		let commandKeys:string[] = ['AltLeft','AltGraph','AltRight','Control','Shift','Escape','Tab','Meta'];
		if( commandKeys.includes(evt.key) )
			return;

		//Only for ctr o 2 keys
		if( !(evt.altKey || evt.ctrlKey || evt.metaKey ) && !fnKeyRegex.test( evt.key ) )
		{
			return;
		}

		let combination = '';

		if( evt.altKey )
		{
			combination+= 'ALT+';
		}
		else if( evt.ctrlKey )
		{
			combination+= 'CTRL+';
		}
		else if( evt.metaKey )
		{
			combination+='META+';
		}

		if( fnKeyRegex.test( evt.key ) )
		{
			combination+= evt.key;

			if( combination in this.kb_shortcuts )
			{
				let ks:KeyboardShortcutEvent = {
					shortcut: this.kb_shortcuts[ combination ],
					event: evt,
					stopPropagation: ()=>{
						//console.log('foooooo stop on function keys');
						evt.preventDefault();
						evt.stopPropagation();
					}
				};

				this.shortcuts.next( ks );
				return;
			}
			return;
		}

		if( combination == '' )
			return;

		if(/^[a-z]$/.test( evt.key  ) )
		{
			combination+=evt.key.toUpperCase();
		}
		else
		{
			combination+=evt.code;
		}

		if( combination in this.kb_shortcuts )
		{
			let ks:KeyboardShortcutEvent = {
				shortcut: this.kb_shortcuts[ combination ],
				event: evt,
				stopPropagation: ()=>{
					//console.log('Stop prop on combination');
					evt.preventDefault();
					evt.stopPropagation();
				}
			};
			this.shortcuts.next( ks );
		}
	}

	keyUpHandler(evt:KeyboardEvent)
	{

		let keyArrows:string[] = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Backspace','Enter'];

		if( keyArrows.includes(evt.key)  )
		{
			return;
		}

		if( evt.altKey || evt.ctrlKey || evt.metaKey )
		{
			return;
		}

		if(/^[a-z]$/.test( evt.key ) )
		{
			let code = evt.key.toUpperCase();
			if( code in this.kb_shortcuts )
			{
				let ks:KeyboardShortcutEvent = {
					shortcut: this.kb_shortcuts[ code ],
					event: evt,
					stopPropagation: ()=>{
						evt.preventDefault();
						evt.stopPropagation();
						//console.log('Stop prop on code');
					}
				};
				this.shortcuts.next( ks );
				return;
			}
		}
		else
		{
			let code = evt.code;
			if( code in this.kb_shortcuts )
			{
				let ks:KeyboardShortcutEvent = {
					shortcut: this.kb_shortcuts[ code ],
					event: evt,
					stopPropagation: ()=>{

						//console.log('Stop prop on shortcut');
						evt.preventDefault();
						evt.stopPropagation();
					}
				};
				this.shortcuts.next( ks );
				return;
			}
		}
		//Only for 1 key handler
	}
}
