import { Component , OnInit} from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import {ConfirmationService} from './services/confirmation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
	title = 'POS';

	constructor(public route: ActivatedRoute,public confirmation_service:ConfirmationService)
	{

	}

	onActivate(evt:any)
	{
		this.scrollTop();
	}

	ngOnInit()
	{
		this.route.paramMap.subscribe(()=>
		{
			this.scrollTop();
		});

		this.route.queryParams.subscribe(()=>
		{
			this.scrollTop();
		});
	}

	scrollTop()
	{
		setTimeout(()=>{
			let x = document.querySelector('.custom_scrollbar');
			if( x )
				x.scrollTo(0,0);
		},500);
	}
}
