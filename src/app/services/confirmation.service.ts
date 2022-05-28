import { Injectable } from '@angular/core';
import { Observable,of, Subject,fromEvent, ReplaySubject } from 'rxjs';
import { mergeMap,take,single,takeLast,takeUntil,withLatestFrom } from 'rxjs/operators';

export interface ConfirmationResult
{
	accepted:boolean;
	obj:any;
}

@Injectable({
	providedIn: 'root'
})
export class ConfirmationService {

	confirm = new Subject<ConfirmationResult>();
	obj:any = null;
	title:string = '';
	description:string = '';
	ok_button:string = '';
	cancel_button:string = '';
	show_confirmation:boolean = false;

	constructor()
	{
		fromEvent(window.document.body, 'keyup').subscribe((evt:any)=>
		{
			if( evt.key == "Escape" )
			{
				if( this.show_confirmation )
					this.onCancel();
			}
		},(error)=>{
			console.log(error);
		});

	}

	showConfirmAlert(obj:any, title:string,description:string, ok_button:string = 'OK', cancel_button:string='Cancelar'):Observable<ConfirmationResult>
	{
		this.title = title;
		this.obj = obj;
		this.description = description;
		this.ok_button = ok_button;
		this.cancel_button = cancel_button;
		this.show_confirmation = true;

		return this.confirm.asObservable().pipe( take(1) );
	}

	onCancel()
	{
		this.confirm.next({accepted: false , obj: this.obj });
		this.show_confirmation = false;
	}

	onAccept()
	{
		this.confirm.next({ accepted: true, obj: this.obj });
		this.show_confirmation = false;
	}
}
