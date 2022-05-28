import { Component, OnInit, Input,Output,EventEmitter	} from '@angular/core';
import { ShortcutsService } from '../../services/shortcuts.service';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

	@Input() biggest_posible:boolean = false;
	@Input() show:boolean = false;
	@Input() closable:boolean = true;
	@Output() showChange= new EventEmitter<boolean>();

	constructor(private ss:ShortcutsService)
	{

	}

	ngOnInit()
	{
		this.ss.shortcuts.subscribe((response)=>
		{
			if( !this.show )
				return;

			if( response.shortcut.name == ShortcutsService.ESCAPE && this.closable )
			{
				this.showChange.emit( false );
			}
		});
	}
	close()
	{
			this.showChange.emit( false );
	}
}
